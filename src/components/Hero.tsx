"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // cursor-following glow
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.4);
  const gx = useSpring(mx, { stiffness: 120, damping: 25 });
  const gy = useSpring(my, { stiffness: 120, damping: 25 });
  const left = useTransform(gx, (v) => `${v * 100}%`);
  const top = useTransform(gy, (v) => `${v * 100}%`);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <motion.div style={{ scale }} className="aurora absolute inset-0 -z-10" />

      {/* glow that chases the cursor */}
      <motion.div
        style={{ left, top }}
        className="pointer-events-none absolute -z-10 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[80px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.35),transparent_60%)]" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="display text-6xl font-semibold sm:text-8xl md:text-9xl"
        >
          Playground
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl"
        >
          A corner of the internet for half-finished ideas, experiments, and
          things I&apos;m tinkering with.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 text-xs uppercase tracking-[0.2em] text-muted"
      >
        Scroll
      </motion.div>
    </section>
  );
}
