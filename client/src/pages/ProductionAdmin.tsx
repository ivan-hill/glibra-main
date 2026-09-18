import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileSignature, FolderKanban, Plus, ShieldCheck } from "lucide-react";

type Project = { id: string; title: string; slug: string; status: string; productionEntity?: string | null };
type Template = { id: string; title: string; version: number };
type Release = { id: string; documentType: string; signerName: string; signerEmail: string; signerRole?: string | null; status: string; signedAt?: string | null };
type ChainItem = { id: string; category: string; label: string; status: string; notes?: string | null };

export default function ProductionAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [chain, setChain] = useState<ChainItem[]>([]);
  const [error, setError] = useState("");
  const [signingPath, setSigningPath] = useState("");

  async function api(url: string, init?: RequestInit) {
    const res = await fetch(url, { credentials: "include", ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed.");
    return data;
  }

  async function load() {
    try {
      const [projectData, templateData] = await Promise.all([
        api("/api/production-admin/projects"),
        api("/api/production-admin/templates"),
      ]);
      setProjects(projectData);
      setTemplates(templateData);
    } catch (err: any) {
      if (String(err.message).includes("authenticated") || String(err.message).includes("Unauthorized")) {
        window.location.href = "/api/login";
        return;
      }
      setError(err.message);
    }
  }

  async function loadProject(project: Project) {
    setSelected(project);
    setSigningPath("");
    const [releaseData, chainData] = await Promise.all([
      api("/api/production-admin/projects/" + project.id + "/releases"),
      api("/api/production-admin/projects/" + project.id + "/chain-of-title"),
    ]);
    setReleases(releaseData);
    setChain(chainData);
  }

  useEffect(() => { load(); }, []);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const project = await api("/api/production-admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        productionEntity: form.get("productionEntity"),
      }),
    });
    setProjects([project, ...projects]);
    setSelected(project);
    event.currentTarget.reset();
  }

  async function createRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const result = await api("/api/production-admin/projects/" + selected.id + "/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentType: form.get("documentType"),
        signerName: form.get("signerName"),
        signerEmail: form.get("signerEmail"),
        signerRole: form.get("signerRole"),
        productionTerms: form.get("productionTerms"),
      }),
    });
    setSigningPath(result.signingPath);
    await loadProject(selected);
    event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/production-rights" className="inline-flex items-center gap-2 text-sm text-slate-600">
            <ArrowLeft className="h-4 w-4" /> Production Rights Center
          </Link>
          <div className="text-right">
            <p className="font-orbitron text-sm font-semibold tracking-[0.16em]">GLIBRA</p>
            <p className="text-xs text-slate-500">Production Admin</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-5">
          <form onSubmit={createProject} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2"><Plus className="h-4 w-4" /><h2 className="font-semibold">New production</h2></div>
            <input name="title" required placeholder="Production title" className="mt-4 w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
            <input name="productionEntity" placeholder="Production entity" className="mt-3 w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
            <button className="mt-4 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Create</button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Productions</div>
            <div className="space-y-1">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => loadProject(project)}
                  className={"w-full rounded-xl p-3 text-left text-sm " + (selected?.id === project.id ? "bg-slate-950 text-white" : "hover:bg-slate-100")}
                >
                  <div className="font-semibold">{project.title}</div>
                  <div className={"mt-1 text-xs " + (selected?.id === project.id ? "text-slate-300" : "text-slate-500")}>{project.status}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
          {!selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <FolderKanban className="mx-auto h-8 w-8 text-slate-400" />
              <h1 className="mt-4 text-2xl font-semibold">Select or create a production</h1>
              <p className="mt-2 text-slate-600">Release requests and chain-of-title status are managed per production.</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Production</p>
                <h1 className="mt-2 text-3xl font-semibold">{selected.title}</h1>
              </div>

              <form onSubmit={createRelease} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2"><FileSignature className="h-5 w-5" /><h2 className="text-xl font-semibold">Issue agreement</h2></div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <select name="documentType" required className="rounded-xl border border-slate-300 p-3 text-sm">
                    <option value="">Choose agreement</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.title} · v{t.version}</option>)}
                  </select>
                  <input name="signerRole" placeholder="Signer role" className="rounded-xl border border-slate-300 p-3 text-sm" />
                  <input name="signerName" required placeholder="Signer legal name" className="rounded-xl border border-slate-300 p-3 text-sm" />
                  <input name="signerEmail" required type="email" placeholder="Signer email" className="rounded-xl border border-slate-300 p-3 text-sm" />
                  <textarea name="productionTerms" placeholder="Production-specific terms: dates, fee, rights selected, restrictions, credit, etc." className="min-h-32 rounded-xl border border-slate-300 p-3 text-sm md:col-span-2" />
                </div>
                <button className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Create signing link</button>
                {signingPath && (
                  <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
                    <div className="font-semibold text-cyan-950">Signing link created</div>
                    <code className="mt-2 block break-all text-cyan-900">{window.location.origin + signingPath}</code>
                  </div>
                )}
              </form>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-semibold">Agreements</h2>
                  <div className="mt-4 space-y-3">
                    {releases.length === 0 && <p className="text-sm text-slate-500">No agreements issued yet.</p>}
                    {releases.map(release => (
                      <div key={release.id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex justify-between gap-3">
                          <div>
                            <div className="font-medium">{release.signerName}</div>
                            <div className="mt-1 text-xs text-slate-500">{release.signerEmail}</div>
                          </div>
                          <span className="h-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{release.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /><h2 className="text-xl font-semibold">Chain of title</h2></div>
                  <div className="mt-4 space-y-3">
                    {chain.length === 0 && <p className="text-sm text-slate-500">No rights items yet.</p>}
                    {chain.map(item => (
                      <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                        <div className="font-medium">{item.label}</div>
                        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{item.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
