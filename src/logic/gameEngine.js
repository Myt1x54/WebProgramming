export const TOTAL_BALLS = 12;
export const TOTAL_WICKETS = 2;

export const initialGameState = {
  runs: 0,
  wickets: 0,
  ballsPlayed: 0,
  battingStyle: 'aggressive',
  lastOutcome: null,
  gameOver: false,
};

export function getOversDisplay(ballsPlayed) {
  const over = Math.floor(ballsPlayed / 6);
  const ballInOver = ballsPlayed % 6;
  return `${over}.${ballInOver}`;
}

export function getBallsRemaining(ballsPlayed) {
  return Math.max(0, TOTAL_BALLS - ballsPlayed);
}

export function getOversRemainingDisplay(ballsPlayed) {
  const ballsRemaining = getBallsRemaining(ballsPlayed);
  const over = Math.floor(ballsRemaining / 6);
  const ballInOver = ballsRemaining % 6;
  return `${over}.${ballInOver}`;
}

export function isGameOver(ballsPlayed, wickets) {
  return ballsPlayed >= TOTAL_BALLS || wickets >= TOTAL_WICKETS;
}

export function updateScore(state, outcome) {
  const nextBalls = state.ballsPlayed + 1;
  const nextWickets = outcome === 'WICKET' ? state.wickets + 1 : state.wickets;
  const nextRuns = outcome === 'WICKET' ? state.runs : state.runs + Number(outcome);

  return {
    ...state,
    runs: nextRuns,
    wickets: nextWickets,
    ballsPlayed: nextBalls,
    lastOutcome: outcome,
    gameOver: isGameOver(nextBalls, nextWickets),
  };
}

export function resetGame(style = 'aggressive') {
  return {
    ...initialGameState,
    battingStyle: style,
  };
}
