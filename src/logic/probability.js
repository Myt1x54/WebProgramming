export const OUTCOME_ORDER = ['WICKET', 0, 1, 2, 3, 4, 6];

export const STYLE_PROBABILITIES = {
  aggressive: {
    WICKET: 0.4,
    0: 0.1,
    1: 0.1,
    2: 0.1,
    3: 0.05,
    4: 0.1,
    6: 0.15,
  },
  defensive: {
    WICKET: 0.15,
    0: 0.25,
    1: 0.2,
    2: 0.2,
    3: 0.05,
    4: 0.1,
    6: 0.05,
  },
};

export const OUTCOME_COLORS = {
  WICKET: '#b91c1c',
  0: '#4b5563',
  1: '#1d4ed8',
  2: '#0ea5e9',
  3: '#06b6d4',
  4: '#16a34a',
  6: '#f59e0b',
};

export function validateProbabilities(probabilityMap) {
  const total = Object.values(probabilityMap).reduce((sum, value) => sum + value, 0);
  return Math.abs(total - 1) < 1e-9;
}

export function buildProbabilitySegments(style) {
  const probabilityMap = STYLE_PROBABILITIES[style];

  if (!probabilityMap) {
    throw new Error(`Unknown style: ${style}`);
  }

  if (!validateProbabilities(probabilityMap)) {
    throw new Error(`Probability total must be exactly 1 for style: ${style}`);
  }

  // Convert probabilities to cumulative segments in [0,1].
  let cursor = 0;
  return OUTCOME_ORDER.map((outcome, index) => {
    const width = probabilityMap[outcome];
    const start = cursor;
    const end = index === OUTCOME_ORDER.length - 1 ? 1 : cursor + width;
    cursor += width;

    return {
      outcome,
      probability: width,
      start,
      end,
    };
  });
}

export function getOutcomeFromSlider(sliderPosition, segments) {
  // Gameplay outcome is determined only by slider position and segment ranges.
  const normalized = Math.max(0, Math.min(0.999999, sliderPosition));
  const match = segments.find(
    (segment) => normalized >= segment.start && normalized < segment.end,
  );

  return match ? match.outcome : segments[segments.length - 1].outcome;
}
