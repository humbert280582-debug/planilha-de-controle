import { createFileRoute, Link } from "@tanstack/react-router";

import { CrudTable } from "@/components/CrudTable";
import { UFS, fmtText } from "@/lib/fleet";
import type { Row } from "@/lib/fleet";

export const Route = createFileRoute("/_authenticated/veiculos/")({
  head: () => ({
    meta: [
      { title: "Veículos da frota | Parente Andrade" },
      {
        name: "description",
        content:
          "Cadastro completo dos veículos da frota Parente Andrade: placa, marca, modelo, chassi, Renavam e situação.",
      },
      { property: "og:title", content: "Veículos da frota Parente Andrade" },
      { property: "og:description", content: "Consulte, cadastre e edite os veículos da frota." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Veiculos,
});

function Veiculos() {
  return (
    <CrudTable
      table="vehicles"
      title="Veículos"
      description="Cadastro fixo da frota. Clique na placa para ver o detalhamento completo."
      orderBy="plate"
      searchKeys={["plate", "brand", "model", "chassis", "renavam", "owner_name", "status"]}
      columns={[
        {
          key: "plate",
          label: "Placa",
          render: (row: Row) => (
            <Link
              to="/veiculos/$placa"
              params={{ placa: String(row["plate"]) }}
              className="plate font-medium text-primary"
            >
              {String(row["plate"])}
            </Link>
          ),
        },
        { key: "brand", label: "Marca" },
        { key: "model", label: "Modelo" },
        { key: "fab_mod", label: "Ano" },
        { key: "vehicle_type", label: "Tipo" },
        { key: "uf", label: "UF" },
        { key: "status", label: "Situação", render: (row) => fmtText(row["status"]) },
      ]}
      fields={[
        { key: "plate", label: "Placa", required: true },
        { key: "brand", label: "Marca" },
        { key: "model", label: "Modelo" },
        { key: "fab_mod", label: "Ano fab./mod." },
        { key: "renavam", label: "Renavam" },
        { key: "chassis", label: "Chassi" },
        { key: "color", label: "Cor" },
        { key: "fuel", label: "Combustível" },
        { key: "vehicle_type", label: "Tipo" },
        { key: "body_type", label: "Carroceria" },
        { key: "category", label: "Categoria" },
        { key: "capacity", label: "Capacidade" },
        { key: "power_cv", label: "Potência (cv)" },
        { key: "displacement", label: "Cilindrada" },
        { key: "engine", label: "Motor" },
        { key: "axles", label: "Eixos" },
        { key: "pbt", label: "PBT" },
        { key: "cmt", label: "CMT" },
        { key: "tank_liters", label: "Tanque (L)", type: "number" },
        { key: "uf", label: "UF", type: "select", options: UFS },
        { key: "status", label: "Situação" },
        { key: "owner_name", label: "Proprietário" },
        { key: "owner_document", label: "CNPJ/CPF do proprietário" },
        { key: "fipe_code", label: "Código FIPE" },
        { key: "fipe_detail", label: "Detalhe FIPE" },
        { key: "product_code", label: "Código do produto" },
        { key: "product_desc", label: "Descrição do produto", type: "textarea" },
      ]}
    />
  );
}
