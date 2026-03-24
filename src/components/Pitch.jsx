import { useEffect, useRef } from 'react';

export default function Pitch({ ballProgress, isSwinging, lastOutcome }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Outfield gradient background.
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#55b556');
    bg.addColorStop(1, '#2f8e3d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Pitch strip.
    ctx.fillStyle = '#d6b37e';
    ctx.fillRect(width * 0.42, 20, width * 0.16, height - 40);

    // Crease lines.
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.39, height * 0.78);
    ctx.lineTo(width * 0.61, height * 0.78);
    ctx.moveTo(width * 0.39, height * 0.2);
    ctx.lineTo(width * 0.61, height * 0.2);
    ctx.stroke();

    // Stumps.
    ctx.fillStyle = '#f1f5f9';
    [0.47, 0.5, 0.53].forEach((x) => {
      ctx.fillRect(width * x - 2, height * 0.74, 4, 28);
      ctx.fillRect(width * x - 2, height * 0.22, 4, 28);
    });

    const batsmanX = width * 0.5;
    const batsmanY = height * 0.83;

    // Batsman body.
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(batsmanX, batsmanY - 26, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(batsmanX, batsmanY - 15);
    ctx.lineTo(batsmanX, batsmanY + 16);
    ctx.stroke();

    // Bat swing animation rotates bat around hand pivot.
    const swingAngle = isSwinging ? -0.95 : -0.35;
    ctx.save();
    ctx.translate(batsmanX + 6, batsmanY - 6);
    ctx.rotate(swingAngle);
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, -5, 52, 10);
    ctx.restore();

    // Ball travels from top crease (bowler side) to batsman.
    const ballStartY = height * 0.24;
    const ballEndY = height * 0.78;
    const ballY = ballStartY + (ballEndY - ballStartY) * ballProgress;
    const ballX = width * 0.5;

    ctx.beginPath();
    ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#b91c1c';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#fee2e2';
    ctx.stroke();

    if (lastOutcome !== null) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px Verdana, sans-serif';
      ctx.textAlign = 'left';
      const text = lastOutcome === 'WICKET' ? 'WICKET!' : `${lastOutcome} RUNS`;
      ctx.fillText(text, 16, 34);
    }
  }, [ballProgress, isSwinging, lastOutcome]);

  return (
    <section className="pitch-panel">
      <h2>Cricket Pitch</h2>
      <canvas
        ref={canvasRef}
        className="pitch-canvas"
        width={640}
        height={360}
        aria-label="2D cricket pitch"
      />
    </section>
  );
}
