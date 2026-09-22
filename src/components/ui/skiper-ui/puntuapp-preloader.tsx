"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const columns = Array.from({ length: 7 });
const motionEase = [0.23, 1, 0.32, 1] as const;

export function PuntuappPreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), reducedMotion ? 180 : 800);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          role="status"
          aria-label="Cargando PuntuApp"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-canvas text-brand"
        >
          <div className="absolute inset-0 grid grid-cols-7">
            {columns.map((_, index) => (
              <motion.div
                key={`top-${index}`}
                initial={{ transform: "scaleY(1)" }}
                animate={{ transform: reducedMotion ? "scaleY(0)" : "scaleY(0)" }}
                transition={{ delay: reducedMotion ? 0 : index * 0.045, duration: reducedMotion ? 0.12 : 0.6, ease: motionEase }}
                style={{ transformOrigin: "top" }}
                className="bg-brand"
              />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-cols-7">
            {columns.map((_, index) => (
              <motion.div
                key={`bottom-${index}`}
                initial={{ transform: "scaleY(1)" }}
                animate={{ transform: reducedMotion ? "scaleY(0)" : "scaleY(0)" }}
                transition={{ delay: reducedMotion ? 0 : (columns.length - index) * 0.045 + 0.08, duration: reducedMotion ? 0.12 : 0.6, ease: motionEase }}
                style={{ transformOrigin: "bottom" }}
                className="bg-coral"
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, transform: "translateY(8px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.15, ease: motionEase }}
            className="relative z-10 text-center"
          >
            <p className="text-4xl font-black leading-none tracking-[-0.1em] text-brand sm:text-6xl">
              PUNTU<span className="text-coral">APP</span>
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/75">Lo que te mueve</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
