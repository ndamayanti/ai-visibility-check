import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: SupabaseClient | null = null;

// Lazy initialization - only create client when credentials are available
function getSupabaseClient(): SupabaseClient | null {
  if (supabase) {
    return supabase;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase credentials not configured. Database operations will fail."
    );
    return null;
  }

  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}

// Export getter function instead of direct instance
export const getSupabase = (): SupabaseClient | null => getSupabaseClient();

export interface Lead {
  id?: string;
  name: string;
  email: string;
  business_name: string;
  website_url: string;
  keyword: string;
  industry: string;
  created_at?: string;
}

export interface ScanResultDB {
  id?: string;
  lead_id: string;
  overall_score: number;
  ai_presence_score: number;
  site_readiness_score: number;
  content_authority_score: number;
  ai_presence_data: any;
  site_readiness_data: any;
  content_authority_data: any;
  findings: any;
  quick_wins: any;
  competitors_found: any;
  created_at?: string;
}

// Create or update a lead
export async function saveLead(lead: Lead): Promise<Lead | null> {
  try {
    const client = getSupabase();
    if (!client) {
      console.warn("Supabase not available, skipping lead save");
      return null;
    }

    const { data, error } = await client
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving lead:", error);
    return null;
  }
}

// Get lead by email
export async function getLeadByEmail(email: string): Promise<Lead | null> {
  try {
    const client = getSupabase();
    if (!client) {
      console.warn("Supabase not available, skipping lead fetch");
      return null;
    }

    const { data, error } = await client
      .from("leads")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (error) {
    console.error("Error fetching lead:", error);
    return null;
  }
}

// Save scan result
export async function saveScanResult(
  result: ScanResultDB
): Promise<ScanResultDB | null> {
  try {
    const client = getSupabase();
    if (!client) {
      console.warn("Supabase not available, skipping scan result save");
      return null;
    }

    const { data, error } = await client
      .from("scan_results")
      .insert([result])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving scan result:", error);
    return null;
  }
}

// Get scan result by ID
export async function getScanResult(scanId: string): Promise<ScanResultDB | null> {
  try {
    const client = getSupabase();
    if (!client) {
      console.warn("Supabase not available, skipping scan result fetch");
      return null;
    }

    const { data, error } = await client
      .from("scan_results")
      .select("*")
      .eq("id", scanId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (error) {
    console.error("Error fetching scan result:", error);
    return null;
  }
}
