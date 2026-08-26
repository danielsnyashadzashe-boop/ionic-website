/**
 * Projects worked on.
 *
 * Concrete delivered work, as distinct from the case studies (which are the
 * narrative write-ups). Every entry is drawn from what the site publishes.
 *
 * Deliberately no dates: the source material never states engagement years,
 * and inventing a timeline on a page that clients will read is not a
 * cosmetic liberty.
 */

export type ProjectStatus = 'Live' | 'Pilot' | 'Partner' | 'In discussion';

export interface Project {
  client: string;
  deliverable: string;
  discipline: string;
  platform: string;
  status: ProjectStatus;
  tone: 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6';
  /** Headline figure, only where the site states one. */
  metric?: { value: string; label: string };
  /** Links to the full write-up where one exists. */
  study?: string;
}

export const projects: Project[] = [
  {
    client: 'Old Mutual',
    deliverable: 'Group-wide process automation across all business units',
    discipline: 'Process automation',
    platform: 'Process Genesis',
    status: 'Live',
    tone: 'd1',
    metric: { value: '5 yr', label: 'Agreement' },
    study: 'old-mutual',
  },
  {
    client: 'Fidelity',
    deliverable: 'Group digital transformation programme spanning multiple industries',
    discipline: 'Transformation strategy',
    platform: 'Process Genesis',
    status: 'Live',
    tone: 'd1',
    metric: { value: 'Group', label: 'Scope' },
    study: 'fidelity',
  },
  {
    client: 'Bidvest Group',
    deliverable: 'Tender portal for the Execuflora and TopTurf divisions',
    discipline: 'Workflow engineering',
    platform: 'Process Genesis',
    status: 'Live',
    tone: 'd1',
    metric: { value: '2', label: 'Divisions' },
    study: 'bidvest-group',
  },
  {
    client: '3Sixty Health',
    deliverable: 'Fraud, waste and abuse monitoring with process optimisation',
    discipline: 'Risk & fraud detection',
    platform: 'Ionic GRC',
    status: 'Live',
    tone: 'd6',
    study: '3sixty-health',
  },
  {
    client: 'Split Time',
    deliverable: 'Athlete monitoring and race timing platform with AI coaching',
    discipline: 'Custom platform build',
    platform: 'Bespoke',
    status: 'Live',
    tone: 'd4',
    metric: { value: '800k+', label: 'Registrations' },
    study: 'split-time',
  },
  {
    client: 'National Video Vision',
    deliverable: 'Expense automation across a 50-person business, two currencies',
    discipline: 'Finance automation',
    platform: 'ExpenseFlow',
    status: 'Live',
    tone: 'd3',
    metric: { value: '50', label: 'Employees' },
    study: 'national-video-vision',
  },
  {
    client: 'Canadian medical group',
    deliverable: 'ExpenseFlow pilot with a group of 20 doctors',
    discipline: 'Finance automation',
    platform: 'ExpenseFlow',
    status: 'Pilot',
    tone: 'd3',
    metric: { value: '20', label: 'Practitioners' },
  },
  {
    client: 'Niche Consulting',
    deliverable: 'Reseller partnership, migrating an established client base to Ionic ERP',
    discipline: 'Channel & distribution',
    platform: 'Ionic ERP',
    status: 'Partner',
    tone: 'd4',
  },
  {
    client: 'Two Canadian accounting firms',
    deliverable: 'Reseller commitments pending trial completion',
    discipline: 'Channel & distribution',
    platform: 'ExpenseFlow',
    status: 'Partner',
    tone: 'd3',
  },
  {
    client: 'Momentum',
    deliverable: 'GRC platform adoption under evaluation',
    discipline: 'Risk & compliance',
    platform: 'Ionic GRC',
    status: 'In discussion',
    tone: 'd6',
  },
];

/** Disciplines, in the order they should appear as filters. */
export const disciplines = [...new Set(projects.map((p) => p.discipline))];

export const projectStats = {
  total: projects.length,
  live: projects.filter((p) => p.status === 'Live').length,
  clients: new Set(projects.map((p) => p.client)).size,
};
