export const metadata = {
  title: "GiGX — Build fast, scale clean",
  description: "Ship MVPs quickly with a sleek UI and sensible defaults.",
};

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <section className="max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          GiGX
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Launch faster. Collaborate safely. Scale without the mess.
        </p>

        <div className="mt-8 flex gap-3">
          <a
            href="/dashboard"
            className="inline-flex items-center rounded-xl px-4 py-2 text-white bg-black hover:opacity-90 transition"
          >
            Open Dashboard
          </a>
          <a
            href="/map"
            className="inline-flex items-center rounded-xl px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition"
          >
            Map View
          </a>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <Feature
          title="Next.js"
          desc="App Router, fast builds, file-based routes."
        />
        <Feature
          title="Data Ready"
          desc="React Query + optional Supabase wiring."
        />
        <Feature
          title="Future-Proof UI"
          desc="Room for a subtle 3D hero later."
        />
      </section>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{desc}</p>
    </div>
  );
}