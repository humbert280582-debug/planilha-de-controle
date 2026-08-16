import { createFileRoute, Link } from "@tanstack/react-router";

import { CrudTable } from "@/components/CrudTable";
import { SALE_STATUS, fmtMoney } from "@/lib/fleet";

export const Route = createFileRoute("/_authenticated/vendas")({
  head: () => ({
    meta: [
      { title: "Vendas de veículos | Controle de Frota" },
      {
        name: "description",
        content:
          "Registro das vendas de veículos da frota Parente Andrade com comprador, valor, nota fiscal e situação da transferência.",
      },
      { property: "og:title", content: "Vendas de veículos da frota" },
      { property: "og:description", content: "Controle de vendas, compradores e transferências da frota." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vendas,
});

function Vendas() {
  return (
    <CrudTable
      table="sales"
      title="Vendas"
      description="Todas as vendas registradas na frota."
      orderBy="plate"
      searchKeys={["plate", "buyer", "status", "invoice", "transfer_client"]}
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
        { key: "status", label: "Situação" },
        { key: "buyer", label: "Comprador" },
        { key: "amount", label: "Valor", render: (row) => fmtMoney(row["amount"]) },
        { key: "transfer_client", label: "Transferido para" },
        { key: "invoice", label: "Nota fiscal" },
      ]}
      fields={[
        { key: "plate", label: "Placa", required: true },
        { key: "status", label: "Situação", type: "select", options: SALE_STATUS },
        { key: "buyer", label: "Comprador" },
        { key: "amount", label: "Valor", type: "number" },
        { key: "transfer_client", label: "Transferido para" },
        { key: "invoice", label: "Nota fiscal" },
        { key: "notes", label: "Observações", type: "textarea" },
      ]}
    />
  );
}
