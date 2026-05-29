import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not configured. Database operations will fail."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
