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
      budgets: {
        Row: {
          amount: number | null;
          created_at: string | null;
          id: number;
          name: string | null;
          remaining: number | null;
          user_id: string;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          remaining?: number | null;
          user_id: string;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          remaining?: number | null;
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
          budget_id: number | null;
          created_at: string | null;
          id: number;
          name: string | null;
          note: string | null;
          receiver_id: number | null;
          sender_id: number | null;
        };
        Insert: {
          amount?: number | null;
          budget_id?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          note?: string | null;
          receiver_id?: number | null;
          sender_id?: number | null;
        };
        Update: {
          amount?: number | null;
          budget_id?: number | null;
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
      add_transaction: {
        Args: {
          name?: string;
          sender?: number;
          receiver?: number;
          amount?: number;
          budget?: number;
          created_at?: string;
          note?: string;
        };
        Returns: number;
      };
      delete_transaction: {
        Args: {
          id: number;
        };
        Returns: number;
      };
      full_transaction: {
        Args: {
          sender: number;
          receiver: number;
          amount: number;
          note: string;
        };
        Returns: number;
      };
      get_transactions: {
        Args: {
          user_id: string;
        };
        Returns: {
          id: number;
          sender_id: number;
          receiver_id: number;
          name: string;
          amount: number;
          budget_id: number;
          note: string;
          created_at: string;
          sender_name: string;
          receiver_name: string;
          budget_name: string;
        }[];
      };
      get_transactions_by_account: {
        Args: {
          id: number;
        };
        Returns: number;
      };
      in_transaction: {
        Args: {
          receiver: number;
          amount: number;
          note: string;
        };
        Returns: number;
      };
      make_transaction:
        | {
            Args: {
              sender: number;
              receiver: number;
              amount: number;
            };
            Returns: number;
          }
        | {
            Args: {
              sender: number;
              receiver: number;
              amount: number;
              note: string;
            };
            Returns: number;
          };
      out_transaction: {
        Args: {
          sender: number;
          amount: number;
          note: string;
        };
        Returns: number;
      };
      update_budget: {
        Args: {
          id: number;
          name?: string;
          amount?: number;
        };
        Returns: number;
      };
      update_transaction: {
        Args: {
          id: number;
          name?: string;
          sender?: number;
          receiver?: number;
          amount?: number;
          budget?: number;
          created_at?: string;
          note?: string;
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
