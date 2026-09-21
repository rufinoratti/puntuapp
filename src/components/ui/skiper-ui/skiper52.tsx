"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type Skiper52Item = {
  src: string;
  alt: string;
  code: string;
  title: string;
  meta: string;
  rating: number;
};

type Skiper52Props = {
  items: Skiper52Item[];
  className?: string;
};

const motionEase = [0.23, 1, 0.32, 1] as const;

export function Skiper52({ items, className }: Skiper52Props) {
  const [activeImage, setActiveImage] = useState(0);
  const activeItem = items[activeImage] ?? items[0];

  if (!activeItem) return null;

  return (
    <div className={cn("h-full min-h-[330px] w-full overflow-hidden rounded-[2rem] border border-brand/10 bg-sky p-3 shadow-[0_18px_50px_oklch(0.25_0.04_155_/_0.08)] sm:min-h-[430px] sm:p-5", className)}>
      <div className="grid h-full min-h-[300px] gap-2.5 sm:min-h-[390px] md:grid-cols-[minmax(0,1.35fr)_minmax(9rem,0.65fr)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.code}
            initial={{ opacity: 0, transform: "scale(0.98)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            exit={{ opacity: 0, transform: "scale(0.98)" }}
            transition={{ duration: 0.3, ease: motionEase }}
            className="group relative min-h-[20rem] overflow-hidden rounded-[1.45rem] border-0 bg-canvas sm:min-h-[24rem] sm:rounded-[1.75rem] md:min-h-0"
          >
            <Image src={activeItem.src} alt={activeItem.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas-foreground/90 via-canvas-foreground/15 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 text-canvas-subtle sm:inset-x-6 sm:bottom-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">{activeItem.code} · Ahora en PuntuApp</p>
                  <p className="mt-1 font-display text-3xl leading-none tracking-[-0.045em] text-white sm:text-4xl">{activeItem.title}</p>
                  <p className="mt-2 text-xs text-white/75">{activeItem.meta}</p>
                </div>
                <span className="rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-coral-foreground">{activeItem.rating.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:grid-rows-4">
          {items.map((item, index) => {
            if (activeImage === index) return null;

            return (
              <motion.button
                key={item.code}
                type="button"
                aria-label={`${item.title}, ${item.meta}`}
                aria-pressed="false"
                className="group relative min-h-[7rem] cursor-pointer overflow-hidden rounded-[1.15rem] border-0 bg-canvas p-0 text-left outline-none ring-brand transition-[box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sky md:min-h-0"
                onClick={() => setActiveImage(index)}
                onFocus={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
                whileHover={{ y: -2 }}
              >
                <Image src={item.src} alt={item.alt} fill sizes="(min-width: 768px) 15vw, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-foreground/80 via-transparent to-transparent" />
                <div className="absolute inset-x-3 bottom-2.5 flex items-end justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">{item.code}</span>
                  <span className="rounded-full bg-canvas/95 px-2 py-1 text-[10px] font-bold text-brand">{item.rating.toFixed(1)}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Skiper 52 HoverExpand_001 adapted for PuntuApp's editorial audiovisual catalog.
 * Original component: https://skiper-ui.com/v1/skiper52
 * Free version attribution retained as required by Skiper UI.
 */
