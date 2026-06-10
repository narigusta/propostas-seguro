import { google } from "googleapis";

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "";

// ── Proposals ──────────────────────────────────────────────────────────────

export async function getProposal(id: string) {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Propostas!A:Z",
  });
  const rows = res.data.values || [];
  const header = rows[0] || [];
  const row = rows.find((r) => r[0] === id);
  if (!row) return null;
  const obj: Record<string, string> = {};
  header.forEach((h: string, i: number) => { obj[h] = row[i] || ""; });
  return obj;
}

export async function getProposalsByConsultant(consultantId: string) {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Propostas!A:Z",
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  const header = rows[0];
  return rows.slice(1)
    .filter((r) => r[header.indexOf("consultantId")] === consultantId)
    .map((row) => {
      const obj: Record<string, string> = {};
      header.forEach((h: string, i: number) => { obj[h] = row[i] || ""; });
      return obj;
    });
}

export async function createProposal(data: Record<string, string>) {
  const sheets = getSheets();
  // Ensure header row exists
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Propostas!A1:A1",
  });
  const headers = [
    "id","consultantId","clientName","vehicleModel","vehiclePlate",
    "fipeValue","monthlyPrice","firstPayment","franchise",
    "proposalNumber","includedCoverages","addedOptionals","createdAt"
  ];
  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Propostas!A1",
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }
  const row = headers.map((h) => data[h] || "");
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Propostas!A:A",
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

export async function updateProposal(id: string, data: Record<string, string>) {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Propostas!A:Z",
  });
  const rows = res.data.values || [];
  const header = rows[0] || [];
  const rowIndex = rows.findIndex((r) => r[0] === id);
  if (rowIndex < 0) return;
  const newRow = header.map((h: string, i: number) => data[h] || rows[rowIndex][i] || "");
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Propostas!A${rowIndex + 1}`,
    valueInputOption: "RAW",
    requestBody: { values: [newRow] },
  });
}

// ── Consultants ─────────────────────────────────────────────────────────────

export async function getConsultant(id: string) {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Consultores!A:D",
  });
  const rows = res.data.values || [];
  const header = rows[0] || [];
  const row = rows.find((r) => r[0] === id);
  if (!row) return null;
  const obj: Record<string, string> = {};
  header.forEach((h: string, i: number) => { obj[h] = row[i] || ""; });
  return obj;
}

export async function createConsultant(data: { id: string; name: string; whatsapp: string }) {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Consultores!A1:A1",
  });
  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Consultores!A1",
      valueInputOption: "RAW",
      requestBody: { values: [["id", "name", "whatsapp", "createdAt"]] },
    });
  }
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Consultores!A:A",
    valueInputOption: "RAW",
    requestBody: { values: [[data.id, data.name, data.whatsapp, new Date().toISOString()]] },
  });
}
