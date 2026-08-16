import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BadgeDollarSign,
  Ban,
  FileClock,
  Gauge,
  LogOut,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/painel", label: "Painel", icon: Gauge },
  { to: "/veiculos", label: "Veículos", icon: Truck },
  { to: "/vendas", label: "Vendas", icon: BadgeDollarSign },
  { to: "/recebimentos", label: "Recebimentos", icon: Wallet },
  { to: "/licenciamento", label: "Licenciamento", icon: FileClock },
  { to: "/impedimentos", label: "Impedimentos", icon: Ban },
  { to: "/clientes", label: "Clientes", icon: Users },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-sidebar/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/painel" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Truck className="h-4 w-4" />
            </span>
            <span className="font-display text-lg leading-none font-semibold tracking-tight">
              Controle de Frota
              <span className="block text-[11px] font-normal tracking-widest text-muted-foreground uppercase">
                Parente Andrade
              </span>
            </span>
          </Link>

          <nav className="flex flex-1 flex-wrap items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground [&.active]:bg-sidebar-accent [&.active]:text-primary"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-1 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
