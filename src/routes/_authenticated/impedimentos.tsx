import { createFileRoute, Link } from "@tanstack/react-router";

import { CrudTable } from "@/components/CrudTable";
import { hasImpediment } from "@/lib/fleet";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/impedimentos")({
  head: () => ({
    meta: [
      { title: "Impedimentos jurídicos | Controle de Frota" },
      {
        name: "description",
        content:
          "Impedimentos jurídicos e bancários dos veículos da frota Parente Andrade, com banco, vara, contrato e processo.",
      },
      { property: "og:title", content: "Impedimentos jurídicos da frota" },
      { property: "og:description", content: "Restrições bancárias e judiciais por veículo da frota." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Impedimentos,
});

function Impedimentos() {
  return (
    <CrudTable
      table="impediments"
      title="Impedimentos"
      description="Restrições bancárias e judiciais registradas por veículo."
      orderBy="plate"
      searchKeys={["plate", "bank_court", "contract_process", "notes"]}
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
        { key: "bank_court", label: "Banco / Vara" },
        { key: "contract_process", label: "Contrato / Processo" },
        {
          key: "situacao",
          label: "Situação",
          render: (row) =>
            hasImpediment(row["bank_court"]) ? (
              <Badge variant="destructive">Com impedimento</Badge>
            ) : (
              <Badge variant="secondary">Livre</Badge>
            ),
        },
      ]}
      fields={[
        { key: "plate", label: "Placa", required: true },
        { key: "bank_court", label: "Banco / Vara" },
        { key: "contract_process", label: "Contrato / Processo" },
        { key: "notes", label: "Observações", type: "textarea" },
      ]}
    />
  );
}
