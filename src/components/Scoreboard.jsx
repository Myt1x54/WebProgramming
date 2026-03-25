import { getBallsRemaining, getOversDisplay, getOversRemainingDisplay } from '../logic/gameEngine';

function ScoreCard({ label, value }) {
  return (
    <div className="score-card">
      <span className="score-label">{label}</span>
      <span className="score-value">{value}</span>
    </div>
  );
}

export default function Scoreboard({ runs, wickets, ballsPlayed }) {
  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>
      <div className="score-grid">
        <ScoreCard label="Runs" value={runs} />
        <ScoreCard label="Wickets" value={wickets} />
        <ScoreCard label="Overs" value={getOversDisplay(ballsPlayed)} />
        <ScoreCard label="Overs Left" value={getOversRemainingDisplay(ballsPlayed)} />
        <ScoreCard label="Balls Left" value={getBallsRemaining(ballsPlayed)} />
      </div>
    </section>
  );
}
