const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function dump() {
  const { data } = await supabase.from('banners').select('slug, subtitle, description, button_text');
  console.log(JSON.stringify(data, null, 2));
}
dump();
