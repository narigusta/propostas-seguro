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

const BRAND = {
  navy:    "#0B1F4B",
  blue:    "#1A3FA0",
  light:   "#2563EB",
  accent:  "#3B82F6",
  sky:     "#EFF6FF",
  green:   "#16A34A",
  white:   "#FFFFFF",
  gray50:  "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray400: "#94A3B8",
  gray600: "#475569",
  gray800: "#1E293B",
};

const TESTIMONIALS = [
  { name: "Carlos Eduardo", city: "São Paulo, SP", text: "Contratei em menos de 10 minutos. Atendimento incrível e preço abaixo do que eu pagava antes." },
  { name: "Fernanda Lima",  city: "Belo Horizonte, MG", text: "Tive um sinistro e fui super bem atendida. Guincho em 40 minutos e processo simples." },
  { name: "Rodrigo Menezes", city: "Rio de Janeiro, RJ", text: "Já indiquei para toda a família. Cobertura completa com valor que cabe no bolso." },
  { name: "Ana Paula Souza", city: "Curitiba, PR", text: "O consultor me explicou tudo direitinho, sem enrolação. Fechei na hora!" },
];

const STATS = [
  { value: "+12.000", label: "Clientes protegidos" },
  { value: "98%",    label: "Satisfação" },
  { value: "+8 anos", label: "No mercado" },
  { value: "24h",    label: "Assistência" },
];

