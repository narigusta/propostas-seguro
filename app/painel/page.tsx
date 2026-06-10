"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_INCLUDED, OPTIONAL_COVERAGES } from "@/lib/coverages";

interface Proposal {
  id: string;
  clientName: string;
  vehicleModel: string;
  vehiclePlate: string;
  fipeValue: string;
  monthlyPrice: string;
  firstPayment: string;
  franchise: string;
  proposalNumber: string;
  includedCoverages: string;
  addedOptionals: string;
  createdAt: string;
}

const emptyForm = {
  clientName: "",
  vehicleModel: "",
  vehiclePlate: "",
  fipeValue: "",
  monthlyPrice: "",
  oldPrice: "",
  firstPayment: "",
  franchise: "",
  proposalNumber: "",
  includedCoverages: DEFAULT_INCLUDED.map((c) => c.id).join(","),
  addedOptionals: "",
};

export default function PainelPage() {
  const router = useRouter();
  const [consultantId, setConsultantId] = useState("");
  const [consultantName, setConsultantName] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [includedIds, setIncludedIds] = useState<string[]>(DEFAULT_INCLUDED.map((c) => c.id));
  const [optionalIds, setOptionalIds] = useState<string[]>([]);

  const loadProposals = useCallback(async (cid: string) => {
    try {
      const res = await fetch(`/api/proposal?consultantId=${cid}`);
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch { setProposals([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const cid = localStorage.getItem("consultantId") || "";
    const cname = localStorage.getItem("consultantName") || "";
    if (!cid) { router.push("/"); return; }
    setConsultantId(cid);
    setConsultantName(cname);
    loadProposals(cid);
  }, [router, loadProposals]);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setIncludedIds(DEFAULT_INCLUDED.map((c) => c.id));
    setOptionalIds([]);
    setShowForm(true);
  }

  function openEdit(p: Proposal) {
    setEditingId(p.id);
    const inc = p.includedCoverages ? p.includedCoverages.split(",").filter(Boolean) : DEFAULT_INCLUDED.map((c) => c.id);
    const opt = p.addedOptionals ? p.addedOptionals.split(",").filter(Boolean) : [];
    setIncludedIds(inc);
    setOptionalIds(opt);
    setForm({
      clientName: p.clientName,
      vehicleModel: p.vehicleModel,
      vehiclePlate: p.vehiclePlate,
      fipeValue: p.fipeValue,
      monthlyPrice: p.monthlyPrice,
      oldPrice: "",
      firstPayment: p.firstPayment,
      franchise: p.franchise,
      proposalNumber: p.proposalNumber,
      includedCoverages: p.includedCoverages,
      addedOptionals: p.addedOptionals,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.clientName || !form.vehicleModel || !form.monthlyPrice) {
      alert("Preencha: nome do cliente, modelo do veículo e valor mensal."); return;
    }
    setSaving(true);
    const payload = {
      ...form,
      consultantId,
      includedCoverages: includedIds.join(","),
      addedOptionals: optionalIds.join(","),
    };
    try {
      if (editingId) {
        await fetch("/api/proposal", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch("/api/proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      loadProposals(consultantId);
    } catch { alert("Erro ao salvar. Tente novamente."); }
    setSaving(false);
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/proposta/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleIncluded(id: string) {
    setIncludedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function toggleOptional(id: string) {
    setOptionalIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb",
    borderRadius: "8px", fontSize: "14px", outline: "none", background: "white"
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px"
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9" }}>
      <p style={{ color: "#64748b", fontSize: "16px" }}>Carregando...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      {/* Header */}
      <div style={{ background: "#0f172a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🛡️</span>
          <div>
            <h1 style={{ color: "white", fontSize: "16px", fontWeight: "700" }}>Painel do Consultor</h1>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>Olá, {consultantName}</p>
          </div>
        </div>
        <button
          onClick={() => { localStorage.clear(); router.push("/"); }}
          style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}
        >
          Sair
        </button>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px 20px" }}>
        {/* Action bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
            Minhas Propostas <span style={{ color: "#64748b", fontWeight: "400", fontSize: "14px" }}>({proposals.length})</span>
          </h2>
          <button
            onClick={openNew}
            style={{ background: "#16a34a", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            + Nova Proposta
          </button>
        </div>

        {/* Proposals list */}
        {proposals.length === 0 ? (
          <div style={{ background: "white", borderRadius: "16px", padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <p style={{ color: "#64748b", fontSize: "16px" }}>Nenhuma proposta criada ainda.</p>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "8px" }}>Clique em "Nova Proposta" para começar.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {proposals.map((p) => (
              <div key={p.id} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ fontWeight: "700", fontSize: "16px", color: "#0f172a" }}>{p.clientName}</div>
                  <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{p.vehicleModel}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                    {p.proposalNumber && <span style={{ marginRight: "10px" }}>#{p.proposalNumber}</span>}
                    {p.vehiclePlate && <span>Placa: {p.vehiclePlate}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#16a34a" }}>R$ {p.monthlyPrice}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>por mês</div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => copyLink(p.id)}
                    style={{ background: copiedId === p.id ? "#16a34a" : "#f1f5f9", color: copiedId === p.id ? "white" : "#374151", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    {copiedId === p.id ? "✓ Copiado!" : "🔗 Copiar Link"}
                  </button>
                  <button
                    onClick={() => window.open(`/proposta/${p.id}`, "_blank")}
                    style={{ background: "#eff6ff", color: "#2563eb", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    👁 Ver
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    style={{ background: "#fff7ed", color: "#ea580c", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "680px", padding: "32px", margin: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                {editingId ? "Editar Proposta" : "Nova Proposta"}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "18px" }}>×</button>
            </div>

            {/* Form fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Nome do Cliente *</label>
                <input style={inputStyle} value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Ex: José Silva" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Modelo do Veículo *</label>
                <input style={inputStyle} value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} placeholder="Ex: Fiat Mobi Trekking 1.0 Flex 2025" />
              </div>
              <div>
                <label style={labelStyle}>Placa (últimos dígares visíveis)</label>
                <input style={inputStyle} value={form.vehiclePlate} onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })} placeholder="Ex: MUI-**84" />
              </div>
              <div>
                <label style={labelStyle}>Número da Proposta</label>
                <input style={inputStyle} value={form.proposalNumber} onChange={(e) => setForm({ ...form, proposalNumber: e.target.value })} placeholder="Ex: 1579558" />
              </div>
              <div>
                <label style={labelStyle}>Valor FIPE</label>
                <input style={inputStyle} value={form.fipeValue} onChange={(e) => setForm({ ...form, fipeValue: e.target.value })} placeholder="Ex: R$ 66.890,00" />
              </div>
              <div>
                <label style={labelStyle}>Franquia</label>
                <input style={inputStyle} value={form.franchise} onChange={(e) => setForm({ ...form, franchise: e.target.value })} placeholder="Ex: R$ 4.347,85" />
              </div>
              <div>
                <label style={labelStyle}>Valor Mensal (atual) *</label>
                <input style={inputStyle} value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })} placeholder="Ex: 298,17" />
              </div>
              <div>
                <label style={labelStyle}>Valor Mensal (riscado/antigo)</label>
                <input style={inputStyle} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Ex: 371,46 (opcional)" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Primeira Parcela</label>
                <input style={inputStyle} value={form.firstPayment} onChange={(e) => setForm({ ...form, firstPayment: e.target.value })} placeholder="Ex: R$ 668,90" />
              </div>
            </div>

            {/* Included coverages */}
            <div style={{ marginTop: "24px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                ✅ Coberturas Incluídas <span style={{ color: "#64748b", fontWeight: "400" }}>(desmarque para remover)</span>
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto", padding: "4px" }}>
                {DEFAULT_INCLUDED.map((c) => (
                  <label key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: includedIds.includes(c.id) ? "#f0fdf4" : "#f8fafc", border: `1px solid ${includedIds.includes(c.id) ? "#86efac" : "#e5e7eb"}`, cursor: "pointer" }}>
                    <input type="checkbox" checked={includedIds.includes(c.id)} onChange={() => toggleIncluded(c.id)} style={{ width: "16px", height: "16px", accentColor: "#16a34a" }} />
                    <span style={{ fontSize: "13px", color: "#374151" }}>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional coverages */}
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                ➕ Opcionais <span style={{ color: "#64748b", fontWeight: "400" }}>(marque para adicionar)</span>
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto", padding: "4px" }}>
                {OPTIONAL_COVERAGES.map((c) => (
                  <label key={c.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: optionalIds.includes(c.id) ? "#eff6ff" : "#f8fafc", border: `1px solid ${optionalIds.includes(c.id) ? "#93c5fd" : "#e5e7eb"}`, cursor: "pointer" }}>
                    <input type="checkbox" checked={optionalIds.includes(c.id)} onChange={() => toggleOptional(c.id)} style={{ width: "16px", height: "16px", accentColor: "#2563eb" }} />
                    <span style={{ fontSize: "13px", color: "#374151" }}>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "14px", background: "#f1f5f9", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", color: "#374151" }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "14px", background: saving ? "#94a3b8" : "#16a34a", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Salvando..." : editingId ? "Salvar Alterações" : "Criar Proposta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
