import { createFileRoute } from "@tanstack/react-router";

import { CrudTable } from "@/components/CrudTable";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes e compradores | Controle de Frota" },
      {
        name: "description",
        content:
          "Cadastro de clientes e compradores da frota Parente Andrade, com razão social, contato, corretor e código TOTVS.",
      },
      { property: "og:title", content: "Clientes da frota Parente Andrade" },
      { property: "og:description", content: "Cadastro de compradores e clientes vinculados às vendas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Clientes,
});

function Clientes() {
  return (
    <CrudTable
      table="clients"
      title="Clientes"
      description="Compradores e clientes vinculados às vendas."
      orderBy="short_name"
      searchKeys={["short_name", "legal_name", "broker", "contact", "email", "totvs_code"]}
      columns={[
        { key: "short_name", label: "Nome" },
        { key: "legal_name", label: "Razão social" },
        { key: "broker", label: "Corretor" },
        { key: "contact", label: "Contato" },
        { key: "email", label: "E-mail" },
        { key: "totvs_code", label: "Código TOTVS" },
      ]}
      fields={[
        { key: "short_name", label: "Nome", required: true },
        { key: "legal_name", label: "Razão social" },
        { key: "broker", label: "Corretor" },
        { key: "contact", label: "Contato" },
        { key: "email", label: "E-mail" },
        { key: "address", label: "Endereço", type: "textarea" },
        { key: "acquisitions", label: "Aquisições", type: "number" },
        { key: "totvs_code", label: "Código TOTVS" },
      ]}
    />
  );
}
