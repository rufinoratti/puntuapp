"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface CrowdCanvasProps {
  /** Kept for API compatibility with the original Skiper39 component. */
  src?: string;
  rows?: number;
  cols?: number;
  className?: string;
}

type Walker = {
  x: number;
  y: number;
  scale: number;
  speed: number;
  direction: 1 | -1;
  phase: number;
  opacity: number;
  color: string;
};

/**
 * A lightweight, asset-free adaptation of Skiper39's Canvas Crowd.
 * The footer uses vector silhouettes so the animation remains self-contained
 * and does not depend on a missing sprite sheet from the registry example.
 */
const CrowdCanvas = ({ rows = 8, cols = 3, className }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rootStyles = window.getComputedStyle(document.documentElement);
    const colors = [
      rootStyles.getPropertyValue("--brand").trim() || "#0e6a43",
      rootStyles.getPropertyValue("--coral").trim() || "#fb9568",
      rootStyles.getPropertyValue("--canvas-foreground").trim() || "#21362b",
    ];
    const walkerCount = Math.max(12, Math.min(rows * cols, 28));
    const walkers: Walker[] = Array.from({ length: walkerCount }, (_, index) => ({
      x: 0,
      y: 0,
      scale: 1,
      speed: 16 + Math.random() * 22,
      direction: index % 2 === 0 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.28 + Math.random() * 0.4,
      color: colors[index % colors.length],
    }));

    let width = 0;
    let height = 0;
    let lastTime = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      walkers.forEach((walker, index) => {
        const depth = 0.55 + ((index * 17) % 45) / 100;
        walker.scale = depth;
        walker.x = ((index / walkers.length) * width + (index % 3) * 38) % width;
        walker.y = height - 8 - (index % 4) * 12;
      });
    };

    const drawWalker = (walker: Walker, time: number) => {
      const walk = Math.sin(time * 9 + walker.phase);
      const bob = reducedMotion ? 0 : Math.sin(time * 5 + walker.phase) * 1.4;
      const lineWidth = Math.max(1.1, walker.scale * 1.8);

      context.save();
      context.globalAlpha = walker.opacity;
      context.translate(walker.x, walker.y + bob);
      context.scale(walker.direction * walker.scale, walker.scale);
      context.strokeStyle = walker.color;
      context.fillStyle = walker.color;
      context.lineWidth = lineWidth;
      context.lineCap = "round";

      context.beginPath();
      context.arc(0, -27, 4.5, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.moveTo(0, -21);
      context.lineTo(0, -4);
      context.moveTo(0, -16);
      context.lineTo(-7, -9 + walk * 1.5);
      context.moveTo(0, -16);
      context.lineTo(7, -9 - walk * 1.5);
      context.moveTo(0, -4);
      context.lineTo(-6, 7 + walk * 2.5);
      context.moveTo(0, -4);
      context.lineTo(6, 7 - walk * 2.5);
      context.stroke();

      context.restore();
    };

    const render = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 0.05) : 0;
      lastTime = time;
      context.clearRect(0, 0, width, height);

      walkers.forEach((walker) => {
        if (!reducedMotion) {
          walker.x += walker.speed * delta * walker.direction;

          if (walker.direction === 1 && walker.x > width + 20) walker.x = -20;
          if (walker.direction === -1 && walker.x < -20) walker.x = width + 20;
        }

        drawWalker(walker, time);
      });
    };

    resize();
    gsap.ticker.add(render);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
    };
  }, [cols, rows]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("absolute inset-0 h-full w-full", className)} />;
};

type Skiper39Props = HTMLAttributes<HTMLDivElement>;

const Skiper39 = ({ className, ...props }: Skiper39Props) => {
  return (
    <div {...props} className={cn("relative h-full w-full overflow-hidden bg-transparent", className)}>
      <CrowdCanvas rows={8} cols={3} />
    </div>
  );
};

export { CrowdCanvas, Skiper39 };

/**
 * Skiper 39 Canvas_Crowd adapted for PuntuApp's footer.
 * Original component: https://skiper-ui.com/v1/skiper39
 * Free version attribution retained as required by Skiper UI.
 */
