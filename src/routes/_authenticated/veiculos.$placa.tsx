import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { db } from "@/lib/db";
import { CrudTable } from "@/components/CrudTable";
import { SALE_STATUS, UFS, fmtDate, fmtMoney, fmtText, licenseInfo, toNumber } from "@/lib/fleet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/veiculos/$placa")({
  head: ({ params }) => ({
    meta: [
      { title: `Veículo ${params.placa} | Controle de Frota` },
      {
        name: "description",
        content: `Ficha completa do veículo de placa ${params.placa}: dados técnicos, implementos, licenciamento, impedimentos, venda e recebimentos.`,
      },
      { property: "og:title", content: `Veículo ${params.placa}` },
      {
        property: "og:description",
        content: `Ficha técnica, financeira e legal do veículo ${params.placa} da frota Parente Andrade.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VehicleDetail,
});

const SPECS: { key: string; label: string }[] = [
  { key: "brand", label: "Marca" },
  { key: "model", label: "Modelo" },
  { key: "fab_mod", label: "Ano fab./mod." },
  { key: "renavam", label: "Renavam" },
  { key: "chassis", label: "Chassi" },
  { key: "color", label: "Cor" },
  { key: "fuel", label: "Combustível" },
  { key: "seating", label: "Lotação" },
  { key: "species", label: "Espécie" },
  { key: "vehicle_type", label: "Tipo" },
  { key: "body_type", label: "Carroceria" },
  { key: "category", label: "Categoria" },
  { key: "capacity", label: "Capacidade" },
  { key: "power_cv", label: "Potência" },
  { key: "displacement", label: "Cilindrada" },
  { key: "engine", label: "Motor" },
  { key: "axles", label: "Eixos" },
  { key: "pbt", label: "PBT" },
  { key: "cmt", label: "CMT" },
  { key: "tank_liters", label: "Tanque (L)" },
  { key: "uf", label: "UF" },
  { key: "dut_crv", label: "DUT/CRV" },
  { key: "owner_name", label: "Proprietário" },
  { key: "owner_document", label: "CNPJ/CPF" },
  { key: "fipe_code", label: "Código FIPE" },
  { key: "fipe_detail", label: "Detalhe FIPE" },
  { key: "product_code", label: "Código do produto" },
  { key: "product_desc", label: "Descrição do produto" },
];

function VehicleDetail() {
  const { placa } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", placa],
    queryFn: async () => {
      const [vehicle, licensing, sales, receipts] = await Promise.all([
        db.from("vehicles").select("*").eq("plate", placa).maybeSingle(),
        db.from("licensing").select("*").eq("plate", placa),
        db.from("sales").select("*").eq("plate", placa),
        db.from("receipts").select("*").eq("plate", placa),
      ]);
      return {
        vehicle: vehicle.data,
        licensing: licensing.data ?? [],
        sales: sales.data ?? [],
        receipts: receipts.data ?? [],
      };
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Carregando veículo...</p>;
  if (!data?.vehicle) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Nenhum veículo encontrado para a placa {placa}.</p>
        <Link to="/veiculos" className="text-primary">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  const vehicle = data.vehicle;
  const license = data.licensing[0];
  const info = licenseInfo(placa, license?.["last_licensing"]);
  const sold = data.sales.reduce((acc, s) => acc + (toNumber(s["amount"]) ?? 0), 0);
  const received = data.receipts.reduce((acc, r) => acc + (toNumber(r["amount"]) ?? 0), 0);

  return (
    <div className="space-y-6">
      <Link to="/veiculos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para veículos
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="plate text-3xl font-semibold">{placa}</h1>
          <p className="text-sm text-muted-foreground">
            {fmtText(vehicle["brand"])} · {fmtText(vehicle["model"])} · {fmtText(vehicle["fab_mod"])}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={info.status === "vencido" ? "destructive" : "secondary"}>
            Licenciamento: {info.label}
          </Badge>
          <Badge variant="outline">Vendido: {fmtMoney(sold)}</Badge>
          <Badge variant="outline">Recebido: {fmtMoney(received)}</Badge>
          <Badge variant={sold - received > 0 ? "destructive" : "secondary"}>
            Saldo: {fmtMoney(sold - received)}
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="dados">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dados">Dados técnicos</TabsTrigger>
          <TabsTrigger value="implementos">Implementos</TabsTrigger>
          <TabsTrigger value="licenciamento">Licenciamento</TabsTrigger>
          <TabsTrigger value="impedimentos">Impedimentos</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="recebimentos">Recebimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ficha do veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SPECS.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
                  <p className="text-sm">{fmtText(vehicle[key])}</p>
                </div>
              ))}
              <div>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Último licenciamento
                </p>
                <p className="text-sm">{fmtDate(license?.["last_licensing"])}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementos" className="pt-4">
          <CrudTable
            table="vehicle_implements"
            title="Implementos"
            fixedValues={{ plate: placa }}
            searchKeys={["specification", "supplier", "invoice", "description"]}
            columns={[
              { key: "specification", label: "Especificação" },
              { key: "supplier", label: "Fornecedor" },
              { key: "invoice", label: "Nota fiscal" },
              { key: "description", label: "Descrição" },
            ]}
            fields={[
              { key: "specification", label: "Especificação" },
              { key: "supplier", label: "Fornecedor" },
              { key: "invoice", label: "Nota fiscal" },
              { key: "description", label: "Descrição", type: "textarea" },
            ]}
          />
        </TabsContent>

        <TabsContent value="licenciamento" className="pt-4">
          <CrudTable
            table="licensing"
            title="Licenciamento"
            fixedValues={{ plate: placa }}
            searchKeys={["uf", "term", "plate_final"]}
            columns={[
              { key: "last_licensing", label: "Último licenciamento", render: (r) => fmtDate(r["last_licensing"]) },
              { key: "plate_final", label: "Final da placa" },
              { key: "uf", label: "UF" },
              { key: "term", label: "Prazo" },
            ]}
            fields={[
              { key: "last_licensing", label: "Último licenciamento", type: "date" },
              { key: "plate_final", label: "Final da placa" },
              { key: "uf", label: "UF", type: "select", options: UFS },
              { key: "term", label: "Prazo" },
            ]}
          />
        </TabsContent>

        <TabsContent value="impedimentos" className="pt-4">
          <CrudTable
            table="impediments"
            title="Impedimentos"
            fixedValues={{ plate: placa }}
            searchKeys={["bank_court", "contract_process", "notes"]}
            columns={[
              { key: "bank_court", label: "Banco / Vara" },
              { key: "contract_process", label: "Contrato / Processo" },
              { key: "notes", label: "Observações" },
            ]}
            fields={[
              { key: "bank_court", label: "Banco / Vara" },
              { key: "contract_process", label: "Contrato / Processo" },
              { key: "notes", label: "Observações", type: "textarea" },
            ]}
          />
        </TabsContent>

        <TabsContent value="vendas" className="pt-4">
          <CrudTable
            table="sales"
            title="Vendas"
            fixedValues={{ plate: placa }}
            searchKeys={["buyer", "status", "invoice", "transfer_client"]}
            columns={[
              { key: "status", label: "Situação" },
              { key: "buyer", label: "Comprador" },
              { key: "amount", label: "Valor", render: (r) => fmtMoney(r["amount"]) },
              { key: "transfer_client", label: "Transferido para" },
              { key: "invoice", label: "Nota fiscal" },
            ]}
            fields={[
              { key: "status", label: "Situação", type: "select", options: SALE_STATUS },
              { key: "buyer", label: "Comprador" },
              { key: "amount", label: "Valor", type: "number" },
              { key: "transfer_client", label: "Transferido para" },
              { key: "invoice", label: "Nota fiscal" },
              { key: "notes", label: "Observações", type: "textarea" },
            ]}
          />
        </TabsContent>

        <TabsContent value="recebimentos" className="pt-4">
          <CrudTable
            table="receipts"
            title="Recebimentos"
            fixedValues={{ plate: placa }}
            searchKeys={["source"]}
            columns={[
              { key: "received_at", label: "Data", render: (r) => fmtDate(r["received_at"]) },
              { key: "amount", label: "Valor", render: (r) => fmtMoney(r["amount"]) },
              { key: "source", label: "Origem" },
            ]}
            fields={[
              { key: "received_at", label: "Data", type: "date" },
              { key: "amount", label: "Valor", type: "number" },
              { key: "source", label: "Origem" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
