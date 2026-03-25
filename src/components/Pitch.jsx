import { useEffect, useRef } from 'react';

export default function Pitch({ ballProgress, isSwinging, activeOutcome, lastOutcome }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawRoundedRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const drawPlayer = ({
      x,
      y,
      bodyColor,
      headColor,
      isBowler = false,
      armAngle = 0,
    }) => {
      ctx.save();
      ctx.translate(x, y);

      // Torso.
      ctx.fillStyle = bodyColor;
      drawRoundedRect(-10, -16, 20, 26, 6);
      ctx.fill();

      // Head / helmet.
      ctx.fillStyle = headColor;
      ctx.beginPath();
      ctx.arc(0, -24, 8, 0, Math.PI * 2);
      ctx.fill();

      // Legs.
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-5, 9);
      ctx.lineTo(-7, 23);
      ctx.moveTo(5, 9);
      ctx.lineTo(7, 23);
      ctx.stroke();

      // Left arm.
      ctx.beginPath();
      ctx.moveTo(-8, -9);
      ctx.lineTo(-22, -2);
      ctx.stroke();

      // Right arm (animated for bowler).
      ctx.save();
      ctx.translate(8, -9);
      ctx.rotate(armAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(16, 2);
      ctx.stroke();
      ctx.restore();

      // Bowler wrist ball cue.
      if (isBowler) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(18 * Math.cos(armAngle) + 8, 18 * Math.sin(armAngle) - 9, 2.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawWicketSprite = ({ x, y, scale = 1 }) => {
      const stumpH = 30 * scale;
      const stumpW = 4.2 * scale;
      const spacing = 12 * scale;

      // Wicket shadow to anchor the sprite on the pitch.
      const shadow = ctx.createRadialGradient(x, y + 5 * scale, 1, x, y + 5 * scale, 18 * scale);
      shadow.addColorStop(0, 'rgba(15, 23, 42, 0.32)');
      shadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(x, y + 7 * scale, 20 * scale, 7 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stumps.
      ctx.fillStyle = '#f8fafc';
      [-1, 0, 1].forEach((offset) => {
        const stumpX = x + offset * spacing - stumpW / 2;
        drawRoundedRect(stumpX, y - stumpH, stumpW, stumpH, 2 * scale);
        ctx.fill();
      });

      // Bails.
      const bailY = y - stumpH - 3 * scale;
      ctx.fillStyle = '#e2e8f0';
      drawRoundedRect(x - spacing - 1 * scale, bailY, spacing + 2 * scale, 3 * scale, 1.2 * scale);
      ctx.fill();
      drawRoundedRect(x - 1 * scale, bailY, spacing + 2 * scale, 3 * scale, 1.2 * scale);
      ctx.fill();
    };

    // Outfield with vignette.
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#6dd77c');
    bg.addColorStop(1, '#1f7a37');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      80,
      width / 2,
      height / 2,
      width * 0.65,
    );
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vignette.addColorStop(1, 'rgba(1, 30, 12, 0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Boundary arc.
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.96, width * 0.62, Math.PI * 1.07, Math.PI * 1.93);
    ctx.stroke();

    // Crowd band.
    const crowd = ctx.createLinearGradient(0, 0, 0, 36);
    crowd.addColorStop(0, '#0f172a');
    crowd.addColorStop(1, '#1e293b');
    ctx.fillStyle = crowd;
    ctx.fillRect(0, 0, width, 36);

    // Pitch strip.
    const pitchX = width * 0.42;
    const pitchW = width * 0.16;
    const pitchY = 20;
    const pitchH = height - 40;
    const pitchGrad = ctx.createLinearGradient(pitchX, pitchY, pitchX + pitchW, pitchY);
    pitchGrad.addColorStop(0, '#e5c089');
    pitchGrad.addColorStop(0.5, '#d7ae74');
    pitchGrad.addColorStop(1, '#c89f65');
    ctx.fillStyle = pitchGrad;
    drawRoundedRect(pitchX, pitchY, pitchW, pitchH, 8);
    ctx.fill();

    // Inner pitch markings.
    ctx.strokeStyle = 'rgba(120, 74, 35, 0.35)';
    ctx.lineWidth = 1.2;
    for (let i = 1; i <= 5; i += 1) {
      const y = pitchY + (pitchH / 6) * i;
      ctx.beginPath();
      ctx.moveTo(pitchX + 8, y);
      ctx.lineTo(pitchX + pitchW - 8, y);
      ctx.stroke();
    }

    // Creases.
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.39, height * 0.78);
    ctx.lineTo(width * 0.61, height * 0.78);
    ctx.moveTo(width * 0.39, height * 0.2);
    ctx.lineTo(width * 0.61, height * 0.2);
    ctx.stroke();

    // Wickets at both ends.
    drawWicketSprite({ x: width * 0.5, y: height * 0.775, scale: 1 });
    drawWicketSprite({ x: width * 0.5, y: height * 0.255, scale: 1 });

    // Batsman sprite.
    const batsmanX = width * 0.5;
    const batsmanY = height * 0.65;
    drawPlayer({
      x: batsmanX,
      y: batsmanY,
      bodyColor: '#1d4ed8',
      headColor: '#f1f5f9',
      armAngle: isSwinging ? -0.9 : -0.35,
    });

    // Bat sprite with swing angle.
    const swingAngle = isSwinging ? -1.08 : -0.42;
    ctx.save();
    ctx.translate(batsmanX + 7, batsmanY - 7);
    ctx.rotate(swingAngle);
    ctx.fillStyle = '#d6a56b';
    drawRoundedRect(0, -5, 54, 10, 4);
    ctx.fill();
    ctx.fillStyle = '#8b5a2b';
    drawRoundedRect(38, -3, 16, 6, 3);
    ctx.fill();
    ctx.restore();

    // Bowler sprite with release animation.
    const bowlerX = width * 0.5;
    const bowlerYBase = height * 0.16;
    const runUpOffset = (1 - Math.min(1, ballProgress * 2.4)) * -8;
    const releasePhase = Math.min(1, ballProgress / 0.35);
    const bowlerArmAngle = -1.25 + releasePhase * 2.2;
    drawPlayer({
      x: bowlerX,
      y: bowlerYBase + runUpOffset,
      bodyColor: '#ef4444',
      headColor: '#f8fafc',
      isBowler: true,
      armAngle: bowlerArmAngle,
    });

    // Ball incoming path (bowler -> batsman) and post-contact outgoing path.
    const ballStartY = height * 0.23;
    const contactY = height * 0.78;
    const incomingProgress = Math.min(1, ballProgress);
    let ballX = width * 0.5 + Math.sin(incomingProgress * Math.PI) * 8;
    let ballY = ballStartY + (contactY - ballStartY) * incomingProgress;

    if (ballProgress > 1 && activeOutcome !== 'WICKET') {
      const postProgress = Math.min(1, ballProgress - 1);
      const numericOutcome = Number(activeOutcome);
      const shotStrength = Number.isNaN(numericOutcome)
        ? 0.65
        : Math.max(0.45, Math.min(1.15, numericOutcome / 6));
      const direction = numericOutcome === 3 ? -1 : 1;

      const travelX = 130 * shotStrength;
      const loftY = 120 * shotStrength;

      // Outgoing trajectory after bat contact (away from striker towards outfield).
      ballX = width * 0.5 + direction * travelX * postProgress;
      ballY = contactY - loftY * postProgress + 34 * shotStrength * postProgress * postProgress;

      ctx.strokeStyle = 'rgba(248, 113, 113, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX - direction * 16, ballY + 18);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();
    } else {
      // Incoming seam trail.
      const ballCurve = Math.sin(incomingProgress * Math.PI) * 8;
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX - ballCurve * 0.4, ballY - 26);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(ballX, ballY, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#b91c1c';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#fee2e2';
    ctx.stroke();

    if (lastOutcome !== null) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px Trebuchet MS, sans-serif';
      ctx.textAlign = 'left';
      const text = lastOutcome === 'WICKET' ? 'WICKET!' : `${lastOutcome} RUNS`;
      ctx.fillText(text, 16, 62);
    }
  }, [ballProgress, isSwinging, activeOutcome, lastOutcome]);

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
