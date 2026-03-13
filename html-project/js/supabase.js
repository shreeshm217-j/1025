import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://laktnblzvescvmnewmxp.supabase.co";
const supabaseKey = "sb_publishable__wZSQrDfV-7l7nSoHR-WrA_FFFWNUM6";

export const supabase = createClient(supabaseUrl, supabaseKey);
