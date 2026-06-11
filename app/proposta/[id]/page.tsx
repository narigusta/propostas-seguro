"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DEFAULT_INCLUDED, OPTIONAL_COVERAGES } from "@/lib/coverages";

interface Proposal {
  id: string;
  clientName: string;
  vehicleModel: string;
  vehiclePlate: string;
  fipeValue: string;
  monthlyPrice: string;
  oldPrice: string;
  firstPayment: string;
  franchise: string;
  proposalNumber: string;
  includedCoverages: string;
  addedOptionals: string;
  consultantId: string;
}

interface Consultant {
  id: string;
  name: string;
  whatsapp: string;
}

const TESTIMONIALS = [
  { name: "Carlos Eduardo", city: "São Paulo, SP", stars: 5, text: "Contratei pelo WhatsApp em menos de 10 minutos. Atendimento incrível e preço muito abaixo do que eu pagava antes!" },
  { name: "Fernanda Lima", city: "Belo Horizonte, MG", stars: 5, text: "Tive um sinistro e fui super bem atendida. Guincho chegou em 40 minutos e o processo foi simples. Recomendo demais!" },
  { name: "Rodrigo Menezes", city: "Rio de Janeiro, RJ", stars: 5, text: "Já indiquei pra toda a família. Cobertura completa com um valor que cabe no bolso. Melhor seguro que já tive." },
  { name: "Ana Paula Souza", city: "Curitiba, PR", stars: 5, text: "O consultor me explicou tudo direitinho, sem enrolação. Fechei na hora! Carro reserva foi liberado rapidinho." },
];

const STATS = [
  { value: "+12.000", label: "Clientes protegidos" },
  { value: "98%", label: "Satisfação dos clientes" },
  { value: "+8 anos", label: "No mercado" },
  { value: "24h", label: "Assistência disponível" },
];

