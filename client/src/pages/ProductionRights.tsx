import { Link } from "wouter";
import { FormEvent, useState } from "react";
import { FileText, ShieldCheck, Music2, Users, Building2, Video, Scale, ArrowLeft } from "lucide-react";

const agreementGroups = [
  {
    title: "Locations & Providers",
    description: "Property and location permissions for Glibra shoots, host features, CTW, presentations, and branded travel content.",
    icon: Building2,
    items: [
      "Production Deal Memo",
      "Location Agreement",
      "Materials Release",
    ],
  },
  {
    title: "Talent & Performance",
    description: "Clear performance, likeness, rehearsal, recording, and usage rights for principal talent, dancers, and other participants.",
    icon: Users,
    items: [
      "Talent & Appearance Release",
      "Principal Performer Agreement",
      "Dance Performer Agreement",
      "Choreographer Services Agreement",
    ],
  },
  {
    title: "Music & Recording",
    description: "Separates live performance, composition, master, synchronization, promotional, and standalone-audio rights.",
    icon: Music2,
    items: ["Music Rights & Performance Agreement"],
  },
  {
    title: "Crew & Production",
    description: "Documents production services, ownership of work product, confidentiality, safety, and delivery obligations.",
    icon: Video,
    items: [
      "Crew Independent Contractor Agreement",
      "Production Confidentiality Agreement",
      "Production Safety & Conduct Acknowledgment",
    ],
  },
  {
    title: "Special Cases",
    description: "Additional controls for minors, third-party materials, and production-specific rights exceptions.",
    icon: ShieldCheck,
    items: [
      "Minor Participant Release",
      "Chain-of-Title Checklist",
    ],
  },
];

export default function ProductionRights() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    providerType: "",
    propertyAvailable: false,
    peopleAvailable: false,
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function submitInterest(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    try {
      const response = await fetch("/api/production-rights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Unable to save");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back to Glibra
          </Link>
          <div className="text-right">
            <p className="font-orbitron text-sm font-semibold tracking-[0.16em] text-slate-950">GLIBRA</p>
            <p className="text-xs text-slate-500">Production Rights Center</p>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Production governance</p>
              <h1 className="mt-4 font-orbitron text-4xl font-bold leading-tight md:text-6xl">
                Clear rights before the camera rolls.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Glibra uses project-specific agreements for filmed properties, performers, music, choreography,
                crew, supplied materials, and other production rights. Joining Glibra does not automatically grant
                filming permission.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {agreementGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article key={group.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-slate-950 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{group.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                    {group.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 py-3 text-sm text-slate-800">
                        <FileText className="h-4 w-4 text-slate-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-950 p-7 text-white md:p-9">
            <div className="flex max-w-3xl items-start gap-4">
              <Scale className="mt-1 h-6 w-6 shrink-0 text-cyan-300" />
              <div>
                <h2 className="text-2xl font-semibold">How Glibra handles production participation</h2>
                <p className="mt-3 leading-7 text-slate-300">
                  Hosts and local providers may opt in to be considered for Glibra productions. That preference is
                  not a release. When a specific shoot is proposed, Glibra issues the applicable project-specific
                  agreement for review and signature before filming begins.
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Final agreement language, insurance requirements, labor classification, music ownership, union or
                  guild obligations, and minor-performer requirements should be reviewed by qualified production or
                  entertainment counsel before use.
                </p>
              </div>
            </div>
          </div>
        </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 md:p-9">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Optional provider participation</p>
              <h2 className="mt-2 text-2xl font-semibold">Interested in appearing in Glibra content?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Hosts and local providers can tell us they are open to future filming, photography, interviews,
                or location features. This does not authorize filming and is not required to join Glibra.
              </p>
            </div>

            {status === "saved" ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
                Thanks. Your production-interest preference has been saved. If a specific opportunity is a fit,
                Glibra will contact you with the project details and the applicable agreement before filming.
              </div>
            ) : (
              <form onSubmit={submitInterest} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-800">
                  Name
                  <input
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Email
                  <input
                    required
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label className="text-sm font-medium text-slate-800 md:col-span-2">
                  Provider type
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"
                    placeholder="Lodging, dining, winery, experience, transportation, photography..."
                    value={form.providerType}
                    onChange={(e) => setForm({ ...form, providerType: e.target.value })}
                  />
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                  <input
                    className="mt-1"
                    type="checkbox"
                    checked={form.propertyAvailable}
                    onChange={(e) => setForm({ ...form, propertyAvailable: e.target.checked })}
                  />
                  My property or business location may be available for filming or photography.
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                  <input
                    className="mt-1"
                    type="checkbox"
                    checked={form.peopleAvailable}
                    onChange={(e) => setForm({ ...form, peopleAvailable: e.target.checked })}
                  />
                  I or members of my team may be interested in appearing in Glibra content.
                </label>
                <label className="text-sm font-medium text-slate-800 md:col-span-2">
                  Notes
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"
                    placeholder="Optional details about your location, team, or availability"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </label>
                <div className="md:col-span-2">
                  <button
                    disabled={status === "saving"}
                    className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {status === "saving" ? "Saving…" : "Submit production interest"}
                  </button>
                  {status === "error" && (
                    <p className="mt-3 text-sm text-red-700">We couldn’t save this preference. Please try again.</p>
                  )}
                </div>
              </form>
            )}
          </section>
      </main>
    </div>
  );
}
