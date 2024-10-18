import { useEffect } from 'react';

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setup(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return {
    canvas,
    canvasContext: canvas.getContext('2d'),
    numberOfSnowBalls: 250,
  };
}

function createSnowBalls(canvas: HTMLCanvasElement, numberOfSnowBalls: number) {
  return [...Array(numberOfSnowBalls)].map(() => {
    return {
      x: random(0, canvas.width),
      y: random(0, canvas.height),
      opacity: Math.random() * (1 - 0.5) + 0.5, // Changed to use Math.random() for float values
      speedX: random(-5, 5),
      speedY: random(1, 3),
      radius: random(2, 4),
    };
  });
}

function createSnowBallDrawer(canvasContext: CanvasRenderingContext2D | null) {
  return (snowBall: any) => {
    if (!canvasContext) return;
    canvasContext.beginPath();
    canvasContext.arc(snowBall.x, snowBall.y, snowBall.radius, 0, Math.PI * 2);
    canvasContext.fillStyle = `rgba(255, 255, 255, ${snowBall.opacity})`;
    canvasContext.fill();
  };
}

function createSnowBallMover(canvas: HTMLCanvasElement) {
  return (snowBall: any) => {
    snowBall.x += snowBall.speedX;
    snowBall.y += snowBall.speedY;

    if (snowBall.x > canvas.width) {
      snowBall.x = 0;
    } else if (snowBall.x < 0) {
      snowBall.x = canvas.width;
    }

    if (snowBall.y > canvas.height) {
      snowBall.y = 0;
    }
  };
}

export default function Snowfall() {
  useEffect(() => {
    const canvas = document.getElementById(
      'falling-snow-canvas'
    ) as HTMLCanvasElement;

    if (canvas) {
      const { canvasContext, numberOfSnowBalls } = setup(canvas);
      const snowBalls = createSnowBalls(canvas, numberOfSnowBalls);
      const drawSnowBall = createSnowBallDrawer(canvasContext);
      const moveSnowBall = createSnowBallMover(canvas);

      const intervalId = setInterval(() => {
        canvasContext?.clearRect(0, 0, canvas.width, canvas.height);
        snowBalls.forEach(drawSnowBall);
        snowBalls.forEach(moveSnowBall);
      }, 50);

      // Cleanup on component unmount
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <canvas
      id='falling-snow-canvas'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
