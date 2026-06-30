"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#6366f1", "#ec4899", "#38bdf8", "#f59e0b", "#10b981", "#f43f5e"];

export default function BouncyBalls() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const mod = await import("matter-js");
      const Matter = (mod as unknown as { default?: typeof mod }).default ?? mod;
      if (cancelled || !el) return;

      const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } =
        Matter;

      const width = el.clientWidth;
      const height = el.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 0.8;

      const render = Render.create({
        element: el,
        engine,
        options: {
          width,
          height,
          background: "transparent",
          wireframes: false,
          pixelRatio: window.devicePixelRatio || 1,
        },
      });

      // Invisible walls + floor
      const wallOpts = { isStatic: true, render: { visible: false } };
      const t = 80;
      const walls = [
        Bodies.rectangle(width / 2, height + t / 2, width, t, wallOpts), // floor
        Bodies.rectangle(-t / 2, height / 2, t, height * 2, wallOpts), // left
        Bodies.rectangle(width + t / 2, height / 2, t, height * 2, wallOpts), // right
        Bodies.rectangle(width / 2, -t / 2 - 200, width, t, wallOpts), // ceiling (high)
      ];

      // Balls
      const count = Math.min(14, Math.max(7, Math.floor(width / 70)));
      const balls = Array.from({ length: count }, (_, i) => {
        const r = 18 + Math.round((i % 4) * 8);
        return Bodies.circle(
          40 + (i * 67) % Math.max(1, width - 80),
          -50 - i * 40,
          r,
          {
            restitution: 0.85,
            friction: 0.01,
            frictionAir: 0.005,
            render: { fillStyle: COLORS[i % COLORS.length] },
          }
        );
      });

      Composite.add(engine.world, [...walls, ...balls]);

      // Drag / fling with mouse
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Composite.add(engine.world, mouseConstraint);
      render.mouse = mouse;
      // let the page still scroll over the canvas (mousewheel handler isn't in the types)
      const wheelHandler = (mouse as unknown as { mousewheel: EventListener })
        .mousewheel;
      mouse.element.removeEventListener("wheel", wheelHandler);

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      // Handle resize
      const onResize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        render.canvas.width = w;
        render.canvas.height = h;
        render.options.width = w;
        render.options.height = h;
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        Render.stop(render);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        render.canvas.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative h-72 w-full cursor-grab touch-none overflow-hidden rounded-3xl border border-card-border bg-gradient-to-b from-card-from to-transparent active:cursor-grabbing sm:h-80"
    />
  );
}
