import React, { useEffect, useRef } from 'react';

export const SingularityVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const nodeCount = 150;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const symbols = '01アカサタナハハマヤラワガザダバパイウエオ'.split('');
    const symbolStream: { x: number; y: number; char: string; speed: number }[] = [];
    for (let i = 0; i < 50; i++) {
      symbolStream.push({
        x: Math.random() * width,
        y: Math.random() * height,
        char: symbols[Math.floor(Math.random() * symbols.length)],
        speed: Math.random() * 5 + 2
      });
    }

    const draw = (time: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw Symbol Stream
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
      symbolStream.forEach(s => {
        ctx.fillText(s.char, s.x, s.y);
        s.y += s.speed;
        if (s.y > height) {
          s.y = -20;
          s.x = Math.random() * width;
        }
        if (Math.random() > 0.95) {
          s.char = symbols[Math.floor(Math.random() * symbols.length)];
        }
      });

      const centerX = width / 2;
      const centerY = height / 2;
      const pull = Math.sin(time * 0.001) * 0.5 + 0.5;

      nodes.forEach((node, i) => {
        // Pull towards center
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        node.vx += (dx / dist) * 0.1 * pull;
        node.vy += (dy / dist) * 0.1 * pull;

        node.x += node.vx;
        node.y += node.vy;

        node.vx *= 0.99;
        node.vy *= 0.99;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;
          const dx2 = otherNode.x - node.x;
          const dy2 = otherNode.y - node.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist2 / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.fillStyle = '#00FF41';
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FF41';
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none opacity-60"
    />
  );
};
