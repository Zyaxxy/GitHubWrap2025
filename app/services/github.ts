import { GitHubStats } from '../types';
import { COLORS } from '../types';

// Helper to simulate delay for dramatic effect
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ARCHETYPES = [
  // 0. Frontend
  { name: "The Div Centerer", description: "You excel at pixel perfection but panic when the API is down.", quote: "Is it vertical-align: middle or flex items-center?" },
  // 1. Broken Code
  { name: "The Merge Conflict", description: "Your code works on your machine. Nowhere else.", quote: "It was fine before I pulled main." },
  // 2. Night Owl
  { name: "The Night Shift", description: "You think 3 AM is prime productivity time.", quote: "I'll sleep when the build passes." },
  // 3. Reckless
  { name: "The Force Pusher", description: "Git history is a suggestion, not a record.", quote: "Oops, deleted production." },
  // 4. Backend
  { name: "The Backend Hermit", description: "You fear CSS. You communicate exclusively in JSON.", quote: "It returns 200 OK, what more do you want?" },

  // --- NEW ARCHETYPES ---
  // 5. Refactorer
  { name: "The Marie Kondo", description: "You derive joy from deleting legacy code. Less code = fewer bugs.", quote: "This function does not spark joy. Delete." },
  // 6. DevOps/Cloud
  { name: "The YAML Engineer", description: "You spend 8 hours configuring Kubernetes to run 5 lines of code.", quote: "Just one more indentation fix..." },
  // 7. Hobbyist
  { name: "The Weekend Warrior", description: "You have a day job, but your true passion project lives on Saturdays.", quote: "I can fix this bug on Sunday morning." },
  // 8. Data Science
  { name: "The Data Wizard", description: "You train models that are smarter than you. Python is your mother tongue.", quote: "It works in the Jupyter Notebook." },
  // 9. Low Volume / Lurker
  { name: "The LGTM Stamp", description: "You don't write much code, but you judge everyone else's.", quote: "Looks Good To Me." },
  // 10. Hipster
  { name: "The Syntax Hipster", description: "You refuse to use a language created before 2020. Rust? Zig? Carbon?", quote: "It's memory safe and compiles to WASM." },
  // 11. Consistency
  { name: "The Commit Bot", description: "You have a green square for every day of the year. Are you human?", quote: "Consistency is key." }
];

