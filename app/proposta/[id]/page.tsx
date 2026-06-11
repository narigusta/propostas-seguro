"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DEFAULT_INCLUDED, OPTIONAL_COVERAGES } from "@/lib/coverages";

interface Proposal {
  id: string; clientName: string; vehicleModel: string; vehiclePlate: string;
  fipeValue: string; monthlyPrice: string; oldPrice: string; firstPayment: string;
  franchise: string; proposalNumber: string; includedCoverages: string;
  addedOptionals: string; consultantId: string;
}
interface Consultant { id: string; name: string; whatsapp: string; }

const TESTIMONIALS = [
  { name: "Carlos Eduardo", city: "São Paulo, SP", text: "Contratei pelo WhatsApp em menos de 10 minutos. Atendimento incrível e preço abaixo do que eu pagava!" },
  { name: "Fernanda Lima", city: "Belo Horizonte, MG", text: "Tive um sinistro e fui super bem atendida. Guincho em 40 min e processo simples. Recomendo!" },
  { name: "Rodrigo Menezes", city: "Rio de Janeiro, RJ", text: "Já indiquei pra toda a família. Cobertura completa com valor que cabe no bolso." },
  { name: "Ana Paula Souza", city: "Curitiba, PR", text: "O consultor me explicou tudo direitinho, sem enrolação. Fechei na hora!" },
];

const STATS = [
  { value: "+12.000", label: "Clientes protegidos", icon: "👥" },
  { value: "98%", label: "Satisfação", icon: "⭐" },
  { value: "+8 anos", label: "No mercado", icon: "🏆" },
  { value: "24h", label: "Assistência", icon: "🔧" },
];

