import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  r: number;
  color: string;
  phase: number;
  vx: number;
  vy: number;
}

const BackgroundMap: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Create "City Clusters" to simulate a map (e.g., Beijing, Shanghai, Guangzhou hubs)
      const clusters = [
        { x: centerX, y: centerY, count: 40, spread: 150 }, // Central
        { x: centerX + 200, y: centerY - 100, count: 25, spread: 100 }, // East
        { x: centerX - 150, y: centerY + 150, count: 20, spread: 120 }, // South West
        { x: centerX + 100, y: centerY + 200, count: 30, spread: 100 }, // South East
        { x: centerX - 200, y: centerY - 150, count: 15, spread: 80 }, // North West
      ];

      clusters.forEach(cluster => {
        for (let i = 0; i < cluster.count; i++) {
          // Randomize position within cluster spread (Gaussian-ish)
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * cluster.spread * (Math.random() * 0.5 + 0.5);
          
          nodes.push({
            x: cluster.x + Math.cos(angle) * dist,
            y: cluster.y + Math.sin(angle) * dist,
            r: Math.random() * 2.5 + 1,
            color: Math.random() > 0.9 ? '#ef4444' : '#06b6d4', // Occasional Red alert nodes
            phase: Math.random() * Math.PI * 2,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2
          });
        }
      });

      // Add some connecting lines ("Highways")
    };

    const draw = (time: number) => {
      // Dark map background color
      ctx.fillStyle = '#0f172a'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Map Grid Lines (Simulating GIS layers)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      
      // Skewed grid for 3D effect? No, keep flat for clarity behind dashboard
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and Draw Nodes
      nodes.forEach(node => {
        // Slow drift
        node.x += node.vx;
        node.y += node.vy;

        // Pulse
        const pulse = Math.sin(time * 0.002 + node.phase);
        // Fix: Ensure radius is non-negative to avoid IndexSizeError
        const radius = Math.max(0, node.r + pulse * 1.5);
        const alpha = 0.3 + pulse * 0.4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Rings for "Active" nodes
        if (node.color === '#ef4444' || Math.random() > 0.98) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
            ctx.strokeStyle = node.color;
            ctx.globalAlpha = alpha * 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
      });

      // Draw Connections (Routes)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'; // Cyan connections
      ctx.lineWidth = 0.5;
      nodes.forEach((node, i) => {
          // Connect to nearby nodes
          for(let j = i + 1; j < nodes.length; j++) {
              const other = nodes[j];
              const dx = node.x - other.x;
              const dy = node.y - other.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 60) {
                  ctx.beginPath();
                  ctx.moveTo(node.x, node.y);
                  ctx.lineTo(other.x, other.y);
                  ctx.stroke();
              }
          }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${active ? 'scale-110 blur-lg opacity-40' : 'scale-100 opacity-60'}`}
    />
  );
};

export default BackgroundMap;