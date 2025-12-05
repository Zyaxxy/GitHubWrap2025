import { GitHubStats } from '../types';
import { COLORS } from '../types';
// Helper to simulate delay for dramatic effect
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ARCHETYPES = [
  { name: "The Div Centerer", description: "You excel at pixel perfection but panic when the API is down.", quote: "Is it vertical-align: middle or flex items-center?" },
  { name: "The Merge Conflict", description: "Your code works on your machine. Nowhere else.", quote: "It was fine before I pulled main." },
  { name: "The Night Shift", description: "You think 3 AM is prime productivity time.", quote: "I'll sleep when the build passes." },
  { name: "The Force Pusher", description: "Git history is a suggestion, not a record.", quote: "Oops, deleted production." },
  { name: "The Backend Hermit", description: "You fear CSS.", quote: "It returns 200 OK, what more do you want?" }
];

export async function fetchGitHubData(username: string): Promise<GitHubStats> {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // 1. Fetch Basic Profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error('User not found');
      if (userRes.status === 403) throw new Error('Rate limit exceeded');
      throw new Error('GitHub API Error');
    }
    const user = await userRes.json();

    // 2. Fetch Repos (Up to 100 to get better language distribution)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, { headers });
    const repos = reposRes.ok ? await reposRes.json() : [];

    // 3. Fetch Events (Up to 10 pages / 1000 events to get better activity stats)
    // The Events API is limited to the last 90 days.
    const eventPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const eventsPromises = eventPages.map(page =>
      fetch(`https://api.github.com/users/${username}/events?per_page=100&page=${page}`, { headers })
        .then(res => res.ok ? res.json() : [])
    );
    const eventsResults = await Promise.all(eventsPromises);
    const events = eventsResults.flat().filter((e: any) => e && e.type);

    // --- ANALYTICS LOGIC ---

    // Calculate Languages
    const langMap: Record<string, number> = {};
    let heaviestRepo = { name: 'None', size: 0 };

    if (Array.isArray(repos)) {
      repos.forEach((repo: any) => {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
        if (repo.size > heaviestRepo.size) {
          heaviestRepo = { name: repo.name, size: repo.size };
        }
      });
    }

    const topLanguages = Object.entries(langMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((l, i) => ({
        ...l,
        fill: [COLORS.green, COLORS.rose, COLORS.blue, COLORS.pink, '#888888'][i % 5]
      }));

    // Analyze Events
    let totalCommits = 0;
    const commitHours: number[] = [];
    const commitMessages: string[] = [];
    let fridayDeploys = 0;

    if (Array.isArray(events) && events.length > 0) {
      events.forEach((event: any) => {
        const date = new Date(event.created_at);

        if (event.type === 'PushEvent') {
          // Commit times (Local time of the user's browser processing this)
          commitHours.push(date.getHours());

          // Friday check (Friday is day 5)
          // We define "Deploy" loosely as pushing code on Friday late afternoon
          if (date.getDay() === 5 && date.getHours() >= 16) {
            fridayDeploys++;
          }

          if (event.payload && event.payload.commits) {
            event.payload.commits.forEach((c: any) => {
              totalCommits++;
              // Filter out merge commits usually starting with 'Merge'
              if (c.message && !c.message.startsWith('Merge')) {
                commitMessages.push(c.message);
              }
            });
          }
        }
      });
    }

    // Extrapolate Total Commits for the Year
    // Since Events API is last 90 days max, we calculate velocity.
    let estimatedCommits = totalCommits;

    if (events.length > 0) {
      const firstEventDate = new Date(events[events.length - 1].created_at);
      const lastEventDate = new Date(events[0].created_at);
      const timeDiff = lastEventDate.getTime() - firstEventDate.getTime();
      const daysDiff = Math.max(timeDiff / (1000 * 3600 * 24), 1); // Avoid div by zero

      // If data covers less than a year, project it
      if (daysDiff < 365 && daysDiff > 0) {
        const dailyRate = totalCommits / daysDiff;
        estimatedCommits = Math.floor(dailyRate * 365);
      }
    }

    // Fallback if user has no recent public events but has repos
    if (estimatedCommits < 50 && user.public_repos > 0) {
      estimatedCommits = Math.max(estimatedCommits, user.public_repos * 10);
    }

    const estimatedHours = Math.floor(estimatedCommits * 0.75); // ~45 mins per commit

    // Peak Time
    const hourCounts = new Array(24).fill(0);
    commitHours.forEach(h => hourCounts[h]++);

    let peakHour = 14; // Default to 2 PM
    if (commitHours.length > 0) {
      peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    }

    const peakTimeStr = `${peakHour}:00`;

    let peakTimeCategory: any = 'Lunch Breaker';
    if (peakHour >= 0 && peakHour < 5) peakTimeCategory = 'Vampire';
    else if (peakHour >= 5 && peakHour < 10) peakTimeCategory = 'Early Bird';
    else if (peakHour >= 22) peakTimeCategory = 'Night Owl';

    // Mocking specific metrics that are impossible to get cheaply via public unauthenticated API
    // We generate "deterministic" numbers based on the username to ensure consistency for the same user.
    const charCodeSum = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratio = 0.8 + ((charCodeSum % 40) / 100); // 0.8 to 1.2 variation

    const additions = Math.floor(estimatedCommits * 42 * ratio);
    const deletions = Math.floor(estimatedCommits * 35 / ratio);
    const ignoredReviews = Math.floor(estimatedCommits / 25);
    const forcePushes = Math.floor(estimatedCommits / 150) + (charCodeSum % 3);

    // Determine Archetype
    let archetype = ARCHETYPES[0];
    const isJS = topLanguages.some(l => ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React', 'Svelte'].includes(l.name));
    const isBackend = topLanguages.some(l => ['Java', 'C#', 'Go', 'Rust', 'Python', 'C++'].includes(l.name));

    if (forcePushes > 5) archetype = ARCHETYPES[3]; // Force Pusher
    else if (peakTimeCategory === 'Vampire' || peakTimeCategory === 'Night Owl') archetype = ARCHETYPES[2]; // Night Shift
    else if (additions < deletions) archetype = ARCHETYPES[1]; // Merge Conflict (Destructive)
    else if (isBackend && !isJS) archetype = ARCHETYPES[4]; // Backend Hermit
    else if (isJS) archetype = ARCHETYPES[0]; // Div Centerer

    await delay(1500); // Increased delay for suspense

    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      totalCommits: estimatedCommits,
      totalHours: estimatedHours,
      peakTime: peakTimeStr,
      peakTimeCategory,
      topLanguages: topLanguages.length > 0 ? topLanguages : [{ name: 'Plain Text', count: 100, fill: COLORS.green }],
      commitWords: commitMessages,
      additions,
      deletions,
      ignoredReviews,
      forcePushes,
      fridayDeploys,
      heaviestRepo: heaviestRepo.name,
      archetype
    };

  } catch (error) {
    console.error("GitHub API Error:", error);
    // Graceful fallback for Rate Limits or Network Errors
    return {
      username: username || "RateLimitedUser",
      avatarUrl: "https://github.com/ghost.png",
      totalCommits: 404,
      totalHours: 300,
      peakTime: "04:00",
      peakTimeCategory: "Vampire",
      topLanguages: [
        { name: "API Limits", count: 100, fill: COLORS.rose },
        { name: "Rate Limits", count: 80, fill: COLORS.blue }
      ],
      commitWords: ["rate", "limit", "exceeded", "sorry", "oops"],
      additions: 0,
      deletions: 0,
      ignoredReviews: 99,
      forcePushes: 99,
      fridayDeploys: 99,
      heaviestRepo: "github_api",
      archetype: { name: "The Ghost", description: "You code so fast the API can't keep up.", quote: "403 Forbidden." }
    };
  }
}