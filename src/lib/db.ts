import { supabase } from "@/integrations/supabase/client";
import type { Row } from "@/lib/fleet";

type Result = { data: Row[] | null; error: { message: string } | null };

/** Query builder mínimo para tabelas resolvidas em tempo de execução. */
export interface LooseQuery extends PromiseLike<Result> {
  select(columns: string): LooseQuery;
  order(column: string, options?: { ascending?: boolean }): LooseQuery;
  eq(column: string, value: unknown): LooseQuery;
  update(values: Record<string, unknown>): LooseQuery;
  insert(values: Record<string, unknown>): LooseQuery;
  delete(): LooseQuery;
  maybeSingle(): PromiseLike<{ data: Row | null; error: { message: string } | null }>;
}

export const db = supabase as unknown as { from(table: string): LooseQuery };
