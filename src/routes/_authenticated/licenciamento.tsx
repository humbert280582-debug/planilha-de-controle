import { createFileRoute, Link } from "@tanstack/react-router";

import { CrudTable } from "@/components/CrudTable";
import { UFS, fmtDate, licenseInfo } from "@/lib/fleet";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/licenciamento")({
  head: () => ({
    meta: [
      { title: "Licenciamento da frota | Parente Andrade" },
      {
        name: "description",
        content:
          "Controle de licenciamento dos veículos da frota Parente Andrade com vencimento calculado pelo final da placa.",
      },
      { property: "og:title", content: "Licenciamento da frota Parente Andrade" },
      { property: "og:description", content: "Vencimentos de licenciamento por veículo e UF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Licenciamento,
});

function Licenciamento() {
  return (
    <CrudTable
      table="licensing"
      title="Licenciamento"
      description="Vencimento estimado pelo final da placa a partir do último licenciamento registrado."
      orderBy="plate"
      searchKeys={["plate", "uf", "term", "plate_final"]}
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
        { key: "last_licensing", label: "Último licenciamento", render: (row) => fmtDate(row["last_licensing"]) },
        { key: "plate_final", label: "Final" },
        { key: "uf", label: "UF" },
        {
          key: "situacao",
          label: "Situação",
          render: (row) => {
            const info = licenseInfo(String(row["plate"]), row["last_licensing"]);
            const variant =
              info.status === "vencido" ? "destructive" : info.status === "a_vencer" ? "default" : "secondary";
            return <Badge variant={variant}>{info.label}</Badge>;
          },
        },
      ]}
      fields={[
        { key: "plate", label: "Placa", required: true },
        { key: "last_licensing", label: "Último licenciamento", type: "date" },
        { key: "plate_final", label: "Final da placa" },
        { key: "uf", label: "UF", type: "select", options: UFS },
        { key: "term", label: "Prazo" },
      ]}
    />
  );
}
