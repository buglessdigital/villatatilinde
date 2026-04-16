import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testCounts() {
    const { data: activeVillas } = await supabase
        .from('villas')
        .select('id')
        .eq('is_published', true);
        
    const publishedVillaIds = activeVillas.map(v => v.id);
    
    const { data: mappings } = await supabase
        .from('villa_categories')
        .select('category_id, villa_id')
        .in('villa_id', publishedVillaIds);

    const counts = {};
    mappings.forEach(m => {
        counts[m.category_id] = (counts[m.category_id] || 0) + 1;
    });

    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, villa_count')
        .eq('is_active', true);
        
    categories.forEach(c => {
        const actual = counts[c.id] || 0;
        console.log(`Category ${c.name}: DB says ${c.villa_count}, Actual published: ${actual}`);
    });
}
testCounts();
