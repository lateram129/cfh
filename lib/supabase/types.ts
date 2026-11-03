export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; role: string; avatar_url: string | null; created_at: string };
        Insert: { id: string; full_name?: string | null; role?: string; avatar_url?: string | null };
        Update: { full_name?: string | null; role?: string; avatar_url?: string | null };
        Relationships: [];
      };
      players: {
        Row: {
          id: string; full_name: string; nickname: string | null; birth_date: string; birth_place: string | null;
          height_cm: number | null; weight_kg: number | null; position: string; dominant_foot: string;
          current_club: string | null; address: string | null; phone: string | null; photo_url: string | null;
          video_url: string | null; stats: Json; status: string; submitted_by: string | null;
          approved_by: string | null; approved_at: string | null; rejection_reason: string | null; created_at: string;
        };
        Insert: {
          full_name: string; birth_date: string; position: string; nickname?: string | null;
          birth_place?: string | null; height_cm?: number | null; weight_kg?: number | null;
          dominant_foot?: string; current_club?: string | null; address?: string | null; phone?: string | null;
          photo_url?: string | null; video_url?: string | null; stats?: Json; submitted_by?: string | null;
        };
        Update: {
          status?: string; approved_by?: string | null; approved_at?: string | null;
          rejection_reason?: string | null; photo_url?: string | null; video_url?: string | null; stats?: Json;
        };
        Relationships: [];
      };
      tournaments: {
        Row: {
          id: string; name: string; season: string; start_date: string | null; end_date: string | null;
          format: string; status: string; logo_url: string | null; description: string | null;
          prize: string | null; created_at: string;
        };
        Insert: {
          name: string; season: string; start_date?: string | null; end_date?: string | null;
          format?: string; status?: string; logo_url?: string | null; description?: string | null; prize?: string | null;
        };
        Update: {
          name?: string; season?: string; status?: string; start_date?: string | null; end_date?: string | null;
          format?: string; logo_url?: string | null; description?: string | null; prize?: string | null;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string; name: string; logo_url: string | null; home_ground: string | null;
          founded_year: number | null; colors: string | null; description: string | null; created_at: string;
        };
        Insert: { name: string; logo_url?: string | null; home_ground?: string | null; founded_year?: number | null; colors?: string | null; description?: string | null };
        Update: { name?: string; logo_url?: string | null; home_ground?: string | null; founded_year?: number | null; colors?: string | null; description?: string | null };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string; tournament_id: string | null; home_team_id: string | null; away_team_id: string | null;
          match_date: string | null; venue: string | null; home_score: number; away_score: number;
          status: string; match_week: number | null; notes: string | null; created_at: string;
        };
        Insert: {
          tournament_id?: string | null; home_team_id?: string | null; away_team_id?: string | null;
          match_date?: string | null; venue?: string | null; home_score?: number; away_score?: number;
          status?: string; match_week?: number | null; notes?: string | null;
        };
        Update: { home_score?: number; away_score?: number; status?: string; match_date?: string | null; venue?: string | null; match_week?: number | null; notes?: string | null };
        Relationships: [];
      };
      goals: {
        Row: { id: string; match_id: string | null; player_id: string | null; team_id: string | null; minute: number | null; is_own_goal: boolean; is_penalty: boolean; created_at: string };
        Insert: { match_id?: string | null; player_id?: string | null; team_id?: string | null; minute?: number | null; is_own_goal?: boolean; is_penalty?: boolean };
        Update: { minute?: number | null; is_own_goal?: boolean; is_penalty?: boolean };
        Relationships: [];
      };
      trials: {
        Row: {
          id: string; title: string; club_name: string; description: string | null; requirements: string | null;
          positions: string[] | null; trial_date: string | null; location: string | null; contact: string | null;
          status: string; poster_url: string | null; age_min: number | null; age_max: number | null; created_at: string;
        };
        Insert: {
          title: string; club_name: string; description?: string | null; requirements?: string | null;
          positions?: string[] | null; trial_date?: string | null; location?: string | null;
          contact?: string | null; status?: string; poster_url?: string | null; age_min?: number | null; age_max?: number | null;
        };
        Update: { title?: string; club_name?: string; status?: string; trial_date?: string | null; description?: string | null; requirements?: string | null; positions?: string[] | null; location?: string | null; contact?: string | null };
        Relationships: [];
      };
      products: {
        Row: {
          id: string; name: string; description: string | null; price: number | null; image_url: string | null;
          category: string; seller_name: string | null; contact: string | null; whatsapp: string | null;
          is_available: boolean; created_at: string;
        };
        Insert: { name: string; description?: string | null; price?: number | null; image_url?: string | null; category?: string; seller_name?: string | null; contact?: string | null; whatsapp?: string | null; is_available?: boolean };
        Update: { name?: string; description?: string | null; price?: number | null; image_url?: string | null; category?: string; seller_name?: string | null; contact?: string | null; whatsapp?: string | null; is_available?: boolean };
        Relationships: [];
      };
    };
    Views: {
      // Both computed in schema.sql from `matches` / `goals` — read-only,
      // no Insert/Update: admin only ever edits matches and goals directly.
      standings: {
        Row: { id: string; tournament_id: string | null; team_id: string | null; played: number; won: number; drawn: number; lost: number; goals_for: number; goals_against: number; points: number };
        Relationships: [];
      };
      top_scorers: {
        Row: { player_id: string | null; full_name: string | null; current_club: string | null; position: string | null; goals: number };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Player = Database['public']['Tables']['players']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type Standing = Database['public']['Views']['standings']['Row'];
export type Trial = Database['public']['Tables']['trials']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];

export const POSITIONS: { value: string; label: string; labelId: string }[] = [
  { value: 'GK', label: 'Goalkeeper', labelId: 'Penjaga Gawang' },
  { value: 'CB', label: 'Center Back', labelId: 'Bek Tengah' },
  { value: 'LB', label: 'Left Back', labelId: 'Bek Kiri' },
  { value: 'RB', label: 'Right Back', labelId: 'Bek Kanan' },
  { value: 'CDM', label: 'Defensive Mid', labelId: 'Gelandang Bertahan' },
  { value: 'CM', label: 'Central Mid', labelId: 'Gelandang Tengah' },
  { value: 'CAM', label: 'Attacking Mid', labelId: 'Gelandang Serang' },
  { value: 'LW', label: 'Left Wing', labelId: 'Sayap Kiri' },
  { value: 'RW', label: 'Right Wing', labelId: 'Sayap Kanan' },
  { value: 'ST', label: 'Striker', labelId: 'Penyerang' },
];

export const CATEGORIES = [
  { value: 'merchandise', label: 'Merchandise', labelId: 'Merchandise' },
  { value: 'tiket', label: 'Ticket', labelId: 'Tiket' },
  { value: 'kuliner', label: 'Food & Beverage', labelId: 'Kuliner' },
  { value: 'jasa', label: 'Services', labelId: 'Jasa' },
];
