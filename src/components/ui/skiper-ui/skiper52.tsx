"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
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

  return (
    <div
      className={cn("flex h-full min-h-[330px] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-sky p-4 sm:min-h-[430px] sm:p-6", className)}
      style={
        {
          "--skiper-active-width": "clamp(11rem, 34vw, 24rem)",
          "--skiper-collapsed-width": "clamp(2rem, 6vw, 5rem)",
        } as CSSProperties
      }
    >
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px)" }}
        animate={{ opacity: 1, transform: "translateY(0)" }}
        transition={{ duration: 0.3, delay: 0.15, ease: motionEase }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1 sm:gap-1.5">
          {items.map((item, index) => {
            const isActive = activeImage === index;

            return (
              <motion.button
                key={item.code}
                type="button"
                aria-label={`${item.title}, ${item.meta}`}
                aria-pressed={isActive}
                className="relative h-[18rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.35rem] border-0 bg-transparent p-0 outline-none ring-brand transition-[box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sky sm:h-[25rem] sm:rounded-[1.8rem]"
                initial={{ width: "var(--skiper-collapsed-width)" }}
                animate={{ width: isActive ? "var(--skiper-active-width)" : "var(--skiper-collapsed-width)" }}
                transition={{ duration: 0.3, ease: motionEase }}
                onClick={() => setActiveImage(index)}
                onFocus={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
              >
                <Image src={item.src} alt={item.alt} fill sizes="(min-width: 640px) 34vw, 55vw" className="object-cover" />
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-t from-canvas-foreground/85 via-canvas-foreground/10 to-transparent"
                    />
                  ) : null}
                </AnimatePresence>
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, transform: "translateY(8px)" }}
                      animate={{ opacity: 1, transform: "translateY(0)" }}
                      exit={{ opacity: 0, transform: "translateY(8px)" }}
                      transition={{ duration: 0.2, ease: motionEase }}
                      className="absolute inset-x-4 bottom-4 text-left text-canvas-subtle sm:inset-x-5 sm:bottom-5"
                    >
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">{item.code}</p>
                          <p className="mt-1 font-display text-2xl leading-none tracking-[-0.04em] text-white sm:text-3xl">{item.title}</p>
                          <p className="mt-2 text-xs text-white/70">{item.meta}</p>
                        </div>
                        <span className="rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-coral-foreground">{item.rating.toFixed(1)}</span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Skiper 52 HoverExpand_001 adapted for PuntuApp's editorial audiovisual catalog.
 * Original component: https://skiper-ui.com/v1/skiper52
 * Free version attribution retained as required by Skiper UI.
 */
