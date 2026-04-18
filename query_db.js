require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: destinations } = await supabase.from('destinations').select('id, name, filter_param');
  console.log('DESTINATIONS:', destinations.slice(0, 10)); // just print some or all
  
  const { data: villas } = await supabase.from('villas').select('id, name, location_label, destination_id').ilike('location_label', '%kordere%');
  console.log('VILLAS KORDERE:', villas);
  
  const { data: villas2 } = await supabase.from('villas').select('id, name, location_label, destination_id').ilike('location_label', '%kördere%');
  console.log('VILLAS KÖRDERE:', villas2);
}
main();
