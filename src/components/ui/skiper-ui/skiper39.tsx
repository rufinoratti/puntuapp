"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
}

type Peep = {
  image: CanvasImageSource;
  rect: number[];
  sourceWidth: number;
  sourceHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scale: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  setScale: (scale: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
};

const fallbackColors = ["#0e6a43", "#fb9568", "#21362b"];

const getBrandColors = () => {
  const styles = window.getComputedStyle(document.documentElement);
  const colors = ["--brand", "--coral", "--canvas-foreground"].map(
    (token, index) => styles.getPropertyValue(token).trim() || fallbackColors[index],
  );

  return colors;
};

const createTintedSprite = (source: HTMLImageElement, color: string) => {
  const sprite = document.createElement("canvas");
  const context = sprite.getContext("2d");

  if (!context) return source;

  sprite.width = source.naturalWidth;
  sprite.height = source.naturalHeight;
  context.drawImage(source, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = color;
  context.fillRect(0, 0, sprite.width, sprite.height);

  return sprite;
};

const CrowdCanvas = ({ src, rows = 15, cols = 7, className }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new Image();
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    const maxCrowd = 16;
    const motionEase = gsap.parseEase("power2.in");

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = (array: unknown[]) => randomRange(0, array.length) | 0;
    const removeRandomFromArray = <T,>(array: T[]) => array.splice(randomIndex(array), 1)[0];

    const resetPeep = ({ peep }: { peep: Peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * motionEase(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let endX: number;

      if (direction === 1) {
        peep.x = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        peep.x = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.y = startY;
      peep.anchorY = startY;

      return { startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: Peep; props: ReturnType<typeof resetPeep> }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;
      const timeline = gsap.timeline({ paused: reducedMotion });

      timeline.timeScale(randomRange(0.5, 1.5));
      timeline.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      timeline.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return timeline;
    };

    const createPeep = ({ image, rect }: { image: CanvasImageSource; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        sourceWidth: 0,
        sourceHeight: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scale: 1,
        scaleX: 1,
        walk: null,
        setRect: (nextRect) => {
          peep.rect = nextRect;
          peep.sourceWidth = nextRect[2];
          peep.sourceHeight = nextRect[3];
          peep.width = peep.sourceWidth * peep.scale;
          peep.height = peep.sourceHeight * peep.scale;
        },
        setScale: (scale) => {
          peep.scale = scale;
          peep.width = peep.sourceWidth * scale;
          peep.height = peep.sourceHeight * scale;
        },
        render: (ctx) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX * peep.scale, peep.scale);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.sourceWidth,
            peep.sourceHeight,
            0,
            0,
            peep.sourceWidth,
            peep.sourceHeight,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    const createPeeps = () => {
      const tintedSprites = getBrandColors().map((color) => createTintedSprite(image, color));
      const rectWidth = image.naturalWidth / rows;
      const rectHeight = image.naturalHeight / cols;
      const total = rows * cols;

      for (let index = 0; index < total; index += 1) {
        allPeeps.push(
          createPeep({
            image: tintedSprites[index % tintedSprites.length],
            rect: [
              (index % rows) * rectWidth,
              Math.floor(index / rows) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const removePeepFromCrowd = (peep: Peep) => {
      const index = crowd.indexOf(peep);
      if (index >= 0) crowd.splice(index, 1);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      if (!peep) return null;

      const walk = normalWalk({ peep, props: resetPeep({ peep }) }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((first, second) => first.anchorY - second.anchorY);

      return peep;
    };

    const initCrowd = () => {
      while (availablePeeps.length && crowd.length < maxCrowd) {
        addPeepToCrowd()?.walk?.progress(Math.random());
      }
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = stage.width * pixelRatio;
      canvas.height = stage.height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;

      const displayScale = Math.min(0.56, Math.max(0.42, stage.height / 520));
      allPeeps.forEach((peep) => peep.setScale(displayScale));
      availablePeeps.push(...allPeeps);
      initCrowd();
    };

    const render = () => {
      context.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep) => peep.render(context));
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    image.onload = init;
    image.src = src;
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [cols, rows, src]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("absolute bottom-0 left-0 h-full w-full", className)} />;
};

type Skiper39Props = HTMLAttributes<HTMLDivElement>;

const Skiper39 = ({ className, ...props }: Skiper39Props) => {
  return (
    <div {...props} className={cn("relative h-full w-full overflow-hidden bg-transparent", className)}>
      <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} className="h-[92%]" />
    </div>
  );
};

export { CrowdCanvas, Skiper39 };

/**
 * Skiper 39 Canvas_Crowd adapted for PuntuApp's footer.
 * Original component: https://skiper-ui.com/v1/skiper39
 * Sprite sheet: https://skiper-ui.com/images/peeps/all-peeps.png
 * Free version attribution retained as required by Skiper UI.
 */
