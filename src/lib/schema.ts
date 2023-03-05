export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          balance: number | null;
          id: number;
          name: string | null;
          user_id: string;
        };
        Insert: {
          balance?: number | null;
          id?: number;
          name?: string | null;
          user_id: string;
        };
        Update: {
          balance?: number | null;
          id?: number;
          name?: string | null;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          last_name?: string | null;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
      };
      transactions: {
        Row: {
          amount: number | null;
          created_at: string | null;
          id: number;
          name: string | null;
          note: string | null;
          receiver_id: number | null;
          sender_id: number | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          note?: string | null;
          receiver_id?: number | null;
          sender_id?: number | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          note?: string | null;
          receiver_id?: number | null;
          sender_id?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_transactions: {
        Args: {
          user_id: string;
        };
        Returns: {
          amount: number | null;
          created_at: string | null;
          id: number;
          name: string | null;
          note: string | null;
          receiver_id: number | null;
          sender_id: number | null;
        }[];
      };
      make_transaction: {
        Args: {
          sender: number;
          receiver: number;
          amount: number;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
