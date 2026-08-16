import { createFileRoute, Link } from "@tanstack/react-router";

import { CrudTable } from "@/components/CrudTable";
import { fmtDate, fmtMoney } from "@/lib/fleet";

export const Route = createFileRoute("/_authenticated/recebimentos")({
  head: () => ({
    meta: [
      { title: "Recebimentos | Controle de Frota" },
      {
        name: "description",
        content:
          "Lançamentos de recebimentos das vendas de veículos da frota Parente Andrade, com data, valor e origem.",
      },
      { property: "og:title", content: "Recebimentos das vendas da frota" },
      { property: "og:description", content: "Acompanhe os valores recebidos por veículo vendido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Recebimentos,
});

function Recebimentos() {
  return (
    <CrudTable
      table="receipts"
      title="Recebimentos"
      description="Valores recebidos por veículo."
      orderBy="plate"
      searchKeys={["plate", "source"]}
      columns={[
        {
          key: "plate",
          label: "Placa",
          render: (row) => (
            <Link to="/veiculos/$placa" params={{ placa: String(row["plate"]) }} className="plate text-primary">
              {String(row["plate"])}
            </Link>
          ),
        },
        { key: "received_at", label: "Data", render: (row) => fmtDate(row["received_at"]) },
        { key: "amount", label: "Valor", render: (row) => fmtMoney(row["amount"]) },
        { key: "source", label: "Origem" },
      ]}
      fields={[
        { key: "plate", label: "Placa", required: true },
        { key: "received_at", label: "Data", type: "date" },
        { key: "amount", label: "Valor", type: "number" },
        { key: "source", label: "Origem" },
      ]}
    />
  );
}
