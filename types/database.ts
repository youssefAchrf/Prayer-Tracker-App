export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          can_view_prayers: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          can_view_prayers?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
          can_view_prayers?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      prayers: {
        Row: {
          id: string;
          user_id: string;
          prayer_name: string;
          prayer_date: string;
          status: 'jamaah' | 'alone' | 'late' | 'missed' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prayer_name: string;
          prayer_date: string;
          status?: 'jamaah' | 'alone' | 'late' | 'missed' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prayer_name?: string;
          prayer_date?: string;
          status?: 'jamaah' | 'alone' | 'late' | 'missed' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}