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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          client_type: Database["public"]["Enums"]["client_type"]
          company_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          phone: string
          state: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_type?: Database["public"]["Enums"]["client_type"]
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          phone: string
          state: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_type?: Database["public"]["Enums"]["client_type"]
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          phone?: string
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      farms: {
        Row: {
          client_id: string
          created_at: string
          crop_type: string | null
          farm_name: string
          id: string
          location_description: string | null
          total_area_ha: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          crop_type?: string | null
          farm_name: string
          id?: string
          location_description?: string | null
          total_area_ha: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          crop_type?: string | null
          farm_name?: string
          id?: string
          location_description?: string | null
          total_area_ha?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          area_ha: number
          created_at: string
          farm_id: string
          field_name: string
          id: string
          updated_at: string
        }
        Insert: {
          area_ha: number
          created_at?: string
          farm_id: string
          field_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          area_ha?: number
          created_at?: string
          farm_id?: string
          field_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fields_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      gis_outputs: {
        Row: {
          created_at: string
          field_id: string
          file_url: string
          id: string
          map_type: Database["public"]["Enums"]["map_type"]
          season: string | null
        }
        Insert: {
          created_at?: string
          field_id: string
          file_url: string
          id?: string
          map_type: Database["public"]["Enums"]["map_type"]
          season?: string | null
        }
        Update: {
          created_at?: string
          field_id?: string
          file_url?: string
          id?: string
          map_type?: Database["public"]["Enums"]["map_type"]
          season?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gis_outputs_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          company_name: string | null
          created_at: string
          crop_type: string | null
          email: string
          farm_size_ha: number | null
          id: string
          message: string | null
          name: string
          phone: string
          state: string
          status: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          crop_type?: string | null
          email: string
          farm_size_ha?: number | null
          id?: string
          message?: string | null
          name: string
          phone: string
          state: string
          status?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          crop_type?: string | null
          email?: string
          farm_size_ha?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          state?: string
          status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          area_covered_ha: number | null
          client_id: string
          cost: number | null
          created_at: string
          id: string
          service_type: string
          status: Database["public"]["Enums"]["service_status"]
          updated_at: string
        }
        Insert: {
          area_covered_ha?: number | null
          client_id: string
          cost?: number | null
          created_at?: string
          id?: string
          service_type: string
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
        }
        Update: {
          area_covered_ha?: number | null
          client_id?: string
          cost?: number | null
          created_at?: string
          id?: string
          service_type?: string
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_samples: {
        Row: {
          created_at: string
          field_id: string
          id: string
          lab_name: string | null
          nitrogen: number | null
          organic_matter: number | null
          ph: number | null
          phosphorus: number | null
          potassium: number | null
          sampling_date: string
        }
        Insert: {
          created_at?: string
          field_id: string
          id?: string
          lab_name?: string | null
          nitrogen?: number | null
          organic_matter?: number | null
          ph?: number | null
          phosphorus?: number | null
          potassium?: number | null
          sampling_date: string
        }
        Update: {
          created_at?: string
          field_id?: string
          id?: string
          lab_name?: string | null
          nitrogen?: number | null
          organic_matter?: number | null
          ph?: number | null
          phosphorus?: number | null
          potassium?: number | null
          sampling_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "soil_samples_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          client_id: string
          created_at: string
          end_date: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
        }
        Insert: {
          client_id: string
          created_at?: string
          end_date: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Update: {
          client_id?: string
          created_at?: string
          end_date?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_client_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
      client_type: "Farmer" | "FertilizerCompany" | "Dealer"
      map_type: "N" | "P" | "K" | "pH" | "VRA"
      service_status: "Pending" | "InProgress" | "Completed"
      subscription_plan: "Basic" | "Pro" | "Enterprise"
      subscription_status: "Active" | "Expired"
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
    Enums: {
      app_role: ["admin", "client"],
      client_type: ["Farmer", "FertilizerCompany", "Dealer"],
      map_type: ["N", "P", "K", "pH", "VRA"],
      service_status: ["Pending", "InProgress", "Completed"],
      subscription_plan: ["Basic", "Pro", "Enterprise"],
      subscription_status: ["Active", "Expired"],
    },
  },
} as const
