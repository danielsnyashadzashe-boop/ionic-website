import type { ImageMetadata } from 'astro';

import nightEngineering from '@/assets/photos/night-engineering.jpg';
import analyticsBriefing from '@/assets/photos/analytics-briefing.jpg';
import codeReview from '@/assets/photos/code-review.jpg';
import aiInterface from '@/assets/photos/ai-interface.jpg';
import modelMonitoring from '@/assets/photos/model-monitoring.jpg';
import deliveryTeam from '@/assets/photos/delivery-team.jpg';
import programmeDelivery from '@/assets/photos/programme-delivery.jpg';

/**
 * Photography registry.
 *
 * `alt` is written for a screen reader: what is in the frame, not what we
 * want it to mean. `caption` is the editorial line shown under the image.
 *
 * `illustrative: true` on every entry is deliberate and load-bearing. These
 * are stock photographs. They are not Ionic staff, not client premises, and
 * not any named engagement. Captioning them as though they were would be
 * fabricating evidence on a page clients read, so `Figure.astro` renders a
 * quiet "Illustrative" marker and nothing here claims otherwise.
 */
export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption: string;
  illustrative: boolean;
}

export const photos = {
  nightEngineering: {
    src: nightEngineering,
    alt: 'An engineer wearing headphones works at a desk in a darkened office, facing a monitor of source code, with further code and terminal output projected on the wall behind.',
    caption:
      'Integration work is where transformation budgets quietly go: the seams between tools, owned by nobody.',
    illustrative: true,
  },
  analyticsBriefing: {
    src: analyticsBriefing,
    alt: 'Two colleagues present to a seated group in a brick-walled meeting room, gesturing at a wall display showing bar charts, a pie chart and a projections dashboard.',
    caption:
      'Discovery produces a number, not just a map, and a number is something you can check afterwards.',
    illustrative: true,
  },
  codeReview: {
    src: codeReview,
    alt: 'A hand points at one of two monitors showing C source code beside a network visualisation, with a colleague working at the same desk.',
    caption:
      'Anomaly detection is only as good as the model of normal behind it.',
    illustrative: true,
  },
  aiInterface: {
    src: aiInterface,
    alt: 'A robotic hand and a human hand reach toward each other, fingertips almost touching, against a dark interface of data labels and charts.',
    caption:
      'AI at the core, not bolted on: discovery, decisions and analytics reading the same event stream.',
    illustrative: true,
  },
  modelMonitoring: {
    src: modelMonitoring,
    alt: 'Close view of a monitor showing source code and a terminal panel reporting a live development server, with a hand gesturing toward the screen.',
    caption:
      'Claims are checked against running systems, not slideware.',
    illustrative: true,
  },
  deliveryTeam: {
    src: deliveryTeam,
    alt: 'A software team works across several desks in a brick-walled office, two colleagues reviewing code on a monitor together while others work at their own screens.',
    caption:
      'We work inside your teams, not alongside them, which is the only way the honest answer stays in front of both parties.',
    illustrative: true,
  },
  programmeDelivery: {
    src: programmeDelivery,
    alt: 'A curved pedestrian bridge leading toward modern architecture at sunrise, overlaid with the words “Project Management” and a fine circular diagram.',
    caption:
      'Pilot first, scoped so being wrong is survivable. Expansion follows the result, not the contract.',
    illustrative: true,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
