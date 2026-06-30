import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import BouncyBalls from "@/components/BouncyBalls";

const experiments = [
  { title: "TBD", tag: "Experiment", desc: "Something interactive lives here soon." },
  { title: "TBD", tag: "Experiment", desc: "A toy, a demo, a shader — TBD." },
  { title: "TBD", tag: "Experiment", desc: "Placeholder for the next idea." },
  { title: "TBD", tag: "Experiment", desc: "Reserved for future tinkering." },
];

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />

      {/* Toy box */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Reveal>
          <p className="mb-5 text-center text-sm uppercase tracking-[0.2em] text-muted">
            Grab a ball. Throw it.
          </p>
          <BouncyBalls />
        </Reveal>
      </section>

      {/* Experiments */}
      <section id="experiments" className="mx-auto max-w-6xl px-6 py-32">
        <Reveal>
          <h2 className="display mb-16 text-4xl font-semibold sm:text-6xl">
            Experiments.
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {experiments.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <TiltCard>
                <a
                  href="#"
                  className="group block h-full rounded-3xl border border-card-border bg-gradient-to-b from-card-from to-transparent p-8 transition-colors duration-500 hover:border-card-border-hover"
                >
                  <div className="mb-8 aspect-video rounded-2xl bg-gradient-to-br from-card-from to-transparent" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">
                    {p.tag}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-muted">{p.desc}</p>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Now */}
      <section id="now" className="mx-auto max-w-3xl px-6 py-32 text-center">
        <Reveal>
          <h2 className="display text-4xl font-semibold leading-tight sm:text-6xl">
            Right now.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted">
            TBD — a short note about what I&apos;m currently building, learning,
            or obsessing over. Swap this out whenever it changes.
          </p>
        </Reveal>
      </section>

      <footer className="border-t border-card-border py-10 text-center text-sm text-muted">
        Built with Next.js. Forever a work in progress.
      </footer>
    </main>
  );
}
