import { OUTCOME_COLORS } from '../logic/probability';

export default function PowerBar({ segments, sliderPosition, disabled }) {
  return (
    <section className="power-panel">
      <div className="power-title-row">
        <h2>Probability Power Bar</h2>
        <span>{disabled ? 'Locked' : 'Live'}</span>
      </div>

      <div className="power-bar-wrapper">
        <div className="power-bar">
          {segments.map((segment) => (
            <div
              key={segment.outcome}
              className="power-segment"
              style={{
                width: `${segment.probability * 100}%`,
                backgroundColor: OUTCOME_COLORS[segment.outcome],
              }}
              title={`${segment.outcome} (${(segment.probability * 100).toFixed(0)}%)`}
            >
              <span>{segment.outcome}</span>
            </div>
          ))}

          <div
            className="slider-indicator"
            style={{ left: `${sliderPosition * 100}%` }}
          />
        </div>
      </div>

      <div className="power-legend">
        {segments.map((segment) => (
          <div className="legend-item" key={`legend-${segment.outcome}`}>
            <span
              className="legend-color"
              style={{ backgroundColor: OUTCOME_COLORS[segment.outcome] }}
            />
            <span>
              {segment.outcome}: {(segment.probability * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
