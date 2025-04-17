export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chatbot: {
        Row: {
          created_at: string
          id: number
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      donated_meds: {
        Row: {
          date_added: string | null
          donor_entity_id: string
          expiry_date: string | null
          id: number
          image_url: string | null
          ingredients: string | null
          medicine_name: string | null
          ngo_entity_id: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          date_added?: string | null
          donor_entity_id: string
          expiry_date?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string | null
          medicine_name?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          date_added?: string | null
          donor_entity_id?: string
          expiry_date?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string | null
          medicine_name?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donated_meds_donor_entity_id_fkey"
            columns: ["donor_entity_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "donated_meds_ngo_entity_id_fkey"
            columns: ["ngo_entity_id"]
            isOneToOne: false
            referencedRelation: "intermediary_ngo"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string
          entity_id: string
          latitude: string | null
          longitude: string | null
          name: string
          org_name: string
          phone: string | null
        }
        Insert: {
          address: string
          entity_id: string
          latitude?: string | null
          longitude?: string | null
          name: string
          org_name: string
          phone?: string | null
        }
        Update: {
          address?: string
          entity_id?: string
          latitude?: string | null
          longitude?: string | null
          name?: string
          org_name?: string
          phone?: string | null
        }
        Relationships: []
      }
      intermediary_ngo: {
        Row: {
          address: string | null
          entity_id: string
          latitude: string | null
          longitude: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          entity_id: string
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          entity_id?: string
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          date: string
          donor_id: string
          message: string | null
          ngo_id: string
        }
        Insert: {
          created_at: string
          date: string
          donor_id: string
          message?: string | null
          ngo_id: string
        }
        Update: {
          created_at?: string
          date?: string
          donor_id?: string
          message?: string | null
          ngo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "messages_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "intermediary_ngo"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      recipients: {
        Row: {
          address: string | null
          entity_id: string
          latitude: string | null
          longitude: string | null
          name: string
          org_name: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          entity_id: string
          latitude?: string | null
          longitude?: string | null
          name: string
          org_name?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          entity_id?: string
          latitude?: string | null
          longitude?: string | null
          name?: string
          org_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      requested_meds: {
        Row: {
          id: string
          medicine_name: string | null
          need_by_date: string | null
          ngo_entity_id: string | null
          quantity: number | null
          recipient_entity_id: string
          status: string | null
        }
        Insert: {
          id?: string
          medicine_name?: string | null
          need_by_date?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          recipient_entity_id: string
          status?: string | null
        }
        Update: {
          id?: string
          medicine_name?: string | null
          need_by_date?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          recipient_entity_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requested_meds_ngo_entity_id_fkey"
            columns: ["ngo_entity_id"]
            isOneToOne: false
            referencedRelation: "intermediary_ngo"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "requested_meds_recipient_entity_id_fkey"
            columns: ["recipient_entity_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          entity_id: string
          entity_type: string
          id: number
          password: number | null
          verification: string | null
          verification_id: string
        }
        Insert: {
          created_at?: string
          email: string
          entity_id: string
          entity_type: string
          id?: number
          password?: number | null
          verification?: string | null
          verification_id: string
        }
        Update: {
          created_at?: string
          email?: string
          entity_id?: string
          entity_type?: string
          id?: number
          password?: number | null
          verification?: string | null
          verification_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
