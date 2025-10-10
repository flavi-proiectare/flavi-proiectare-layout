import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dshxokjzdbclcxtqyiqa.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzaHhva2p6ZGJjbGN4dHF5aXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDY3MzgsImV4cCI6MjA3NTYyMjczOH0.P7K51PcHug2N5Hzbdli2Eba7lQjN6eGFHrLt4rWNUbA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
