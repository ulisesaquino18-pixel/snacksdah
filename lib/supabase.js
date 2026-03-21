import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Load a data key from Supabase
export async function loadData(key) {
  const { data, error } = await supabase
    .from('dashboard_data')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error || !data) return null;
  return data.value;
}

// Save a data key to Supabase
export async function saveData(key, value) {
  const { error } = await supabase
    .from('dashboard_data')
    .upsert({ key, value }, { onConflict: 'key' });
  
  if (error) console.error('Save error:', key, error);
  return !error;
}

// Reset all data keys
export async function resetAllData(defaults) {
  const promises = Object.entries(defaults).map(([key, value]) =>
    supabase.from('dashboard_data').upsert({ key, value }, { onConflict: 'key' })
  );
  await Promise.all(promises);
}
