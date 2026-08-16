
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL UNIQUE,
  brand text, model text, fab_mod text, tank_liters numeric, renavam text, chassis text,
  color text, fuel text, seating text, species text, vehicle_type text, body_type text,
  category text, capacity text, power_cv text, displacement text, engine text, cmt text,
  axles text, pbt text, uf text, dut_crv text, product_code text, product_desc text,
  status text, owner_name text, owner_document text, fipe_detail text, fipe_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.licensing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL, plate_final text, last_licensing date, uf text, term text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.vehicle_implements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL, specification text, supplier text, invoice text, description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.impediments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL, bank_court text, contract_process text, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL, status text, amount numeric DEFAULT 0, buyer text,
  transfer_client text, invoice text, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL, amount numeric NOT NULL DEFAULT 0, received_at date, source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_name text NOT NULL, broker text, address text, email text, contact text,
  acquisitions numeric DEFAULT 0, totvs_code text, legal_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicles_auth_all" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.licensing TO authenticated;
GRANT ALL ON public.licensing TO service_role;
ALTER TABLE public.licensing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "licensing_auth_all" ON public.licensing FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_licensing_updated BEFORE UPDATE ON public.licensing FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicle_implements TO authenticated;
GRANT ALL ON public.vehicle_implements TO service_role;
ALTER TABLE public.vehicle_implements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicle_implements_auth_all" ON public.vehicle_implements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_vehicle_implements_updated BEFORE UPDATE ON public.vehicle_implements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.impediments TO authenticated;
GRANT ALL ON public.impediments TO service_role;
ALTER TABLE public.impediments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "impediments_auth_all" ON public.impediments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_impediments_updated BEFORE UPDATE ON public.impediments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sales_auth_all" ON public.sales FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts TO authenticated;
GRANT ALL ON public.receipts TO service_role;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "receipts_auth_all" ON public.receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_receipts_updated BEFORE UPDATE ON public.receipts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_auth_all" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_licensing_plate ON public.licensing(plate);
CREATE INDEX idx_implements_plate ON public.vehicle_implements(plate);
CREATE INDEX idx_impediments_plate ON public.impediments(plate);
CREATE INDEX idx_sales_plate ON public.sales(plate);
CREATE INDEX idx_receipts_plate ON public.receipts(plate);