export default function PropostaPage() {
  const params = useParams();
  const id = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/proposal?id=${id}`);
        if (!res.ok) { setNotFound(true); setLoading(false); return; }
        const p: Proposal = await res.json();
        setProposal(p);
        const cRes = await fetch(`/api/consultant?id=${p.consultantId}`);
        if (cRes.ok) setConsultant(await cRes.json());
      } catch { setNotFound(true); }
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Animate unlock counter
  useEffect(() => {
    if (!proposal) return;
    const includedIds = proposal.includedCoverages ? proposal.includedCoverages.split(",").filter(Boolean) : [];
    const optionalIds = proposal.addedOptionals ? proposal.addedOptionals.split(",").filter(Boolean) : [];
    const total = includedIds.length + optionalIds.length;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setUnlockedCount(count);
      if (count >= total) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [proposal]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060d1f" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛡️</div>
      <p style={{ color: "#60a5fa", fontSize: "15px", fontFamily: "Poppins, sans-serif" }}>Carregando sua proposta...</p>
    </div>
  );

  if (notFound || !proposal) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060d1f", padding: "20px" }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>😕</div>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "700", textAlign: "center", fontFamily: "Poppins, sans-serif" }}>Proposta não encontrada</h2>
    </div>
  );

  const includedIds = proposal.includedCoverages ? proposal.includedCoverages.split(",").filter(Boolean) : [];
  const optionalIds = proposal.addedOptionals ? proposal.addedOptionals.split(",").filter(Boolean) : [];
  const allCoverages = [
    ...DEFAULT_INCLUDED.filter(c => includedIds.includes(c.id)),
    ...OPTIONAL_COVERAGES.filter(c => optionalIds.includes(c.id)),
  ];
  const totalCoverages = allCoverages.length;

  function handleWhatsApp() {
    if (!consultant) return;
    const phone = consultant.whatsapp.replace(/\D/g, "");
    const msg = encodeURIComponent(`Olá ${consultant.name}! Vi minha proposta de seguro para o ${proposal.vehicleModel} e quero contratar. Podemos dar andamento?`);
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  }

  const ff = "Poppins, sans-serif";

  return (
    <div style={{ fontFamily: ff, background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(160deg, #060d1f 0%, #0b1d3a 55%, #0d2a55 100%)",
        padding: "0 0 32px", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Logo bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", position: "relative", zIndex: 2 }}>
          <img
            src="https://drive.google.com/uc?export=view&id=1MYcoJyZcl2astYHSu8a2WZ7paKDTxXHD"
            alt="Bem Corretora"
            style={{ height: "32px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
          <div style={{ background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.35)", color: "#4ade80", padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", letterSpacing: ".5px" }}>
            🔒 PROPOSTA EXCLUSIVA
          </div>
        </div>

        {/* Greeting */}
        <div style={{ padding: "12px 20px 0", position: "relative", zIndex: 2 }}>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: "13px", marginBottom: "2px" }}>Olá, <strong style={{ color: "#93c5fd" }}>{proposal.clientName}</strong> 👋</p>
          <h1 style={{ color: "white", fontSize: "20px", fontWeight: "700", lineHeight: "1.3", marginBottom: "4px" }}>Sua proteção está pronta!</h1>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: "12px" }}>{proposal.vehicleModel}{proposal.vehiclePlate ? ` · ${proposal.vehiclePlate}` : ""}</p>
        </div>

        {/* ── PRICE CARD (destaque máximo) ── */}
        <div style={{ margin: "16px 20px 0", position: "relative", zIndex: 2 }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.03) 100%)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "24px", padding: "24px 20px",
            backdropFilter: "blur(12px)",
          }}>
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ color: "rgba(255,255,255,.5)", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" as const }}>Valor mensal</span>
            </div>

            {proposal.oldPrice && (
              <p style={{ textDecoration: "line-through", color: "rgba(255,255,255,.3)", fontSize: "18px", marginBottom: "2px" }}>R$ {proposal.oldPrice}</p>
            )}

            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", marginBottom: "16px" }}>
              <span style={{ color: "#4ade80", fontSize: "24px", fontWeight: "700", lineHeight: "1.6" }}>R$</span>
              <span style={{ color: "white", fontSize: "64px", fontWeight: "800", lineHeight: "1", letterSpacing: "-2px" }}>{proposal.monthlyPrice}</span>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: "16px", marginBottom: "8px" }}>/mês</span>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)", margin: "0 0 16px" }} />

            {/* Details row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {proposal.firstPayment && (
                <div style={{ textAlign: "center" as const }}>
                  <p style={{ color: "rgba(255,255,255,.4)", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: ".5px", marginBottom: "2px" }}>1ª Parcela</p>
                  <p style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>R$ {proposal.firstPayment}</p>
                </div>
              )}
              {proposal.franchise && (
                <div style={{ textAlign: "center" as const }}>
                  <p style={{ color: "rgba(255,255,255,.4)", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: ".5px", marginBottom: "2px" }}>Franquia</p>
                  <p style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>R$ {proposal.franchise}</p>
                </div>
              )}
              {proposal.fipeValue && (
                <div style={{ textAlign: "center" as const }}>
                  <p style={{ color: "rgba(255,255,255,.4)", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: ".5px", marginBottom: "2px" }}>FIPE</p>
                  <p style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>R$ {proposal.fipeValue}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CTA principal ── */}
        <div style={{ padding: "16px 20px 0", position: "relative", zIndex: 2 }}>
          <button onClick={handleWhatsApp} style={{
            width: "100%", padding: "18px", border: "none", borderRadius: "16px", cursor: "pointer",
            background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
            color: "white", fontSize: "17px", fontWeight: "700",
            boxShadow: "0 0 32px rgba(34,197,94,.4), 0 4px 16px rgba(0,0,0,.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            fontFamily: ff,
          }}>
            <span style={{ fontSize: "22px" }}>💬</span> Quero Contratar Agora!
          </button>
          <p style={{ textAlign: "center" as const, color: "rgba(255,255,255,.3)", fontSize: "11px", marginTop: "8px" }}>
            Você será direcionado ao WhatsApp do seu consultor
          </p>
        </div>
      </div>

      {/* ══ COBERTURAS (gamificado) ══════════════════════ */}
      <div style={{ padding: "28px 20px" }}>

        {/* Header com contador */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "2px" }}>Coberturas Desbloqueadas</h2>
            <p style={{ fontSize: "12px", color: "#64748b" }}>Toque para ver os detalhes</p>
          </div>
          {/* Badge contador gamificado */}
          <div style={{
            background: "linear-gradient(135deg, #0b1d3a, #1e3a6e)",
            borderRadius: "12px", padding: "8px 14px", textAlign: "center" as const,
            border: "1px solid rgba(59,130,246,.3)",
          }}>
            <span style={{ color: "#60a5fa", fontSize: "22px", fontWeight: "800", display: "block", lineHeight: "1" }}>{unlockedCount}</span>
            <span style={{ color: "rgba(255,255,255,.4)", fontSize: "9px", textTransform: "uppercase" as const, letterSpacing: "1px" }}>coberturas</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "6px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "4px",
            background: "linear-gradient(90deg, #3b82f6, #22c55e)",
            width: `${totalCoverages > 0 ? (unlockedCount / totalCoverages) * 100 : 0}%`,
            transition: "width .3s ease",
          }} />
        </div>

        {/* Coverage accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {allCoverages.map((c, idx) => {
            const isOpen = openAccordion === c.id;
            const isOptional = optionalIds.includes(c.id);
            return (
              <div key={c.id} style={{
                background: "white", borderRadius: "14px", overflow: "hidden",
                border: `1px solid ${isOptional ? "#bfdbfe" : "#bbf7d0"}`,
                boxShadow: isOpen ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.04)",
                transition: "box-shadow .3s",
              }}>
                <button onClick={() => setOpenAccordion(isOpen ? null : c.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", padding: "14px 16px",
                  background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const, gap: "12px"
                }}>
                  {/* Number badge */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                    background: isOptional ? "linear-gradient(135deg, #dbeafe, #bfdbfe)" : "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "700", color: isOptional ? "#1d4ed8" : "#15803d"
                  }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <span style={{ flex: 1, fontSize: "13px", fontWeight: "600", color: "#1e293b", lineHeight: "1.4" }}>{c.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <span style={{ fontSize: "14px" }}>{isOptional ? "⭐" : "✅"}</span>
                    <span style={{ color: "#94a3b8", fontSize: "11px", transform: isOpen ? "rotate(180deg)" : "none", transition: ".3s", display: "block" }}>▼</span>
                  </div>
                </button>
                <div style={{ maxHeight: isOpen ? "200px" : "0", overflow: "hidden", transition: "max-height .35s ease" }}>
                  <div style={{ padding: "0 16px 16px", display: "flex", gap: "10px" }}>
                    <div style={{ width: "2px", background: isOptional ? "#3b82f6" : "#22c55e", borderRadius: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.7", margin: 0 }}>{c.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA após coberturas */}
        <button onClick={handleWhatsApp} style={{
          width: "100%", padding: "16px", border: "none", borderRadius: "14px", cursor: "pointer",
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
          color: "white", fontSize: "16px", fontWeight: "700", marginTop: "20px",
          boxShadow: "0 4px 20px rgba(34,197,94,.35)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          fontFamily: ff,
        }}>
          <span>💬</span> Contratar Este Plano
        </button>
      </div>

      {/* ══ STATS ════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(135deg, #060d1f, #0b1d3a)", padding: "28px 20px" }}>
        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", textAlign: "center" as const, marginBottom: "4px" }}>Por que a Bem Corretora?</h2>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: "12px", textAlign: "center" as const, marginBottom: "20px" }}>Números que comprovam nossa excelência</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "16px", padding: "18px 14px", textAlign: "center" as const,
            }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ color: "white", fontSize: "24px", fontWeight: "800" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,.4)", fontSize: "11px", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BENEFÍCIOS ═══════════════════════════════════ */}
      <div style={{ padding: "28px 20px", background: "#f8fafc" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Tudo incluso no seu plano</h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "20px" }}>Proteção completa para você e seu veículo</p>
        {[
          { icon: "⚡", title: "Contratação em minutos", desc: "100% digital pelo WhatsApp, sem burocracia.", color: "#fef3c7", border: "#fde68a" },
          { icon: "💰", title: "Melhor custo-benefício", desc: "Comparamos as melhores seguradoras para garantir o menor valor.", color: "#dcfce7", border: "#bbf7d0" },
          { icon: "🛡️", title: "Cobertura abrangente", desc: "Roubo, furto, colisão, fenômenos naturais e muito mais.", color: "#dbeafe", border: "#bfdbfe" },
          { icon: "🔧", title: "Assistência 24 horas", desc: "Guincho, chaveiro, pane seca quando precisar.", color: "#ede9fe", border: "#ddd6fe" },
        ].map(b => (
          <div key={b.title} style={{
            background: "white", borderRadius: "16px", padding: "16px",
            boxShadow: "0 1px 6px rgba(0,0,0,.06)", display: "flex", gap: "14px",
            alignItems: "flex-start", marginBottom: "10px",
            border: "1px solid #f1f5f9",
          }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: b.color, border: `1px solid ${b.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              {b.icon}
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "3px" }}>{b.title}</p>
              <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6" }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══ DEPOIMENTOS ══════════════════════════════════ */}
      <div style={{ padding: "28px 20px", background: "#f0f6ff" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>O que dizem nossos clientes</h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "20px" }}>+12.000 clientes satisfeitos</p>

        <div style={{ background: "white", borderRadius: "20px", padding: "22px 18px", boxShadow: "0 4px 20px rgba(0,0,0,.07)", minHeight: "180px" }}>
          <div style={{ color: "#f59e0b", fontSize: "18px", marginBottom: "10px" }}>★★★★★</div>
          <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", fontStyle: "italic" as const, marginBottom: "16px" }}>
            "{TESTIMONIALS[activeTestimonial].text}"
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #0b1d3a, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "15px", fontWeight: "700"
            }}>
              {TESTIMONIALS[activeTestimonial].name[0]}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{TESTIMONIALS[activeTestimonial].name}</p>
              <p style={{ fontSize: "11px", color: "#94a3b8" }}>{TESTIMONIALS[activeTestimonial].city}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" as const, gap: "6px", marginTop: "14px" }}>
          {TESTIMONIALS.map((_, i) => (
            <div key={i} onClick={() => setActiveTestimonial(i)} style={{
              width: i === activeTestimonial ? "20px" : "7px", height: "7px",
              borderRadius: "4px", cursor: "pointer", transition: ".3s",
              background: i === activeTestimonial ? "#0b1d3a" : "#cbd5e1"
            }} />
          ))}
        </div>
      </div>

      {/* ══ TRUST ════════════════════════════════════════ */}
      <div style={{ background: "#0b1d3a", padding: "24px 20px" }}>
        {[
          ["🔒", "Seus dados protegidos e 100% seguros"],
          ["📋", "Contrato transparente, sem letras miúdas"],
          ["🏆", "Bem Corretora regularizada e de confiança"],
          ["💬", "Suporte via WhatsApp a qualquer momento"],
        ].map(([icon, text]) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "20px" }}>{icon}</span>
            <span style={{ color: "rgba(255,255,255,.75)", fontSize: "13px" }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ══ BOTTOM CTA ═══════════════════════════════════ */}
      <div style={{ background: "linear-gradient(160deg, #060d1f, #0b1d3a)", padding: "36px 20px", textAlign: "center" as const }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>🚗💨</div>
        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "700", marginBottom: "8px", lineHeight: "1.3" }}>
          Pronto para dirigir protegido?
        </h2>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: "13px", marginBottom: "24px" }}>
          Finalize sua contratação agora pelo WhatsApp
        </p>
        <button onClick={handleWhatsApp} style={{
          width: "100%", maxWidth: "380px", padding: "18px", border: "none", borderRadius: "16px", cursor: "pointer",
          background: "linear-gradient(135deg, #16a34a, #22c55e)",
          color: "white", fontSize: "17px", fontWeight: "700",
          boxShadow: "0 0 32px rgba(34,197,94,.4)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          fontFamily: ff, margin: "0 auto",
        }}>
          <span style={{ fontSize: "22px" }}>💬</span> Contratar / Iniciar Vistoria
        </button>
        {consultant && (
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: "12px", marginTop: "14px" }}>
            Seu consultor: <strong style={{ color: "rgba(255,255,255,.75)" }}>{consultant.name}</strong>
          </p>
        )}
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════ */}
      <div style={{ background: "#060d1f", padding: "18px 20px", textAlign: "center" as const, borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <img src="https://drive.google.com/uc?export=view&id=1MYcoJyZcl2astYHSu8a2WZ7paKDTxXHD" alt="Bem Corretora" style={{ height: "24px", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: .4, marginBottom: "8px" }} />
        <p style={{ color: "rgba(255,255,255,.2)", fontSize: "11px" }}>© 2025 Bem Corretora · Todos os direitos reservados</p>
        {proposal.proposalNumber && <p style={{ color: "rgba(255,255,255,.15)", fontSize: "10px", marginTop: "4px" }}>Proposta #{proposal.proposalNumber}</p>}
      </div>

    </div>
  );
}
