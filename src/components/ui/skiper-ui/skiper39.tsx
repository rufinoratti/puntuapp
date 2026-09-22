"use client";

/* The registry component is performance-tuned; its original implementation uses loose animation types. */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  color?: string;
  className?: string;
}

const MAX_SPRITE_WIDTH_MOBILE = 1800;
const RESIZE_DEBOUNCE_MS = 200;
const MOBILE_FRAME_SKIP = 2;

const CrowdCanvas = ({ src, rows = 15, cols = 7, color, className }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobileQuery = window.matchMedia("(max-width: 640px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = isMobileQuery.matches;

    // Keep the full sprite grid for slicing; only lower the active crowd size on mobile.
    const spriteRows = rows;
    const spriteCols = cols;
    const maxActivePeeps = isMobile
      ? Math.min(rows * cols, 40)
      : rows * cols;

    const config = {
      src,
      rows: spriteRows,
      cols: spriteCols,
      color,
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let disposed = false;
    let tickerAdded = false;
    let canvasVisible = false;
    let frameCount = 0;
    let lastStageWidth = 0;
    let lastStageHeight = 0;
    let resizeTimer: number | undefined;

    const tintSprite = (source: HTMLImageElement, tint: string): CanvasImageSource => {
      const scale = isMobile
        ? Math.min(1, MAX_SPRITE_WIDTH_MOBILE / source.naturalWidth)
        : 1;
      const tintedSprite = document.createElement("canvas");
      tintedSprite.width = Math.max(1, Math.round(source.naturalWidth * scale));
      tintedSprite.height = Math.max(1, Math.round(source.naturalHeight * scale));

      const tintedContext = tintedSprite.getContext("2d", {
        willReadFrequently: true,
      });
      if (!tintedContext) return source;

      tintedContext.drawImage(source, 0, 0, tintedSprite.width, tintedSprite.height);

      const colorProbe = document.createElement("canvas");
      colorProbe.width = 1;
      colorProbe.height = 1;
      const colorContext = colorProbe.getContext("2d");
      if (!colorContext) return source;

      colorContext.fillStyle = tint;
      colorContext.fillRect(0, 0, 1, 1);
      const [red, green, blue] = colorContext.getImageData(0, 0, 1, 1).data;
      const imageData = tintedContext.getImageData(0, 0, tintedSprite.width, tintedSprite.height);

      for (let index = 0; index < imageData.data.length; index += 4) {
        const luminance =
          imageData.data[index] * 0.2126 +
          imageData.data[index + 1] * 0.7152 +
          imageData.data[index + 2] * 0.0722;

        // Tint the dark ink while preserving the sprite's white highlights and transparency.
        if (luminance < 235) {
          imageData.data[index] = red;
          imageData.data[index + 1] = green;
          imageData.data[index + 2] = blue;
        }
      }

      tintedContext.putImageData(imageData, 0, 0);
      return tintedSprite;
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: CanvasImageSource;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: CanvasImageSource;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = (sprite: CanvasImageSource) => {
      const width =
        sprite instanceof HTMLCanvasElement ? sprite.width : img.naturalWidth;
      const height =
        sprite instanceof HTMLCanvasElement ? sprite.height : img.naturalHeight;
      const total = spriteRows * spriteCols;
      const rectWidth = width / spriteRows;
      const rectHeight = height / spriteCols;
      const step = total / maxActivePeeps;

      for (let i = 0; i < maxActivePeeps; i++) {
        const cell = Math.min(total - 1, Math.floor(i * step));
        allPeeps.push(
          createPeep({
            image: sprite,
            rect: [
              (cell % spriteRows) * rectWidth,
              ((cell / spriteRows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        if (disposed) return;
        removePeepFromCrowd(peep);
        if (availablePeeps.length) {
          addPeepToCrowd();
        }
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas || disposed) return;
      if (isMobile) {
        frameCount += 1;
        if (frameCount % MOBILE_FRAME_SKIP !== 0) return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const stopTicker = () => {
      if (!tickerAdded) return;
      gsap.ticker.remove(render);
      tickerAdded = false;
    };

    const startTicker = () => {
      if (disposed || tickerAdded) return;
      if (!canvasVisible || document.hidden) return;
      if (!allPeeps.length) return;
      if (reducedMotionQuery.matches) {
        render();
        return;
      }
      gsap.ticker.add(render);
      tickerAdded = true;
    };

    const resize = () => {
      if (!canvas || disposed) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;

      if (stage.width < 1 || stage.height < 1) return;

      lastStageWidth = stage.width;
      lastStageHeight = stage.height;

      canvas.width = Math.round(stage.width * dpr);
      canvas.height = Math.round(stage.height * dpr);

      if (!allPeeps.length) return;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
      if (!tickerAdded && canvasVisible && !document.hidden) {
        render();
      }
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed || !canvas) return;
        const nextWidth = canvas.clientWidth;
        const nextHeight = canvas.clientHeight;
        if (
          Math.abs(nextWidth - lastStageWidth) < 2 &&
          Math.abs(nextHeight - lastStageHeight) < 2
        ) {
          return;
        }
        resize();
      }, RESIZE_DEBOUNCE_MS);
    };

    img.onload = () => {
      if (disposed) return;
      const sprite = config.color ? tintSprite(img, config.color) : img;
      createPeeps(sprite);
      resize();
      startTicker();
    };
    img.src = config.src;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTicker();
      } else {
        startTicker();
      }
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              canvasVisible = entries[0]?.isIntersecting ?? false;
              if (canvasVisible) {
                startTicker();
              } else {
                stopTicker();
              }
            },
            { rootMargin: "200px 0px" },
          )
        : null;

    if (observer) {
      observer.observe(canvas);
    } else {
      canvasVisible = true;
      startTicker();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      img.onload = null;
      img.removeAttribute("src");
      stopTicker();
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
      crowd.length = 0;
      availablePeeps.length = 0;
      allPeeps.length = 0;
    };
  }, [color, cols, rows, src]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute bottom-0 h-full w-full ${className ?? ""}`}
      aria-hidden="true"
    />
  );
};

const Skiper39 = () => {
  return (
    <div className="relative h-full w-full bg-white text-black">
      <div className="top-22 absolute left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
          Croud Canvas
        </span>
      </div>
      <div className="absolute bottom-0 h-full w-screen">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the codepen.io . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