// ── SVG icons ──────────────────────────────────────────────────────────────
const Icon = {
  shield: (size=20, color=BRAND.white) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  check: (size=16, color=BRAND.green) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  star: (size=16, color="#F59E0B") => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  whatsapp: (size=22, color=BRAND.white) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  lock: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  lightning: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  dollar: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  tool: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  award: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  file: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  chat: (size=18, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  chevronDown: (size=14, color=BRAND.gray400) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  users: (size=20, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  clock: (size=20, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  car: (size=20, color=BRAND.accent) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
};

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

  useEffect(() => {
    if (!proposal) return;
    const inc = proposal.includedCoverages?.split(",").filter(Boolean) || [];
    const opt = proposal.addedOptionals?.split(",").filter(Boolean) || [];
    const total = inc.length + opt.length;
    let count = 0;
    const iv = setInterval(() => { count++; setUnlockedCount(count); if (count >= total) clearInterval(iv); }, 70);
    return () => clearInterval(iv);
  }, [proposal]);

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background: BRAND.navy, fontFamily:"'Inter',sans-serif" }}>
      {Icon.shield(40, BRAND.accent)}
      <p style={{ color: BRAND.accent, fontSize:"14px", marginTop:"16px", letterSpacing:".5px" }}>Carregando proposta...</p>
    </div>
  );

  if (notFound || !proposal) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background: BRAND.navy, padding:"20px", fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color: BRAND.white, fontSize:"18px", fontWeight:"700" }}>Proposta não encontrada</p>
      <p style={{ color: BRAND.gray400, fontSize:"13px", marginTop:"8px" }}>Este link pode ter expirado ou ser inválido.</p>
    </div>
  );

  const includedIds = proposal.includedCoverages?.split(",").filter(Boolean) || [];
  const optionalIds = proposal.addedOptionals?.split(",").filter(Boolean) || [];
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

  const ff = "'Inter', 'Poppins', sans-serif";

  return (
    <div style={{ fontFamily: ff, background: BRAND.gray100, minHeight:"100vh" }}>

      {/* ── TOPBAR ── */}
      <div style={{ background: BRAND.navy, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <img src="https://drive.google.com/uc?export=view&id=1MYcoJyZcl2astYHSu8a2WZ7paKDTxXHD" alt="Bem Corretora" style={{ height:"28px", objectFit:"contain", filter:"brightness(0) invert(1)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(59,130,246,.15)", border:"1px solid rgba(59,130,246,.3)", padding:"5px 12px", borderRadius:"6px" }}>
          {Icon.lock(14, BRAND.accent)}
          <span style={{ color: BRAND.accent, fontSize:"11px", fontWeight:"600", letterSpacing:".5px" }}>PROPOSTA EXCLUSIVA</span>
        </div>
      </div>

      {/* ── HERO / PRICE ── */}
      <div style={{ background: BRAND.navy, padding:"24px 20px 32px" }}>
        <p style={{ color:"rgba(255,255,255,.5)", fontSize:"13px", marginBottom:"2px" }}>
          Olá, <strong style={{ color: BRAND.white }}>{proposal.clientName}</strong>
        </p>
        <h1 style={{ color: BRAND.white, fontSize:"20px", fontWeight:"700", lineHeight:"1.3", marginBottom:"20px" }}>
          Sua proposta de seguro está pronta
        </h1>

        {/* Price block */}
        <div style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:"16px", padding:"24px 20px" }}>
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:"11px", textTransform:"uppercase" as const, letterSpacing:"1px", marginBottom:"6px" }}>Valor mensal</p>
          {proposal.oldPrice && (
            <p style={{ textDecoration:"line-through", color:"rgba(255,255,255,.3)", fontSize:"17px", marginBottom:"2px" }}>R$ {proposal.oldPrice}</p>
          )}
          <div style={{ display:"flex", alignItems:"flex-end", gap:"6px", marginBottom:"20px" }}>
            <span style={{ color: BRAND.accent, fontSize:"22px", fontWeight:"700", lineHeight:"1.8" }}>R$</span>
            <span style={{ color: BRAND.white, fontSize:"60px", fontWeight:"800", lineHeight:"1", letterSpacing:"-2px" }}>{proposal.monthlyPrice}</span>
            <span style={{ color:"rgba(255,255,255,.35)", fontSize:"15px", marginBottom:"8px" }}>/mês</span>
          </div>

          {/* Details */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:"18px" }}>
            {proposal.firstPayment && (
              <div>
                <p style={{ color:"rgba(255,255,255,.35)", fontSize:"10px", textTransform:"uppercase" as const, letterSpacing:".5px", marginBottom:"3px" }}>1ª Parcela</p>
                <p style={{ color: BRAND.white, fontSize:"14px", fontWeight:"700" }}>R$ {proposal.firstPayment}</p>
              </div>
            )}
            {proposal.franchise && (
              <div>
                <p style={{ color:"rgba(255,255,255,.35)", fontSize:"10px", textTransform:"uppercase" as const, letterSpacing:".5px", marginBottom:"3px" }}>Franquia</p>
                <p style={{ color: BRAND.white, fontSize:"14px", fontWeight:"700" }}>R$ {proposal.franchise}</p>
              </div>
            )}
            {proposal.fipeValue && (
              <div>
                <p style={{ color:"rgba(255,255,255,.35)", fontSize:"10px", textTransform:"uppercase" as const, letterSpacing:".5px", marginBottom:"3px" }}>FIPE</p>
                <p style={{ color: BRAND.white, fontSize:"14px", fontWeight:"700" }}>R$ {proposal.fipeValue}</p>
              </div>
            )}
          </div>

          {/* Vehicle */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:"16px", marginTop:"16px" }}>
            {Icon.car(18, "rgba(255,255,255,.4)")}
            <div>
              <p style={{ color: BRAND.white, fontSize:"13px", fontWeight:"600" }}>{proposal.vehicleModel}</p>
              {proposal.vehiclePlate && <p style={{ color:"rgba(255,255,255,.35)", fontSize:"11px", marginTop:"1px" }}>Placa: {proposal.vehiclePlate}</p>}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button onClick={handleWhatsApp} style={{
          width:"100%", marginTop:"16px", padding:"17px", border:"none", borderRadius:"12px", cursor:"pointer",
          background: BRAND.green, color: BRAND.white, fontSize:"16px", fontWeight:"700",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          boxShadow:"0 4px 20px rgba(22,163,74,.4)", fontFamily: ff,
        }}>
          {Icon.whatsapp(20, BRAND.white)}
          Quero Contratar Agora
        </button>
        <p style={{ textAlign:"center" as const, color:"rgba(255,255,255,.25)", fontSize:"11px", marginTop:"8px" }}>
          Direcionado ao WhatsApp do seu consultor
        </p>
      </div>

      {/* ── COBERTURAS ── */}
      <div style={{ padding:"28px 20px", background: BRAND.white }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
          <div>
            <h2 style={{ fontSize:"17px", fontWeight:"700", color: BRAND.gray800 }}>Coberturas do plano</h2>
            <p style={{ fontSize:"12px", color: BRAND.gray400, marginTop:"2px" }}>Toque para ver os detalhes de cada cobertura</p>
          </div>
          <div style={{ background: BRAND.navy, borderRadius:"10px", padding:"8px 14px", textAlign:"center" as const, minWidth:"54px" }}>
            <span style={{ color: BRAND.white, fontSize:"20px", fontWeight:"800", display:"block", lineHeight:"1" }}>{unlockedCount}</span>
            <span style={{ color:"rgba(255,255,255,.4)", fontSize:"9px", textTransform:"uppercase" as const, letterSpacing:".8px" }}>itens</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: BRAND.gray200, borderRadius:"4px", height:"4px", marginBottom:"20px", overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:"4px", background:`linear-gradient(90deg, ${BRAND.blue}, ${BRAND.accent})`,
            width:`${totalCoverages > 0 ? (unlockedCount/totalCoverages)*100 : 0}%`, transition:"width .3s ease",
          }} />
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {allCoverages.map((c, idx) => {
            const isOpen = openAccordion === c.id;
            const isOptional = optionalIds.includes(c.id);
            return (
              <div key={c.id} style={{
                border:`1px solid ${isOpen ? BRAND.accent : BRAND.gray200}`,
                borderRadius:"12px", overflow:"hidden", background: BRAND.white,
                transition:"border-color .2s",
              }}>
                <button onClick={() => setOpenAccordion(isOpen ? null : c.id)} style={{
                  width:"100%", display:"flex", alignItems:"center", padding:"13px 14px",
                  background:"transparent", border:"none", cursor:"pointer", textAlign:"left" as const, gap:"12px",
                }}>
                  <div style={{
                    width:"26px", height:"26px", borderRadius:"6px", flexShrink:0,
                    background: isOptional ? BRAND.sky : "#F0FDF4",
                    border:`1px solid ${isOptional ? "#BFDBFE" : "#BBF7D0"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"11px", fontWeight:"700", color: isOptional ? BRAND.blue : "#15803D",
                  }}>
                    {String(idx+1).padStart(2,"0")}
                  </div>
                  <span style={{ flex:1, fontSize:"13px", fontWeight:"600", color: BRAND.gray800, lineHeight:"1.4" }}>{c.label}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
                    {isOptional
                      ? <div style={{ background: BRAND.sky, borderRadius:"4px", padding:"2px 8px", fontSize:"10px", fontWeight:"700", color: BRAND.blue }}>ADICIONAL</div>
                      : <div style={{ background:"#F0FDF4", borderRadius:"4px", padding:"2px 8px", fontSize:"10px", fontWeight:"700", color:"#15803D" }}>INCLUSO</div>
                    }
                    <div style={{ transform: isOpen ? "rotate(180deg)" : "none", transition:".3s" }}>
                      {Icon.chevronDown(14, BRAND.gray400)}
                    </div>
                  </div>
                </button>
                <div style={{ maxHeight: isOpen ? "200px" : "0", overflow:"hidden", transition:"max-height .35s ease" }}>
                  <div style={{ padding:"0 14px 14px", display:"flex", gap:"10px" }}>
                    <div style={{ width:"2px", background: isOptional ? BRAND.accent : "#22C55E", borderRadius:"2px", flexShrink:0, alignSelf:"stretch" }} />
                    <p style={{ fontSize:"13px", color: BRAND.gray600, lineHeight:"1.7", margin:0 }}>{c.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleWhatsApp} style={{
          width:"100%", marginTop:"20px", padding:"16px", border:`2px solid ${BRAND.navy}`, borderRadius:"12px", cursor:"pointer",
          background:"transparent", color: BRAND.navy, fontSize:"15px", fontWeight:"700",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", fontFamily: ff,
        }}>
          {Icon.whatsapp(18, BRAND.navy)}
          Contratar Este Plano
        </button>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: BRAND.navy, padding:"28px 20px" }}>
        <h2 style={{ color: BRAND.white, fontSize:"17px", fontWeight:"700", marginBottom:"4px" }}>Por que a Bem Corretora?</h2>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:"12px", marginBottom:"20px" }}>Números que comprovam nossa excelência</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)",
              borderRadius:"12px", padding:"18px 14px", textAlign:"center" as const,
            }}>
              <p style={{ color: BRAND.white, fontSize:"26px", fontWeight:"800", marginBottom:"4px" }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,.4)", fontSize:"11px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BENEFÍCIOS ── */}
      <div style={{ padding:"28px 20px", background: BRAND.white }}>
        <h2 style={{ fontSize:"17px", fontWeight:"700", color: BRAND.gray800, marginBottom:"4px" }}>Vantagens do seu plano</h2>
        <p style={{ fontSize:"12px", color: BRAND.gray400, marginBottom:"20px" }}>Proteção completa para você e seu veículo</p>
        {[
          { icon: Icon.lightning(18, BRAND.blue), title:"Contratação rápida", desc:"Processo 100% digital pelo WhatsApp, sem burocracia nem filas." },
          { icon: Icon.dollar(18, BRAND.blue),    title:"Melhor custo-benefício", desc:"Comparamos as melhores seguradoras para garantir o menor valor para você." },
          { icon: Icon.shield(18, BRAND.blue),    title:"Cobertura abrangente", desc:"Roubo, furto, colisão, fenômenos naturais e muito mais em um plano." },
          { icon: Icon.tool(18, BRAND.blue),      title:"Assistência 24 horas", desc:"Guincho, chaveiro e pane seca sempre que precisar, a qualquer hora." },
        ].map(b => (
          <div key={b.title} style={{
            display:"flex", gap:"14px", alignItems:"flex-start", padding:"16px",
            borderRadius:"12px", border:`1px solid ${BRAND.gray200}`, marginBottom:"10px", background: BRAND.white,
          }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"10px", background: BRAND.sky, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {b.icon}
            </div>
            <div>
              <p style={{ fontSize:"14px", fontWeight:"700", color: BRAND.gray800, marginBottom:"3px" }}>{b.title}</p>
              <p style={{ fontSize:"12px", color: BRAND.gray600, lineHeight:"1.6" }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── DEPOIMENTOS ── */}
      <div style={{ padding:"28px 20px", background: BRAND.gray100 }}>
        <h2 style={{ fontSize:"17px", fontWeight:"700", color: BRAND.gray800, marginBottom:"4px" }}>O que dizem nossos clientes</h2>
        <p style={{ fontSize:"12px", color: BRAND.gray400, marginBottom:"20px" }}>Mais de 12.000 clientes satisfeitos</p>
        <div style={{ background: BRAND.white, borderRadius:"16px", padding:"22px 18px", boxShadow:"0 2px 12px rgba(0,0,0,.06)", minHeight:"170px" }}>
          <div style={{ display:"flex", gap:"2px", marginBottom:"12px" }}>
            {[1,2,3,4,5].map(i => <span key={i}>{Icon.star(15)}</span>)}
          </div>
          <p style={{ fontSize:"14px", color: BRAND.gray600, lineHeight:"1.7", fontStyle:"italic" as const, marginBottom:"16px" }}>
            "{TESTIMONIALS[activeTestimonial].text}"
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{
              width:"36px", height:"36px", borderRadius:"50%", flexShrink:0,
              background:`linear-gradient(135deg, ${BRAND.navy}, ${BRAND.light})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: BRAND.white, fontSize:"14px", fontWeight:"700",
            }}>
              {TESTIMONIALS[activeTestimonial].name[0]}
            </div>
            <div>
              <p style={{ fontSize:"13px", fontWeight:"700", color: BRAND.gray800 }}>{TESTIMONIALS[activeTestimonial].name}</p>
              <p style={{ fontSize:"11px", color: BRAND.gray400 }}>{TESTIMONIALS[activeTestimonial].city}</p>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center" as const, gap:"6px", marginTop:"14px" }}>
          {TESTIMONIALS.map((_,i) => (
            <div key={i} onClick={() => setActiveTestimonial(i)} style={{
              width: i===activeTestimonial ? "20px" : "7px", height:"7px",
              borderRadius:"4px", cursor:"pointer", transition:".3s",
              background: i===activeTestimonial ? BRAND.navy : BRAND.gray200,
            }} />
          ))}
        </div>
      </div>

      {/* ── TRUST ── */}
      <div style={{ background: BRAND.navy, padding:"24px 20px" }}>
        {[
          { icon: Icon.lock(18, BRAND.accent),  text:"Seus dados protegidos e 100% seguros" },
          { icon: Icon.file(18, BRAND.accent),  text:"Contrato transparente, sem letras miúdas" },
          { icon: Icon.award(18, BRAND.accent), text:"Bem Corretora regularizada e de confiança" },
          { icon: Icon.chat(18, BRAND.accent),  text:"Suporte via WhatsApp a qualquer momento" },
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom: i<3 ? "14px" : "0" }}>
            {item.icon}
            <span style={{ color:"rgba(255,255,255,.7)", fontSize:"13px" }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={{ background: BRAND.blue, padding:"32px 20px", textAlign:"center" as const }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"14px" }}>
          {Icon.shield(36, "rgba(255,255,255,.2)")}
        </div>
        <h2 style={{ color: BRAND.white, fontSize:"20px", fontWeight:"700", marginBottom:"8px", lineHeight:"1.3" }}>
          Pronto para dirigir protegido?
        </h2>
        <p style={{ color:"rgba(255,255,255,.55)", fontSize:"13px", marginBottom:"24px" }}>
          Finalize sua contratação agora pelo WhatsApp
        </p>
        <button onClick={handleWhatsApp} style={{
          width:"100%", maxWidth:"380px", padding:"17px", border:"none", borderRadius:"12px", cursor:"pointer",
          background: BRAND.green, color: BRAND.white, fontSize:"16px", fontWeight:"700",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          boxShadow:"0 4px 20px rgba(22,163,74,.4)", fontFamily: ff, margin:"0 auto",
        }}>
          {Icon.whatsapp(20, BRAND.white)}
          Contratar / Iniciar Vistoria
        </button>
        {consultant && (
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:"12px", marginTop:"14px" }}>
            Consultor: <strong style={{ color:"rgba(255,255,255,.8)" }}>{consultant.name}</strong>
          </p>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: BRAND.navy, padding:"20px", textAlign:"center" as const, borderTop:`1px solid rgba(255,255,255,.06)` }}>
        <img src="https://drive.google.com/uc?export=view&id=1MYcoJyZcl2astYHSu8a2WZ7paKDTxXHD" alt="Bem Corretora" style={{ height:"22px", objectFit:"contain", filter:"brightness(0) invert(1)", opacity:.35, marginBottom:"8px" }} />
        <p style={{ color:"rgba(255,255,255,.2)", fontSize:"10px" }}>© 2025 Bem Corretora · Todos os direitos reservados</p>
        {proposal.proposalNumber && <p style={{ color:"rgba(255,255,255,.15)", fontSize:"10px", marginTop:"3px" }}>Proposta #{proposal.proposalNumber}</p>}
      </div>

    </div>
  );
}
