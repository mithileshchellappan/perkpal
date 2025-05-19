import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey, 
  {
    auth: { 
      persistSession: false 
    }
  }
);

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase URL or Key is missing. Please check your environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  
  if (process.env.NODE_ENV === 'development') {
    console.error('\nTo fix this issue:');
    console.error('1. Create a .env.local file in the project root');
    console.error('2. Add the following lines with your Supabase credentials:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
    console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here');
    console.error('3. Restart the development server');
  }
}

// Helper function to format dates for Supabase
export function toISODate(date: Date): string {
  return date.toISOString();
}

// Helper for converting camelCase to snake_case
export function toSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = value;
  }
  
  return result;
}

// Helper for converting snake_case to camelCase
export function toCamelCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined or null values
    if (value === undefined || value === null) continue;
    
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  
  return result;
} 