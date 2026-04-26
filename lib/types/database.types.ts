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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      counties: {
        Row: {
          disaster_declaration_date: string | null
          disaster_number: string | null
          drought_level: string | null
          fips_code: string
          id: string
          is_contiguous_disaster_area: boolean | null
          is_primary_disaster_area: boolean | null
          name: string
          precipitation_deficit_inches: number | null
          topsoil_moisture: string | null
          updated_at: string | null
        }
        Insert: {
          disaster_declaration_date?: string | null
          disaster_number?: string | null
          drought_level?: string | null
          fips_code: string
          id?: string
          is_contiguous_disaster_area?: boolean | null
          is_primary_disaster_area?: boolean | null
          name: string
          precipitation_deficit_inches?: number | null
          topsoil_moisture?: string | null
          updated_at?: string | null
        }
        Update: {
          disaster_declaration_date?: string | null
          disaster_number?: string | null
          drought_level?: string | null
          fips_code?: string
          id?: string
          is_contiguous_disaster_area?: boolean | null
          is_primary_disaster_area?: boolean | null
          name?: string
          precipitation_deficit_inches?: number | null
          topsoil_moisture?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deadline_alerts: {
        Row: {
          confirmed: boolean | null
          county_fips: string | null
          created_at: string | null
          crop_types: string[] | null
          email: string
          id: string
          program_ids: string[] | null
        }
        Insert: {
          confirmed?: boolean | null
          county_fips?: string | null
          created_at?: string | null
          crop_types?: string[] | null
          email: string
          id?: string
          program_ids?: string[] | null
        }
        Update: {
          confirmed?: boolean | null
          county_fips?: string | null
          created_at?: string | null
          crop_types?: string[] | null
          email?: string
          id?: string
          program_ids?: string[] | null
        }
        Relationships: []
      }
      eligibility_results: {
        Row: {
          created_at: string | null
          farmer_id: string | null
          id: string
          input_data: Json
          matched_programs: string[] | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          input_data: Json
          matched_programs?: string[] | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          input_data?: Json
          matched_programs?: string[] | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eligibility_results_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      farmers: {
        Row: {
          annual_sales_bracket: string | null
          auth_user_id: string | null
          county_fips: string | null
          created_at: string | null
          email: string | null
          farm_size_acres: number | null
          first_name: string | null
          has_experienced_loss: boolean | null
          id: string
          is_beginning_farmer: boolean | null
          is_young_farmer: boolean | null
          primary_crops: string[] | null
        }
        Insert: {
          annual_sales_bracket?: string | null
          auth_user_id?: string | null
          county_fips?: string | null
          created_at?: string | null
          email?: string | null
          farm_size_acres?: number | null
          first_name?: string | null
          has_experienced_loss?: boolean | null
          id?: string
          is_beginning_farmer?: boolean | null
          is_young_farmer?: boolean | null
          primary_crops?: string[] | null
        }
        Update: {
          annual_sales_bracket?: string | null
          auth_user_id?: string | null
          county_fips?: string | null
          created_at?: string | null
          email?: string | null
          farm_size_acres?: number | null
          first_name?: string | null
          has_experienced_loss?: boolean | null
          id?: string
          is_beginning_farmer?: boolean | null
          is_young_farmer?: boolean | null
          primary_crops?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "farmers_county_fips_fkey"
            columns: ["county_fips"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["fips_code"]
          },
        ]
      }
      programs: {
        Row: {
          acronym: string | null
          active: boolean | null
          agency: string
          apply_url: string | null
          category: string
          created_at: string | null
          deadline: string | null
          deadline_label: string | null
          description: string
          eligibility_rules: Json
          funding_amount: string | null
          how_to_apply: string | null
          id: string
          is_urgent: boolean | null
          learn_more_url: string | null
          name: string
          payment_type: string | null
          phone_number: string | null
          slug: string
          summary: string
          updated_at: string | null
        }
        Insert: {
          acronym?: string | null
          active?: boolean | null
          agency: string
          apply_url?: string | null
          category: string
          created_at?: string | null
          deadline?: string | null
          deadline_label?: string | null
          description: string
          eligibility_rules?: Json
          funding_amount?: string | null
          how_to_apply?: string | null
          id?: string
          is_urgent?: boolean | null
          learn_more_url?: string | null
          name: string
          payment_type?: string | null
          phone_number?: string | null
          slug: string
          summary: string
          updated_at?: string | null
        }
        Update: {
          acronym?: string | null
          active?: boolean | null
          agency?: string
          apply_url?: string | null
          category?: string
          created_at?: string | null
          deadline?: string | null
          deadline_label?: string | null
          description?: string
          eligibility_rules?: Json
          funding_amount?: string | null
          how_to_apply?: string | null
          id?: string
          is_urgent?: boolean | null
          learn_more_url?: string | null
          name?: string
          payment_type?: string | null
          phone_number?: string | null
          slug?: string
          summary?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          address: string | null
          county_fips: string | null
          created_at: string | null
          email: string | null
          hours: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          type: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          county_fips?: string | null
          created_at?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          type?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          county_fips?: string | null
          created_at?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          type?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_county_fips_fkey"
            columns: ["county_fips"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["fips_code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_programs: {
        Args: {
          p_annual_sales: string
          p_county_fips: string
          p_crop_types: string[]
          p_farm_size_acres: number
          p_has_experienced_loss: boolean
          p_is_beginning_farmer: boolean
          p_is_young_farmer: boolean
        }
        Returns: {
          match_score: number
          program_id: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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

