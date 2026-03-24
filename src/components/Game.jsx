import { useEffect, useMemo, useRef, useState } from 'react';
import Commentary from './Commentary.jsx';
import Controls from './Controls.jsx';
import Pitch from './Pitch.jsx';
import PowerBar from './PowerBar.jsx';
import Scoreboard from './Scoreboard.jsx';
import { initialGameState, resetGame, updateScore } from '../logic/gameEngine';
import { buildProbabilitySegments, getOutcomeFromSlider } from '../logic/probability';

const wicketComments = [
  'Clean bowled! The stumps are rattled.',
  'Top edge and taken. That is a big wicket.',
  'Mistimed slog and the batter has to walk back.',
];

const boundaryComments = [
  'Crunched through the gap for a boundary!',
  'That rockets to the fence. Superb timing.',
  'High and handsome. That is maximum distance!',
];

const normalRunComments = [
  'Quick running between the wickets.',
  'Smart placement and they collect safely.',
  'Good cricketing shot for handy runs.',
  'Dot ball. Tight line from the bowler.',
];

const BALL_DURATION_MS = 1300;
const SWING_DURATION_MS = 220;

function getCommentaryForOutcome(outcome) {
  if (outcome === 'WICKET') {
    return wicketComments[Math.floor(Math.random() * wicketComments.length)];
  }

  if (outcome === 4 || outcome === 6) {
    return boundaryComments[Math.floor(Math.random() * boundaryComments.length)];
  }

  return normalRunComments[Math.floor(Math.random() * normalRunComments.length)];
}

export default function Game() {
  const [gameState, setGameState] = useState(initialGameState);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderDirection, setSliderDirection] = useState(1);
  const [ballProgress, setBallProgress] = useState(0);
  const [isBallRunning, setIsBallRunning] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [commentaryText, setCommentaryText] = useState('Pick a style and time your shot.');

  const sliderRafRef = useRef(0);
  const sliderLastTsRef = useRef(0);
  const ballRafRef = useRef(0);

  const segments = useMemo(
    () => buildProbabilitySegments(gameState.battingStyle),
    [gameState.battingStyle],
  );

  useEffect(() => {
    // Power slider animation loops left-right continuously when a ball is playable.
    const tick = (ts) => {
      if (!sliderLastTsRef.current) {
        sliderLastTsRef.current = ts;
      }

      const delta = ts - sliderLastTsRef.current;
      sliderLastTsRef.current = ts;

      setSliderPosition((current) => {
        const speed = 0.0007;
        let next = current + speed * delta * sliderDirection;

        if (next >= 1) {
          next = 1;
          setSliderDirection(-1);
        } else if (next <= 0) {
          next = 0;
          setSliderDirection(1);
        }

        return next;
      });

      sliderRafRef.current = requestAnimationFrame(tick);
    };

    if (!isBallRunning && !gameState.gameOver) {
      sliderRafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(sliderRafRef.current);
      sliderLastTsRef.current = 0;
    };
  }, [isBallRunning, gameState.gameOver, sliderDirection]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(ballRafRef.current);
    };
  }, []);

  const startBallAnimation = (onComplete) => {
    setIsBallRunning(true);
    setBallProgress(0);

    const start = performance.now();

    const animate = (ts) => {
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / BALL_DURATION_MS);
      setBallProgress(progress);

      if (progress < 1) {
        ballRafRef.current = requestAnimationFrame(animate);
        return;
      }

      setIsBallRunning(false);
      onComplete();
    };

    ballRafRef.current = requestAnimationFrame(animate);
  };

  const handlePlayBall = () => {
    if (isBallRunning || gameState.gameOver) {
      return;
    }

    cancelAnimationFrame(sliderRafRef.current);

    // Shot result is mapped from current slider position only.
    const outcome = getOutcomeFromSlider(sliderPosition, segments);

    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), SWING_DURATION_MS);

    startBallAnimation(() => {
      setGameState((current) => {
        const updated = updateScore(current, outcome);
        return updated;
      });
      setCommentaryText(getCommentaryForOutcome(outcome));
      setBallProgress(0);
    });
  };

  const handleStyleChange = (style) => {
    if (isBallRunning || gameState.gameOver) {
      return;
    }

    setGameState((current) => ({ ...current, battingStyle: style }));
  };

  const handleRestart = () => {
    cancelAnimationFrame(sliderRafRef.current);
    cancelAnimationFrame(ballRafRef.current);

    setGameState(resetGame('aggressive'));
    setSliderPosition(0);
    setSliderDirection(1);
    setBallProgress(0);
    setIsBallRunning(false);
    setIsSwinging(false);
    setCommentaryText('Fresh innings. Time your first shot.');
    sliderLastTsRef.current = 0;
  };

  const shotLabel = isBallRunning ? 'Ball In Play...' : 'Play Shot';
  const canPlay = !isBallRunning && !gameState.gameOver;

  return (
    <main className="game-shell">
      <header className="game-header">
        <h1>2D Cricket Batting Game</h1>
        <p>Probability-Based Power Bar System (2 Overs, 2 Wickets)</p>
      </header>

      <div className="layout-grid">
        <aside className="left-column">
          <Scoreboard
            runs={gameState.runs}
            wickets={gameState.wickets}
            ballsPlayed={gameState.ballsPlayed}
          />
          <Controls
            battingStyle={gameState.battingStyle}
            onStyleChange={handleStyleChange}
            onPlayBall={handlePlayBall}
            canPlay={canPlay}
            shotLabel={shotLabel}
          />
          <Commentary text={commentaryText} />
        </aside>

        <section className="right-column">
          <Pitch
            ballProgress={ballProgress}
            isSwinging={isSwinging}
            lastOutcome={gameState.lastOutcome}
          />
          <PowerBar
            segments={segments}
            sliderPosition={sliderPosition}
            disabled={!canPlay}
          />
        </section>
      </div>

      {gameState.gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>Game Over</h2>
            <p>
              Final Score: {gameState.runs}/{gameState.wickets}
            </p>
            <p>Played Balls: {gameState.ballsPlayed}/12</p>
            <button type="button" onClick={handleRestart}>
              Restart Match
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
