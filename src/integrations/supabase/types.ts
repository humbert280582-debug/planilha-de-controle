export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          acquisitions: number | null
          address: string | null
          broker: string | null
          contact: string | null
          created_at: string
          email: string | null
          id: string
          legal_name: string | null
          short_name: string
          totvs_code: string | null
          updated_at: string
        }
        Insert: {
          acquisitions?: number | null
          address?: string | null
          broker?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          short_name: string
          totvs_code?: string | null
          updated_at?: string
        }
        Update: {
          acquisitions?: number | null
          address?: string | null
          broker?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          short_name?: string
          totvs_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impediments: {
        Row: {
          bank_court: string | null
          contract_process: string | null
          created_at: string
          id: string
          notes: string | null
          plate: string
          updated_at: string
        }
        Insert: {
          bank_court?: string | null
          contract_process?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          plate: string
          updated_at?: string
        }
        Update: {
          bank_court?: string | null
          contract_process?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          plate?: string
          updated_at?: string
        }
        Relationships: []
      }
      licensing: {
        Row: {
          created_at: string
          id: string
          last_licensing: string | null
          plate: string
          plate_final: string | null
          term: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_licensing?: string | null
          plate: string
          plate_final?: string | null
          term?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_licensing?: string | null
          plate?: string
          plate_final?: string | null
          term?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          id: string
          plate: string
          received_at: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          plate: string
          received_at?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          plate?: string
          received_at?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number | null
          buyer: string | null
          created_at: string
          id: string
          invoice: string | null
          notes: string | null
          plate: string
          status: string | null
          transfer_client: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          buyer?: string | null
          created_at?: string
          id?: string
          invoice?: string | null
          notes?: string | null
          plate: string
          status?: string | null
          transfer_client?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          buyer?: string | null
          created_at?: string
          id?: string
          invoice?: string | null
          notes?: string | null
          plate?: string
          status?: string | null
          transfer_client?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_implements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invoice: string | null
          plate: string
          specification: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invoice?: string | null
          plate: string
          specification?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invoice?: string | null
          plate?: string
          specification?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          axles: string | null
          body_type: string | null
          brand: string | null
          capacity: string | null
          category: string | null
          chassis: string | null
          cmt: string | null
          color: string | null
          created_at: string
          displacement: string | null
          dut_crv: string | null
          engine: string | null
          fab_mod: string | null
          fipe_code: string | null
          fipe_detail: string | null
          fuel: string | null
          id: string
          model: string | null
          owner_document: string | null
          owner_name: string | null
          pbt: string | null
          plate: string
          power_cv: string | null
          product_code: string | null
          product_desc: string | null
          renavam: string | null
          seating: string | null
          species: string | null
          status: string | null
          tank_liters: number | null
          uf: string | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          axles?: string | null
          body_type?: string | null
          brand?: string | null
          capacity?: string | null
          category?: string | null
          chassis?: string | null
          cmt?: string | null
          color?: string | null
          created_at?: string
          displacement?: string | null
          dut_crv?: string | null
          engine?: string | null
          fab_mod?: string | null
          fipe_code?: string | null
          fipe_detail?: string | null
          fuel?: string | null
          id?: string
          model?: string | null
          owner_document?: string | null
          owner_name?: string | null
          pbt?: string | null
          plate: string
          power_cv?: string | null
          product_code?: string | null
          product_desc?: string | null
          renavam?: string | null
          seating?: string | null
          species?: string | null
          status?: string | null
          tank_liters?: number | null
          uf?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          axles?: string | null
          body_type?: string | null
          brand?: string | null
          capacity?: string | null
          category?: string | null
          chassis?: string | null
          cmt?: string | null
          color?: string | null
          created_at?: string
          displacement?: string | null
          dut_crv?: string | null
          engine?: string | null
          fab_mod?: string | null
          fipe_code?: string | null
          fipe_detail?: string | null
          fuel?: string | null
          id?: string
          model?: string | null
          owner_document?: string | null
          owner_name?: string | null
          pbt?: string | null
          plate?: string
          power_cv?: string | null
          product_code?: string | null
          product_desc?: string | null
          renavam?: string | null
          seating?: string | null
          species?: string | null
          status?: string | null
          tank_liters?: number | null
          uf?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
