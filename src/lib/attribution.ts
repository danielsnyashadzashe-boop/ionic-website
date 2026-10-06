/**
 * Where a lead came from.
 *
 * The brief asked to see where most leads are coming from. Nothing on the
 * site recorded that: every enquiry arrived with a page name and nothing
 * else, so "most of our leads come from LinkedIn" was an opinion.
 *
 * This captures the touch that brought someone to the site and keeps it for
 * the length of the visit, because the page they land on and the page they
 * finally enquire from are rarely the same one. Somebody arrives on a case
 * study from a search, reads three more pages and enquires from /contact/.
 * Attributing that to /contact/ tells you nothing you can act on.
 *
 * Two rules:
 *
 *  - **First touch wins.** Once a visit has a source, later internal
 *    navigation does not overwrite it. A referrer from our own domain is
 *    ignored entirely.
 *  - **Nothing identifying is stored.** Campaign tags, a referrer host and a
 *    path. No cookie, no id, no fingerprint, nothing that follows anyone
 *    between visits. It lives in sessionStorage and dies with the tab, which
 *    is also why it needs no consent banner.
 */

export interface Attribution {
  /** utm_source, or the referring host, or 'direct'. */
  source: string;
  /** utm_medium, or a guess from the referrer: 'search' | 'social' | 'referral'. */
  medium: string;
  /** utm_campaign, where one was tagged. */
  campaign: string;
  /** The first page of the visit. */
  landing: string;
  /** The full referrer host, kept separately from `source` for honesty. */
  referrer: string;
}

const KEY = 'ionic.attribution';

/**
 * Hosts we can classify without pretending to maintain a referrer database.
 * Anything unrecognised is 'referral' and keeps its host, which is more
 * useful than a wrong label.
 */
const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|baidu|yandex)\./i;
const SOCIAL = /(^|\.)(linkedin|facebook|instagram|twitter|x|t|threads|youtube|reddit|whatsapp)\.(com|co|me|net)$/i;

/**
 * Link shorteners that belong to a platform. Without these, a click from a
 * LinkedIn post arrives as `lnkd.in` and is filed as a generic referral,
 * which would understate the one channel we are most likely to be using.
 */
const SHORTENERS: Record<string, string> = {
  'lnkd.in': 'social',
  'fb.me': 'social',
  'youtu.be': 'social',
};

function classify(host: string): string {
  if (!host) return 'direct';
  const short = SHORTENERS[host.replace(/^www\./, '').toLowerCase()];
  if (short) return short;
  if (SEARCH.test(host)) return 'search';
  if (SOCIAL.test(host)) return 'social';
  return 'referral';
}

/**
 * Read a safe, short query value. Campaign tags are attacker-controlled text.
 *
 * The pipe is excluded deliberately: it is the separator in the line these
 * values end up in, so letting one through would let a crafted `utm_campaign`
 * forge extra fields in the enquiry email.
 */
function param(q: URLSearchParams, name: string): string {
  const raw = q.get(name) ?? '';
  return raw.replace(/[^\w .\-/]/g, '').slice(0, 60);
}

function capture(): Attribution {
  const q = new URLSearchParams(window.location.search);

  let referrerHost = '';
  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      // Our own pages are not a source. Without this, every enquiry would be
      // attributed to whichever page the visitor happened to read last.
      if (url.host !== window.location.host) referrerHost = url.host;
    }
  } catch {
    /* a malformed referrer is the same as none */
  }

  const utmSource = param(q, 'utm_source');
  const medium = param(q, 'utm_medium') || classify(referrerHost);

  return {
    source: utmSource || referrerHost || 'direct',
    medium,
    campaign: param(q, 'utm_campaign'),
    landing: window.location.pathname,
    referrer: referrerHost,
  };
}

/**
 * The attribution for this visit, captured on first call and reused after.
 *
 * Every read and write is guarded: sessionStorage throws in a private window
 * with site data blocked, and a form that cannot be submitted because
 * analytics failed would be a self-inflicted wound.
 */
export function getAttribution(): Attribution {
  try {
    const stored = window.sessionStorage.getItem(KEY);
    if (stored) return JSON.parse(stored) as Attribution;
  } catch {
    /* fall through and capture fresh */
  }

  const fresh = capture();
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    /* the visit is still attributed, it just will not survive the next page */
  }
  return fresh;
}

/**
 * One line for the enquiry email, so it is readable in an inbox and
 * greppable once there is a CRM to read it.
 */
export function attributionLine(a: Attribution): string {
  const parts = [`source=${a.source}`, `medium=${a.medium}`];
  if (a.campaign) parts.push(`campaign=${a.campaign}`);
  parts.push(`landing=${a.landing}`);
  if (a.referrer && a.referrer !== a.source) parts.push(`referrer=${a.referrer}`);

  return parts.join(' | ');
}
