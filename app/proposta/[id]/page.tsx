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

export default function PropostaPage() {
  const params = useParams();
  const id = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛡️</div>
        <p style={{ color: "#64748b" }}>Carregando proposta...</p>
      </div>
    </div>
  );

  if (notFound || !proposal) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
        <h2 style={{ color: "#0f172a", fontSize: "22px", fontWeight: "700" }}>Proposta não encontrada</h2>
        <p style={{ color: "#64748b", marginTop: "8px" }}>Este link pode ter expirado ou ser inválido.</p>
      </div>
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
    const msg = encodeURIComponent(
      `Olá ${consultant.name}! Vi a proposta de seguro para o ${proposal.vehicleModel} e tenho interesse. Podemos conversar?`
    );
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  }

  function toggleAccordion(id: string) {
    setOpenAccordion((prev) => (prev === id ? null : id));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f4c8a 100%)",
        padding: "40px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "28px" }}>🛡️</span>
            <span style={{ color: "rgba(255,255,255,.7)", fontSize: "13px", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase" }}>Seguro Auto</span>
          </div>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: "15px", marginBottom: "6px" }}>
            Olá, <strong style={{ color: "white" }}>{proposal.clientName}</strong>. Esta é sua proposta personalizada:
          </p>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "700", lineHeight: "1.3", marginBottom: "12px" }}>
            {proposal.vehicleModel}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {proposal.fipeValue && (
              <span style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
                💰 FIPE: {proposal.fipeValue}
              </span>
            )}
            {proposal.vehiclePlate && (
              <span style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
                🚗 {proposal.vehiclePlate}
              </span>
            )}
            {proposal.proposalNumber && (
              <span style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
                📄 #{proposal.proposalNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "760px", margin: "-24px auto 0", padding: "0 16px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>

          {/* Price Card */}
          <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "4px" }}>Valor Mensal</p>
                {proposal.oldPrice && (
                  <p style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "18px" }}>R$ {proposal.oldPrice}</p>
                )}
                <p style={{ fontSize: "44px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
                  R$ <span style={{ color: "#16a34a" }}>{proposal.monthlyPrice}</span>
                </p>
              </div>
              {proposal.firstPayment && (
                <div style={{ borderLeft: "2px solid #f1f5f9", paddingLeft: "24px" }}>
                  <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "4px" }}>Primeira Parcela</p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{proposal.firstPayment}</p>
                </div>
              )}
              {proposal.franchise && (
                <div style={{ borderLeft: "2px solid #f1f5f9", paddingLeft: "24px" }}>
                  <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "4px" }}>Franquia</p>
                  <p style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{proposal.franchise}</p>
                </div>
              )}
            </div>
          </div>

          {/* Coverages */}
          <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>Coberturas do Plano</h2>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>Toque em cada item para ver os detalhes</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {allCoverages.map((c) => {
                const isOpen = openAccordion === c.id;
                const isOptional = optionalIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    style={{
                      border: `1px solid ${isOptional ? "#bfdbfe" : "#d1fae5"}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: isOptional ? "#eff6ff" : "#f0fdf4",
                    }}
                  >
                    <button
                      onClick={() => toggleAccordion(c.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "12px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px", flexShrink: 0 }}>{isOptional ? "⭐" : "✅"}</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{c.label}</span>
                      </div>
                      <span style={{ color: "#64748b", fontSize: "12px", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: ".3s", flexShrink: 0 }}>▼</span>
                    </button>
                    <div style={{
                      maxHeight: isOpen ? "200px" : "0",
                      overflow: "hidden",
                      transition: "max-height .35s ease",
                    }}>
                      <p style={{ padding: "0 16px 16px", fontSize: "13px", color: "#475569", lineHeight: "1.7" }}>{c.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {allCoverages.length === 0 && (
              <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
                Nenhuma cobertura adicionada a esta proposta.
              </p>
            )}
          </div>

          {/* CTA */}
          <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,.08)", textAlign: "center" }}>
            {consultant && (
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
                Seu consultor: <strong style={{ color: "#0f172a" }}>{consultant.name}</strong>
              </p>
            )}
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>
              Pronto para contratar? Inicie a vistoria agora pelo WhatsApp!
            </p>
            <button
              onClick={handleWhatsApp}
              style={{
                width: "100%", padding: "18px", background: "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "white", border: "none", borderRadius: "14px", fontSize: "17px",
                fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
              }}
            >
              <span style={{ fontSize: "22px" }}>💬</span>
              Quero Contratar / Iniciar Vistoria
            </button>
            <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "12px" }}>
              Você será direcionado ao WhatsApp do seu consultor
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
