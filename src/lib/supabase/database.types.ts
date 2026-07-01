/**
 * Supabase database types.
 *
 * This file mirrors the SQL migrations in `supabase/migrations`. After the
 * first apply it can be regenerated exactly with:
 *
 *   npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
 *   # or --project-id <ref> for a linked cloud project
 *
 * Keep it in sync with the migrations until codegen takes over.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          currency: string;
          timezone: string;
          theme: string;
          working_hours_per_day: number;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          timezone?: string;
          theme?: string;
          working_hours_per_day?: number;
          onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          timezone?: string;
          theme?: string;
          working_hours_per_day?: number;
          onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: Database["public"]["Enums"]["project_status"];
          priority: Database["public"]["Enums"]["priority"];
          deadline: string | null;
          progress: number;
          color: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          priority?: Database["public"]["Enums"]["priority"];
          deadline?: string | null;
          progress?: number;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          priority?: Database["public"]["Enums"]["priority"];
          deadline?: string | null;
          progress?: number;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          status: Database["public"]["Enums"]["task_status"];
          priority: Database["public"]["Enums"]["priority"];
          work_date: string;
          due_date: string | null;
          estimated_hours: number | null;
          labels: string[];
          project_task_id: string | null;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          priority?: Database["public"]["Enums"]["priority"];
          work_date?: string;
          due_date?: string | null;
          estimated_hours?: number | null;
          labels?: string[];
          project_task_id?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          priority?: Database["public"]["Enums"]["priority"];
          work_date?: string;
          due_date?: string | null;
          estimated_hours?: number | null;
          labels?: string[];
          project_task_id?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_task_id_fkey";
            columns: ["project_task_id"];
            isOneToOne: false;
            referencedRelation: "project_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      project_tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          milestone_id: string | null;
          title: string;
          description: string | null;
          status: Database["public"]["Enums"]["task_status"];
          priority: Database["public"]["Enums"]["priority"];
          due_date: string | null;
          estimated_hours: number | null;
          sort_order: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          milestone_id?: string | null;
          title: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          priority?: Database["public"]["Enums"]["priority"];
          due_date?: string | null;
          estimated_hours?: number | null;
          sort_order?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          milestone_id?: string | null;
          title?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          priority?: Database["public"]["Enums"]["priority"];
          due_date?: string | null;
          estimated_hours?: number | null;
          sort_order?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tasks_milestone_id_fkey";
            columns: ["milestone_id"];
            isOneToOne: false;
            referencedRelation: "milestones";
            referencedColumns: ["id"];
          },
        ];
      };
      milestones: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          name: string;
          description: string | null;
          due_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          name: string;
          description?: string | null;
          due_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          due_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "milestones_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "milestones_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      time_logs: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          task_id: string | null;
          project_task_id: string | null;
          description: string | null;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          task_id?: string | null;
          project_task_id?: string | null;
          description?: string | null;
          started_at?: string;
          ended_at?: string | null;
          duration_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          task_id?: string | null;
          project_task_id?: string | null;
          description?: string | null;
          started_at?: string;
          ended_at?: string | null;
          duration_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "time_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_logs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_logs_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_logs_project_task_id_fkey";
            columns: ["project_task_id"];
            isOneToOne: false;
            referencedRelation: "project_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          type: Database["public"]["Enums"]["goal_type"];
          status: Database["public"]["Enums"]["goal_status"];
          target: number;
          current: number;
          unit: string | null;
          completion_percentage: number;
          start_date: string | null;
          deadline: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          description?: string | null;
          type: Database["public"]["Enums"]["goal_type"];
          status?: Database["public"]["Enums"]["goal_status"];
          target: number;
          current?: number;
          unit?: string | null;
          start_date?: string | null;
          deadline?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          description?: string | null;
          type?: Database["public"]["Enums"]["goal_type"];
          status?: Database["public"]["Enums"]["goal_status"];
          target?: number;
          current?: number;
          unit?: string | null;
          start_date?: string | null;
          deadline?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goals_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      earnings: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          amount: number;
          currency: string;
          source: string | null;
          category: Database["public"]["Enums"]["earning_category"];
          earned_on: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          amount: number;
          currency?: string;
          source?: string | null;
          category?: Database["public"]["Enums"]["earning_category"];
          earned_on?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          amount?: number;
          currency?: string;
          source?: string | null;
          category?: Database["public"]["Enums"]["earning_category"];
          earned_on?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "earnings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "earnings_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          content: string;
          is_pinned: boolean;
          is_archived: boolean;
          search_vector: unknown | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title?: string;
          content?: string;
          is_pinned?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          content?: string;
          is_pinned?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status:
        "planning" | "active" | "paused" | "completed" | "archived";
      task_status:
        | "todo"
        | "in_progress"
        | "blocked"
        | "review"
        | "completed"
        | "cancelled";
      priority: "low" | "medium" | "high" | "urgent";
      goal_type: "daily" | "weekly" | "monthly" | "yearly";
      goal_status: "active" | "completed" | "archived";
      earning_category: "freelancing" | "etsy" | "affiliate" | "ads" | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
