// Generates page-dates.json: the date each page's entry in pages.json last
// changed, derived from git history. Used for <lastmod> in the sitemap.
// Runs automatically via lint-staged when pages.json is committed.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const PAGES_PATH = 'src/helpers/query/static-data/pages.json';
const OUT_PATH = 'src/helpers/query/static-data/page-dates.json';

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

// One entry map per version of pages.json, newest first. The working tree is
// included first so pages staged for this commit get today's date.
const day = (iso) => iso.slice(0, 10);
const entriesOf = (source) =>
  new Map(JSON.parse(source).map((page) => [page.url, JSON.stringify(page)]));

const snapshots = [
  {
    date: day(new Date().toISOString()),
    entries: entriesOf(readFileSync(PAGES_PATH, 'utf8')),
  },
  ...git('log', '--format=%H %cI', '--', PAGES_PATH)
    .trim()
    .split('\n')
    .map((line) => {
      const [sha, date] = line.split(' ');
      return { date: day(date), entries: entriesOf(git('show', `${sha}:${PAGES_PATH}`)) };
    }),
];

// A page's last-modified date is the oldest snapshot in which its entry
// already matches the current one.
const dates = {};
for (const [url, entry] of snapshots[0].entries) {
  for (const snapshot of snapshots) {
    if (snapshot.entries.get(url) !== entry) break;
    dates[url] = snapshot.date;
  }
}

writeFileSync(OUT_PATH, JSON.stringify(dates, null, 2) + '\n');
console.log(`Wrote ${Object.keys(dates).length} page dates to ${OUT_PATH}`);
