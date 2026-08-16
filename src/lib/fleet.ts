export type Row = Record<string, unknown>;

export const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

export const SALE_STATUS = ["Sem registros", "Não Transferido", "Transferido", "Quitado"];

export function fmtMoney(value: unknown): string {
  const n = toNumber(value);
  if (n === null) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
}

export function fmtDate(value: unknown): string {
  if (!value) return "—";
  const s = String(value).slice(0, 10);
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return String(value);
  return `${d}/${m}/${y}`;
}

export function fmtText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Mês de vencimento do licenciamento conforme o final da placa (calendário padrão). */
const MONTH_BY_FINAL: Record<string, number> = {
  "1": 4, "2": 5, "3": 6, "4": 7, "5": 8, "6": 9, "7": 10, "8": 11, "9": 11, "0": 12,
};

export type LicenseStatus = "vencido" | "a_vencer" | "em_dia" | "sem_dados";

export function licenseInfo(plate: string, lastLicensing: unknown): {
  status: LicenseStatus;
  dueDate: Date | null;
  label: string;
} {
  const digits = plate.replace(/\D/g, "");
  const final = digits.slice(-1);
  const month = MONTH_BY_FINAL[final] ?? 12;
  const today = new Date();
  const lastYear = lastLicensing ? Number(String(lastLicensing).slice(0, 4)) : null;

  if (!lastYear) {
    return { status: "sem_dados", dueDate: null, label: "Sem registro" };
  }

  const dueYear = lastYear + 1;
  const dueDate = new Date(dueYear, month, 0);
  const days = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);

  if (days < 0) return { status: "vencido", dueDate, label: `Vencido há ${Math.abs(days)} dias` };
  if (days <= 60) return { status: "a_vencer", dueDate, label: `Vence em ${days} dias` };
  return { status: "em_dia", dueDate, label: "Em dia" };
}

export const IMPEDIMENT_FREE = ["DESCONHECIDO", "", "0", "*"];

export function hasImpediment(bankCourt: unknown): boolean {
  const v = String(bankCourt ?? "").trim().toUpperCase();
  return v !== "" && v !== "DESCONHECIDO";
}
