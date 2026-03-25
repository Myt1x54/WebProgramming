export default function Controls({
  battingStyle,
  onStyleChange,
  onPlayBall,
  onRestart,
  canPlay,
  canRestart,
  shotLabel,
}) {
  return (
    <section className="controls-panel">
      <h2>Batting Style</h2>
      <div className="style-buttons">
        <button
          type="button"
          className={battingStyle === 'aggressive' ? 'active' : ''}
          onClick={() => onStyleChange('aggressive')}
          disabled={!canPlay}
        >
          Aggressive
        </button>
        <button
          type="button"
          className={battingStyle === 'defensive' ? 'active' : ''}
          onClick={() => onStyleChange('defensive')}
          disabled={!canPlay}
        >
          Defensive
        </button>
      </div>

      <button
        type="button"
        className="shot-btn"
        onClick={onPlayBall}
        disabled={!canPlay}
      >
        {shotLabel}
      </button>

      <button
        type="button"
        className="restart-btn"
        onClick={onRestart}
        disabled={!canRestart}
      >
        Restart Game
      </button>
    </section>
  );
}
