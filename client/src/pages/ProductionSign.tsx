import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Download, FileSignature, ShieldCheck } from "lucide-react";

type Agreement = {
  productionTitle: string;
  agreementTitle: string;
  signerName: string;
  signerEmail: string;
  signerRole?: string | null;
  document: string;
  status: string;
  signedAt?: string | null;
};

export default function ProductionSign() {
  const [, navigate] = useLocation();
  const token = useMemo(() => window.location.pathname.split("/").filter(Boolean).pop() || "", []);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [error, setError] = useState("");
  const [legalName, setLegalName] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    fetch("/api/production-sign/" + token)
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).message || "Unable to load agreement.");
        return res.json();
      })
      .then((data: Agreement) => {
        setAgreement(data);
        setLegalName(data.signerName);
        if (data.status === "signed") setSigned(true);
      })
      .catch(err => setError(err.message));
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/production-sign/" + token + "/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalName,
          signatureText,
          electronicConsent: consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to sign agreement.");
      setSigned(true);
    } catch (err: any) {
      setError(err.message || "Unable to sign agreement.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !agreement) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 text-slate-950">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8">
          <h1 className="text-2xl font-semibold">Agreement unavailable</h1>
          <p className="mt-3 text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!agreement) {
    return <div className="min-h-screen bg-[#f7f7f5] p-10 text-slate-600">Loading agreement…</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-6">
          <p className="font-orbitron text-sm font-semibold tracking-[0.16em]">GLIBRA</p>
          <p className="mt-1 text-xs text-slate-500">Production Rights Center</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{agreement.productionTitle}</p>
          <h1 className="mt-2 text-3xl font-semibold">{agreement.agreementTitle}</h1>
          <p className="mt-3 text-sm text-slate-600">
            Prepared for {agreement.signerName}{agreement.signerRole ? " · " + agreement.signerRole : ""}.
            Review the complete agreement before signing.
          </p>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-800">{agreement.document}</pre>
        </article>

        {signed ? (
          <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <h2 className="text-xl font-semibold text-emerald-950">Agreement signed</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  The executed agreement has been preserved with its signing record and document hash.
                </p>
                <a
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white"
                  href={"/api/production-sign/" + token + "/pdf"}
                >
                  <Download className="h-4 w-4" />
                  Download executed PDF
                </a>
              </div>
            </div>
          </section>
        ) : (
          <form onSubmit={submit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-3">
              <FileSignature className="h-5 w-5 text-slate-500" />
              <h2 className="text-xl font-semibold">Electronic signature</h2>
            </div>

            <label className="mt-6 block text-sm font-medium">
              Legal name
              <input
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"
                value={legalName}
                onChange={e => setLegalName(e.target.value)}
              />
            </label>

            <label className="mt-5 block text-sm font-medium">
              Type your full legal name as your signature
              <input
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"
                value={signatureText}
                onChange={e => setSignatureText(e.target.value)}
              />
            </label>

            <label className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <input
                className="mt-1"
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              <span>
                I have reviewed this agreement, intend to sign it electronically, and consent to receiving
                and retaining this agreement as an electronic record.
              </span>
            </label>

            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

            <button
              disabled={!consent || !legalName.trim() || !signatureText.trim() || saving}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              <ShieldCheck className="h-4 w-4" />
              {saving ? "Signing…" : "Sign agreement"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
