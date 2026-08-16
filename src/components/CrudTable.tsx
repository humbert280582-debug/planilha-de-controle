import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Row } from "@/lib/fleet";
import { fmtText } from "@/lib/fleet";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  className?: string;
};

type Props = {
  table: string;
  title: string;
  description?: string;
  columns: Column[];
  fields: Field[];
  searchKeys: string[];
  orderBy?: string;
  fixedValues?: Record<string, unknown>;
  toolbar?: React.ReactNode;
};

export function CrudTable({
  table,
  title,
  description,
  columns,
  fields,
  searchKeys,
  orderBy = "created_at",
  fixedValues,
  toolbar,
}: Props) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const queryKey = [table, fixedValues ?? {}];

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      let q = db.from(table).select("*").order(orderBy, { ascending: true });
      if (fixedValues) {
        for (const [k, v] of Object.entries(fixedValues)) q = q.eq(k, v as string);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      const payload: Record<string, unknown> = { ...fixedValues };
      for (const field of fields) {
        const raw = values[field.key];
        if (raw === undefined || raw === "") payload[field.key] = field.type === "number" ? null : null;
        else payload[field.key] = field.type === "number" ? Number(raw) : raw;
      }
      if (editing?.['id']) {
        const { error } = await db.from(table).update(payload).eq("id", editing['id'] as string);
        if (error) throw error;
      } else {
        const { error } = await db.from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Registro atualizado" : "Registro criado");
      setOpen(false);
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(`Não foi possível salvar: ${error.message}`),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro excluído");
      setDeleteId(null);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(`Não foi possível excluir: ${error.message}`),
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(term)),
    );
  }, [data, search, searchKeys]);

  function openForm(row?: Row) {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const value = row?.[field.key];
      next[field.key] = value === null || value === undefined ? "" : String(value).slice(0, field.type === "date" ? 10 : undefined);
    }
    setForm(next);
    setEditing(row ?? null);
    setOpen(true);
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-56 pl-8"
            />
          </div>
          <Button onClick={() => openForm()}>
            <Plus className="mr-1 h-4 w-4" /> Novo
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-muted-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={String(row['id'])}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.render ? c.render(row) : fmtText(row[c.key])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openForm(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir"
                      onClick={() => setDeleteId(String(row['id']))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar registro" : "Novo registro"}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(form);
            }}
          >
            {fields.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}
              >
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={form[field.key] ?? ""}
                    onValueChange={(v) => setForm({ ...form, [field.key]: v })}
                  >
                    <SelectTrigger id={field.key}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    step={field.type === "number" ? "0.01" : undefined}
                    required={field.required}
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita e o registro será removido definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