export async function fetchGitHubData(username: string, token?: string): Promise<GitHubStats> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // 1. Fetch Basic Profile
    // If token is provided, verify we can access this user or it's 'me'
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error('User not found');
      if (userRes.status === 403) throw new Error('Rate limit exceeded');
      throw new Error('GitHub API Error');
    }
    const user = await userRes.json();

    // 2. Fetch Repos (Enhanced for Auth)
    // If authenticated, we try to fetch all repos (including private if scope allows and user matches)
    let reposUrl = `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`;
    if (token) {
      // use /user/repos to get private ones if we are the authenticated user
      // We need to check if 'username' matches the token's user, or just try /user/repos
      // For simplicity, let's trust the flow. If we have a token, we likely want "my" data.
      // But the function arg is 'username'.
      // If username equals the authenticated user's login, use /user/repos.
      const meRes = await fetch('https://api.github.com/user', { headers });
      if (meRes.ok) {
        const me = await meRes.json();
        if (me.login.toLowerCase() === username.toLowerCase()) {
          reposUrl = `https://api.github.com/user/repos?per_page=100&type=all&sort=pushed`;
        }
      }
    }

    const reposRes = await fetch(reposUrl, { headers });
    const repos = reposRes.ok ? await reposRes.json() : [];

    // 3. Fetch Events
    // Auth token increases rate limit and visibility of private events
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
    const commitDates: string[] = [];
    const commitMessages: string[] = [];
    let fridayDeploys = 0;
    let weekendCommits = 0; // NEW Metric

    if (Array.isArray(events) && events.length > 0) {
      events.forEach((event: any) => {
        const date = new Date(event.created_at);

        if (['PushEvent', 'PullRequestEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestReviewEvent'].includes(event.type)) {
          commitDates.push(date.toISOString());
          commitHours.push(date.getHours());
        }

        if (event.type === 'PushEvent') {
          // Commit times (Local time of the user's browser processing this)
          // commitHours already pushed above

          // Friday check (Friday is day 5)
          if (date.getDay() === 5 && date.getHours() >= 16) {
            fridayDeploys++;
          }

          // Weekend check (Sunday=0, Saturday=6)
          if (date.getDay() === 0 || date.getDay() === 6) {
            weekendCommits++;
          }

          if (event.payload && event.payload.commits) {
            event.payload.commits.forEach((c: any) => {
              totalCommits++;
              if (c.message && !c.message.startsWith('Merge')) {
                commitMessages.push(c.message);
              }
            });
          }
        }
      });
    }

    // Extrapolate Total Commits for the Year
    let estimatedCommits = totalCommits;
    if (events.length > 0) {
      const firstEventDate = new Date(events[events.length - 1].created_at);
      const lastEventDate = new Date(events[0].created_at);
      const timeDiff = lastEventDate.getTime() - firstEventDate.getTime();
      const daysDiff = Math.max(timeDiff / (1000 * 3600 * 24), 1);

      if (daysDiff < 365 && daysDiff > 0) {
        const dailyRate = totalCommits / daysDiff;
        estimatedCommits = Math.floor(dailyRate * 365);
      }
    }

    // Fallback if user has no recent public events but has repos
    if (estimatedCommits < 50 && user.public_repos > 0) {
      estimatedCommits = Math.max(estimatedCommits, user.public_repos * 10);
    }

    // Synthetic data if events are missing but we have estimated commits
    if (commitDates.length === 0 && estimatedCommits > 0) {
      const today = new Date();
      // Generate some random dates over the last year
      const count = Math.min(estimatedCommits, 150);
      for (let i = 0; i < count; i++) {
        const d = new Date(today.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        commitDates.push(d.toISOString());
        commitHours.push(Math.floor(Math.random() * 24));
      }
    }

    const estimatedHours = Math.floor(estimatedCommits * 0.75);

    // Peak Time
    const hourCounts = new Array(24).fill(0);
    commitHours.forEach(h => hourCounts[h]++);

    let peakHour = 14;
    if (commitHours.length > 0) {
      peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    }

    const peakTimeStr = `${peakHour}:00`;

    let peakTimeCategory: any = 'Lunch Breaker';
    if (peakHour >= 0 && peakHour < 5) peakTimeCategory = 'Vampire';
    else if (peakHour >= 5 && peakHour < 10) peakTimeCategory = 'Early Bird';
    else if (peakHour >= 22) peakTimeCategory = 'Night Owl';

    // Metrics Generation
    const charCodeSum = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratio = 0.8 + ((charCodeSum % 40) / 100);

    const additions = Math.floor(estimatedCommits * 42 * ratio);
    const deletions = Math.floor(estimatedCommits * 35 / ratio);
    const ignoredReviews = Math.floor(estimatedCommits / 25);
    const forcePushes = Math.floor(estimatedCommits / 150) + (charCodeSum % 3);

    // --- DETERMINE ARCHETYPE ---

    // Language Checks
    const isJS = topLanguages.some(l => ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React', 'Svelte'].includes(l.name));
    const isBackend = topLanguages.some(l => ['Java', 'C#', 'Go', 'PHP', 'C++'].includes(l.name));
    const isData = topLanguages.some(l => ['Jupyter Notebook', 'R', 'Python', 'Julia'].includes(l.name));
    const isDevOps = topLanguages.some(l => ['Shell', 'HCL', 'Dockerfile', 'Makefile'].includes(l.name));
    const isHipster = topLanguages.some(l => ['Rust', 'Zig', 'Elixir', 'Haskell', 'Lua'].includes(l.name));

    // Behavior Checks
    const isWeekendWarrior = weekendCommits > (totalCommits * 0.3); // > 30% commits on weekends
    const isRefactorer = deletions > (additions * 1.2); // Deletes significantly more than adds

    let archetype = ARCHETYPES[0]; // Default

    // Logic Priority Chain
    if (forcePushes > 10) {
      archetype = ARCHETYPES[3]; // Force Pusher (Danger)
    } else if (estimatedCommits < 20) {
      archetype = ARCHETYPES[9]; // LGTM Stamp (Low activity)
    } else if (isRefactorer) {
      archetype = ARCHETYPES[5]; // Marie Kondo
    } else if (isWeekendWarrior) {
      archetype = ARCHETYPES[7]; // Weekend Warrior
    } else if (peakTimeCategory === 'Vampire' || peakTimeCategory === 'Night Owl') {
      archetype = ARCHETYPES[2]; // Night Shift
    } else if (isDevOps) {
      archetype = ARCHETYPES[6]; // YAML Engineer
    } else if (isData) {
      archetype = ARCHETYPES[8]; // Data Wizard
    } else if (isHipster) {
      archetype = ARCHETYPES[10]; // Syntax Hipster
    } else if (estimatedCommits > 1500) {
      archetype = ARCHETYPES[11]; // Commit Bot (High volume)
    } else if (isBackend && !isJS) {
      archetype = ARCHETYPES[4]; // Backend Hermit
    } else if (additions < deletions) {
      archetype = ARCHETYPES[1]; // Merge Conflict (Generic bad coder)
    } else {
      archetype = ARCHETYPES[0]; // Div Centerer (Default Frontend)
    }

    await delay(1500);

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
      commitDates,
      archetype
    };

  } catch (error) {
    console.error("GitHub API Error:", error);
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
      commitDates: [],
      archetype: { name: "The Ghost", description: "You code so fast the API can't keep up.", quote: "403 Forbidden." }
    };
  }
}