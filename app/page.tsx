"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatWhatsApp(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10) { setError("WhatsApp inválido."); return; }
    if (!name.trim()) { setError("Digite seu nome."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), whatsapp: digits }),
      });
      const data = await res.json();
      if (data.id) {
        localStorage.setItem("consultantId", data.id);
        localStorage.setItem("consultantName", data.name);
        localStorage.setItem("consultantWhatsapp", digits);
        router.push("/painel");
      }
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛡️</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Sistema de Propostas</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Identifique-se para acessar seu painel</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Seu nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "border .2s" }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Seu WhatsApp</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
              placeholder="(11) 99999-9999"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "border .2s" }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {error && <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "14px", background: loading ? "#94a3b8" : "#16a34a", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", transition: "background .2s" }}
          >
            {loading ? "Entrando..." : "Acessar Painel →"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "24px" }}>
          Cada acesso cria um perfil vinculado ao seu número de WhatsApp
        </p>
      </div>
    </div>
  );
}
