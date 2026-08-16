import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Ban, BadgeDollarSign, FileClock, Truck, Wallet } from "lucide-react";

import { db } from "@/lib/db";
import { fmtMoney, hasImpediment, licenseInfo, toNumber } from "@/lib/fleet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel da frota | Parente Andrade" },
      {
        name: "description",
        content:
          "Visão geral da frota Parente Andrade: veículos, vendas, valores a receber, impedimentos e licenciamentos vencidos.",
      },
      { property: "og:title", content: "Painel da frota Parente Andrade" },
      {
        property: "og:description",
        content: "Indicadores consolidados de veículos, vendas e pendências da frota.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Painel,
});

function Painel() {
  const { data, isLoading } = useQuery({
    queryKey: ["painel"],
    queryFn: async () => {
      const [vehicles, sales, receipts, impediments, licensing] = await Promise.all([
        db.from("vehicles").select("plate,brand,model,uf,status").order("plate"),
        db.from("sales").select("plate,status,amount,buyer").order("plate"),
        db.from("receipts").select("plate,amount").order("plate"),
        db.from("impediments").select("plate,bank_court,contract_process").order("plate"),
        db.from("licensing").select("plate,last_licensing,uf").order("plate"),
      ]);
      return {
        vehicles: vehicles.data ?? [],
        sales: sales.data ?? [],
        receipts: receipts.data ?? [],
        impediments: impediments.data ?? [],
        licensing: licensing.data ?? [],
      };
    },
  });

  if (isLoading || !data) {
    return <p className="text-muted-foreground">Carregando indicadores...</p>;
  }

  const receivedByPlate = new Map<string, number>();
  for (const r of data.receipts) {
    const plate = String(r["plate"]);
    receivedByPlate.set(plate, (receivedByPlate.get(plate) ?? 0) + (toNumber(r["amount"]) ?? 0));
  }

  const soldSales = data.sales.filter((s) => String(s["status"] ?? "") !== "Sem registros");
  const totalSold = soldSales.reduce((acc, s) => acc + (toNumber(s["amount"]) ?? 0), 0);
  const totalReceived = data.receipts.reduce((acc, r) => acc + (toNumber(r["amount"]) ?? 0), 0);
  const openSales = soldSales
    .map((s) => {
      const plate = String(s["plate"]);
      const amount = toNumber(s["amount"]) ?? 0;
      const received = receivedByPlate.get(plate) ?? 0;
      return { plate, buyer: String(s["buyer"] ?? "—"), status: String(s["status"] ?? "—"), balance: amount - received };
    })
    .filter((s) => s.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  const totalOpen = openSales.reduce((acc, s) => acc + s.balance, 0);

  const withImpediment = data.impediments.filter((i) => hasImpediment(i["bank_court"]));

  const licenseRows = data.licensing.map((l) => ({
    plate: String(l["plate"]),
    uf: String(l["uf"] ?? "—"),
    ...licenseInfo(String(l["plate"]), l["last_licensing"]),
  }));
  const expired = licenseRows.filter((l) => l.status === "vencido");
  const noLicenseData = licenseRows.filter((l) => l.status === "sem_dados");

  const cards = [
    { label: "Veículos cadastrados", value: String(data.vehicles.length), icon: Truck, to: "/veiculos" as const },
    { label: "Vendas registradas", value: String(soldSales.length), icon: BadgeDollarSign, to: "/vendas" as const },
    { label: "Total vendido", value: fmtMoney(totalSold), icon: BadgeDollarSign, to: "/vendas" as const },
    { label: "Total recebido", value: fmtMoney(totalReceived), icon: Wallet, to: "/recebimentos" as const },
    { label: "Saldo a receber", value: fmtMoney(totalOpen), icon: Wallet, to: "/recebimentos" as const },
    { label: "Com impedimento", value: String(withImpediment.length), icon: Ban, to: "/impedimentos" as const },
    { label: "Licenciamento vencido", value: String(expired.length), icon: FileClock, to: "/licenciamento" as const },
    {
      label: "Sem dados de licenciamento",
      value: String(noLicenseData.length),
      icon: AlertTriangle,
      to: "/licenciamento" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Painel da frota</h1>
        <p className="text-sm text-muted-foreground">
          Situação consolidada dos {data.vehicles.length} veículos da frota.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="h-full transition-colors hover:border-primary/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saldos a receber</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead className="text-right">Falta pagar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      Nenhum saldo em aberto.
                    </TableCell>
                  </TableRow>
                ) : (
                  openSales.slice(0, 12).map((s) => (
                    <TableRow key={s.plate}>
                      <TableCell>
                        <Link to="/veiculos/$placa" params={{ placa: s.plate }} className="plate text-primary">
                          {s.plate}
                        </Link>
                      </TableCell>
                      <TableCell>{s.buyer}</TableCell>
                      <TableCell className="text-right">{fmtMoney(s.balance)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Licenciamentos vencidos</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead className="text-right">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expired.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      Nenhum licenciamento vencido com data registrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  expired.slice(0, 12).map((l) => (
                    <TableRow key={l.plate}>
                      <TableCell>
                        <Link to="/veiculos/$placa" params={{ placa: l.plate }} className="plate text-primary">
                          {l.plate}
                        </Link>
                      </TableCell>
                      <TableCell>{l.uf}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="destructive">{l.label}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