const BENEFITS = [
  { icon: "⚡", title: "Contratação Rápida", desc: "Processo 100% digital, pelo WhatsApp. Em minutos seu carro já está protegido." },
  { icon: "💰", title: "Melhor Preço", desc: "Comparamos as melhores seguradoras para garantir o menor valor para você." },
  { icon: "🛡️", title: "Cobertura Completa", desc: "Roubo, furto, colisão, fenômenos naturais e muito mais em um único plano." },
  { icon: "🔧", title: "Assistência 24h", desc: "Guincho, chaveiro, pane seca e carro reserva quando você mais precisar." },
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

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a1628" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px", animation: "pulse 1.5s infinite" }}>🛡️</div>
      <p style={{ color: "#94a3b8", fontSize: "15px" }}>Carregando sua proposta...</p>
    </div>
  );

  if (notFound || !proposal) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a1628", padding: "20px" }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>😕</div>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "700", textAlign: "center" }}>Proposta não encontrada</h2>
      <p style={{ color: "#64748b", marginTop: "8px", textAlign: "center" }}>Este link pode ter expirado ou ser inválido.</p>
    </div>
  );

  const includedIds = proposal.includedCoverages ? proposal.includedCoverages.split(",").filter(Boolean) : [];
  const optionalIds = proposal.addedOptionals ? proposal.addedOptionals.split(",").filter(Boolean) : [];
  const allCoverages = [
    ...DEFAULT_INCLUDED.filter((c) => includedIds.includes(c.id)),
    ...OPTIONAL_COVERAGES.filter((c) => optionalIds.includes(c.id)),
  ];

  function handleWhatsApp() {
    if (!consultant) return;
    const phone = consultant.whatsapp.replace(/\D/g, "");
    const msg = encodeURIComponent(`Olá ${consultant.name}! Vi minha proposta de seguro para o ${proposal.vehicleModel} e quero contratar. Podemos dar andamento?`);
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  }

  const S: Record<string, React.CSSProperties> = {
    page: { background: "#f8fafc", fontFamily: "'Poppins', sans-serif", minHeight: "100vh" },

    // ── HERO ──
    hero: {
      background: "linear-gradient(160deg, #0a1628 0%, #0f2d5a 50%, #0a3d7a 100%)",
      padding: "0 0 40px",
      position: "relative",
      overflow: "hidden",
    },
    heroBubble1: { position: "absolute", top: "-80px", right: "-80px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(59,130,246,.08)" },
    heroBubble2: { position: "absolute", bottom: "-40px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(16,185,129,.06)" },

    topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" },
    logoText: { color: "white", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" },
    logoSub: { color: "#60a5fa", fontSize: "11px", fontWeight: "500", letterSpacing: "2px", textTransform: "uppercase" as const },
    badge: { background: "rgba(16,185,129,.15)", border: "1px solid rgba(16,185,129,.3)", color: "#34d399", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" },

    heroContent: { padding: "28px 20px 0", position: "relative", zIndex: 2 },
    heroGreeting: { color: "rgba(255,255,255,.65)", fontSize: "13px", marginBottom: "4px" },
    heroName: { color: "white", fontSize: "22px", fontWeight: "700", lineHeight: "1.3", marginBottom: "16px" },

    // price card
    priceCard: {
      background: "rgba(255,255,255,.07)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: "20px",
      padding: "24px 20px",
      marginTop: "8px",
    },
    priceLabel: { color: "rgba(255,255,255,.55)", fontSize: "12px", marginBottom: "4px" },
    oldPrice: { textDecoration: "line-through", color: "rgba(255,255,255,.4)", fontSize: "16px" },
    priceRow: { display: "flex", alignItems: "baseline", gap: "4px" },
    priceCurrency: { color: "#34d399", fontSize: "22px", fontWeight: "700" },
    priceValue: { color: "white", fontSize: "48px", fontWeight: "800", lineHeight: "1" },
    pricePeriod: { color: "rgba(255,255,255,.5)", fontSize: "14px" },
    priceDivider: { height: "1px", background: "rgba(255,255,255,.1)", margin: "16px 0" },
    priceDetailsRow: { display: "flex", gap: "16px" },
    priceDetail: { flex: 1 },
    priceDetailLabel: { color: "rgba(255,255,255,.45)", fontSize: "11px" },
    priceDetailValue: { color: "white", fontSize: "15px", fontWeight: "600" },

    vehicleBadge: {
      display: "flex", alignItems: "center", gap: "10px",
      background: "rgba(255,255,255,.06)", borderRadius: "12px",
      padding: "12px 16px", marginTop: "14px",
    },
    vehicleIcon: { fontSize: "22px" },
    vehicleModel: { color: "white", fontSize: "13px", fontWeight: "600", lineHeight: "1.3" },
    vehiclePlate: { color: "rgba(255,255,255,.45)", fontSize: "11px" },

    // ── CTA BUTTON ──
    ctaWrap: { padding: "20px 20px 0", position: "relative", zIndex: 2 },
    ctaBtn: {
      width: "100%", padding: "18px", border: "none", borderRadius: "16px", cursor: "pointer",
      background: "linear-gradient(135deg, #16a34a, #22c55e)",
      color: "white", fontSize: "17px", fontWeight: "700",
      boxShadow: "0 8px 24px rgba(34,197,94,.4)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    },
    ctaSubtext: { textAlign: "center" as const, color: "rgba(255,255,255,.45)", fontSize: "11px", marginTop: "10px" },

    // ── SECTIONS ──
    section: { padding: "32px 20px" },
    sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" },
    sectionSub: { fontSize: "13px", color: "#64748b", marginBottom: "20px" },

    // stats
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    statCard: {
      background: "white", borderRadius: "16px", padding: "20px 16px", textAlign: "center" as const,
      boxShadow: "0 2px 12px rgba(0,0,0,.06)",
    },
    statValue: { fontSize: "28px", fontWeight: "800", color: "#0f2d5a" },
    statLabel: { fontSize: "12px", color: "#64748b", marginTop: "4px" },

    // benefits
    benefitCard: {
      background: "white", borderRadius: "16px", padding: "20px",
      boxShadow: "0 2px 12px rgba(0,0,0,.06)", display: "flex", gap: "16px", alignItems: "flex-start",
      marginBottom: "12px",
    },
    benefitIcon: { fontSize: "28px", flexShrink: 0, marginTop: "2px" },
    benefitTitle: { fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" },
    benefitDesc: { fontSize: "13px", color: "#64748b", lineHeight: "1.6" },

    // coverages
    coverageItem: {
      borderRadius: "14px", overflow: "hidden", marginBottom: "8px",
    },
    coverageHeader: {
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", border: "none", cursor: "pointer", textAlign: "left" as const, gap: "12px",
    },
    coverageLeft: { display: "flex", alignItems: "center", gap: "10px" },
    coverageName: { fontSize: "14px", fontWeight: "600", color: "#1e293b" },
    coverageDesc: { padding: "0 16px 14px", fontSize: "13px", color: "#475569", lineHeight: "1.7" },

    // testimonials
    testimonialCard: {
      background: "white", borderRadius: "20px", padding: "24px 20px",
      boxShadow: "0 4px 20px rgba(0,0,0,.08)",
    },
    testimonialStars: { color: "#f59e0b", fontSize: "18px", marginBottom: "12px" },
    testimonialText: { fontSize: "14px", color: "#374151", lineHeight: "1.7", fontStyle: "italic" as const, marginBottom: "16px" },
    testimonialAuthor: { display: "flex", alignItems: "center", gap: "10px" },
    testimonialAvatar: {
      width: "40px", height: "40px", borderRadius: "50%",
      background: "linear-gradient(135deg, #0f2d5a, #3b82f6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontSize: "16px", fontWeight: "700", flexShrink: 0,
    },
    testimonialName: { fontSize: "14px", fontWeight: "700", color: "#0f172a" },
    testimonialCity: { fontSize: "12px", color: "#94a3b8" },
    testimonialDots: { display: "flex", justifyContent: "center" as const, gap: "6px", marginTop: "16px" },

    // trust bar
    trustBar: {
      background: "#0f2d5a", padding: "24px 20px",
      display: "flex", flexDirection: "column" as const, gap: "12px",
    },
    trustItem: { display: "flex", alignItems: "center", gap: "10px" },
    trustIcon: { fontSize: "20px", flexShrink: 0 },
    trustText: { color: "rgba(255,255,255,.8)", fontSize: "13px" },

    // bottom cta
    bottomCta: {
      background: "linear-gradient(160deg, #0a1628, #0f2d5a)",
      padding: "36px 20px", textAlign: "center" as const,
    },
    bottomCtaTitle: { color: "white", fontSize: "22px", fontWeight: "700", marginBottom: "8px", lineHeight: "1.3" },
    bottomCtaSub: { color: "rgba(255,255,255,.55)", fontSize: "13px", marginBottom: "24px" },
    consultantInfo: { color: "rgba(255,255,255,.6)", fontSize: "12px", marginTop: "16px" },
    consultantName: { color: "white", fontWeight: "600" },

    footer: { background: "#0a1628", padding: "20px", textAlign: "center" as const, borderTop: "1px solid rgba(255,255,255,.06)" },
    footerText: { color: "rgba(255,255,255,.3)", fontSize: "11px" },
  };

  const t = TESTIMONIALS[activeTestimonial];

  return (
    <div style={S.page}>

      {/* ── HERO ── */}
      <div style={S.hero}>
        <div style={S.heroBubble1} />
        <div style={S.heroBubble2} />

        {/* Top bar */}
        <div style={S.topBar}>
          <img
            src="https://drive.google.com/uc?export=view&id=1MYcoJyZcl2astYHSu8a2WZ7paKDTxXHD"
            alt="Bem Corretora"
            style={{ height: "36px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
          <div style={S.badge}>✓ Proposta exclusiva</div>
        </div>

        {/* Hero content */}
        <div style={S.heroContent}>
          <p style={S.heroGreeting}>Olá, <strong style={{ color: "white" }}>{proposal.clientName}</strong> 👋</p>
          <h1 style={S.heroName}>Sua proposta de seguro está pronta!</h1>

          {/* Price card */}
          <div style={S.priceCard}>
            <p style={S.priceLabel}>Valor mensal</p>
            {proposal.oldPrice && <p style={S.oldPrice}>R$ {proposal.oldPrice}</p>}
            <div style={S.priceRow}>
              <span style={S.priceCurrency}>R$</span>
              <span style={S.priceValue}>{proposal.monthlyPrice}</span>
              <span style={S.pricePeriod}>/mês</span>
            </div>

            {(proposal.firstPayment || proposal.franchise) && (
              <>
                <div style={S.priceDivider} />
                <div style={S.priceDetailsRow}>
                  {proposal.firstPayment && (
                    <div style={S.priceDetail}>
                      <p style={S.priceDetailLabel}>1ª Parcela</p>
                      <p style={S.priceDetailValue}>R$ {proposal.firstPayment}</p>
                    </div>
                  )}
                  {proposal.franchise && (
                    <div style={S.priceDetail}>
                      <p style={S.priceDetailLabel}>Franquia</p>
                      <p style={S.priceDetailValue}>R$ {proposal.franchise}</p>
                    </div>
                  )}
                  {proposal.fipeValue && (
                    <div style={S.priceDetail}>
                      <p style={S.priceDetailLabel}>Valor FIPE</p>
                      <p style={S.priceDetailValue}>R$ {proposal.fipeValue}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div style={S.vehicleBadge}>
              <span style={S.vehicleIcon}>🚗</span>
              <div>
                <p style={S.vehicleModel}>{proposal.vehicleModel}</p>
                {proposal.vehiclePlate && <p style={S.vehiclePlate}>Placa: {proposal.vehiclePlate}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={S.ctaWrap}>
          <button style={S.ctaBtn} onClick={handleWhatsApp}>
            <span style={{ fontSize: "22px" }}>💬</span>
            Quero Contratar Agora!
          </button>
          <p style={S.ctaSubtext}>Você será direcionado ao WhatsApp do seu consultor</p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ ...S.section, background: "#f0f6ff" }}>
        <h2 style={{ ...S.sectionTitle, textAlign: "center" }}>Por que escolher a Bem Corretora?</h2>
        <p style={{ ...S.sectionSub, textAlign: "center" }}>Números que comprovam nossa excelência</p>
        <div style={S.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label} style={S.statCard}>
              <div style={S.statValue}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>Vantagens do seu plano</h2>
        <p style={S.sectionSub}>Tudo que você precisa em um único seguro</p>
        {BENEFITS.map((b) => (
          <div key={b.title} style={S.benefitCard}>
            <span style={S.benefitIcon}>{b.icon}</span>
            <div>
              <p style={S.benefitTitle}>{b.title}</p>
              <p style={S.benefitDesc}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── COVERAGES ── */}
      <div style={{ ...S.section, background: "#f8fafc", paddingTop: "28px" }}>
        <h2 style={S.sectionTitle}>Coberturas incluídas</h2>
        <p style={S.sectionSub}>Toque em cada item para ver os detalhes</p>
        {allCoverages.map((c) => {
          const isOpen = openAccordion === c.id;
          const isOptional = optionalIds.includes(c.id);
          return (
            <div key={c.id} style={{ ...S.coverageItem, background: isOptional ? "#eff6ff" : "#f0fdf4", border: `1px solid ${isOptional ? "#bfdbfe" : "#bbf7d0"}` }}>
              <button style={{ ...S.coverageHeader, background: "transparent" }} onClick={() => setOpenAccordion(isOpen ? null : c.id)}>
                <div style={S.coverageLeft}>
                  <span style={{ fontSize: "18px" }}>{isOptional ? "⭐" : "✅"}</span>
                  <span style={S.coverageName}>{c.label}</span>
                </div>
                <span style={{ color: "#94a3b8", fontSize: "12px", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: ".3s", flexShrink: 0 }}>▼</span>
              </button>
              <div style={{ maxHeight: isOpen ? "200px" : "0", overflow: "hidden", transition: "max-height .35s ease" }}>
                <p style={S.coverageDesc}>{c.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ ...S.section, background: "#f0f6ff" }}>
        <h2 style={S.sectionTitle}>O que nossos clientes dizem</h2>
        <p style={S.sectionSub}>Mais de 12.000 clientes satisfeitos</p>
        <div style={S.testimonialCard}>
          <div style={S.testimonialStars}>{"★".repeat(t.stars)}</div>
          <p style={S.testimonialText}>"{t.text}"</p>
          <div style={S.testimonialAuthor}>
            <div style={S.testimonialAvatar}>{t.name[0]}</div>
            <div>
              <p style={S.testimonialName}>{t.name}</p>
              <p style={S.testimonialCity}>{t.city}</p>
            </div>
          </div>
        </div>
        <div style={S.testimonialDots}>
          {TESTIMONIALS.map((_, i) => (
            <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? "20px" : "8px", height: "8px", borderRadius: "4px", background: i === activeTestimonial ? "#0f2d5a" : "#cbd5e1", cursor: "pointer", transition: ".3s" }} />
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div style={S.trustBar}>
        {[
          ["🔒", "Seus dados estão 100% protegidos e seguros"],
          ["📋", "Contrato transparente, sem letras miúdas"],
          ["🏆", "Bem Corretora reconhecida e regularizada"],
          ["💬", "Suporte via WhatsApp a qualquer momento"],
        ].map(([icon, text]) => (
          <div key={text} style={S.trustItem}>
            <span style={S.trustIcon}>{icon}</span>
            <span style={S.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={S.bottomCta}>
        <h2 style={S.bottomCtaTitle}>Pronto para proteger seu carro?</h2>
        <p style={S.bottomCtaSub}>Clique abaixo e finalize sua contratação agora mesmo pelo WhatsApp</p>
        <button style={{ ...S.ctaBtn, maxWidth: "400px", margin: "0 auto" }} onClick={handleWhatsApp}>
          <span style={{ fontSize: "22px" }}>💬</span>
          Contratar / Iniciar Vistoria
        </button>
        {consultant && (
          <p style={S.consultantInfo}>
            Seu consultor: <span style={S.consultantName}>{consultant.name}</span>
          </p>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={S.footer}>
        <p style={S.footerText}>© 2025 Bem Corretora · Todos os direitos reservados</p>
        {proposal.proposalNumber && <p style={{ ...S.footerText, marginTop: "4px" }}>Proposta #{proposal.proposalNumber}</p>}
      </div>

    </div>
  );
}
