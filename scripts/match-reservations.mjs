import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://ijdakzbhsxpsrnbqupiv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZGFremJoc3hwc3JuYnF1cGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYyMjQ5NiwiZXhwIjoyMDg3MTk4NDk2fQ.WiQvjF3FaniD9VT0xPqEi5bP79mlNzuFpYGURAOOpy0'
);

async function main() {
    /* Tüm user_requests + admin_requests (status dolu olanlar) */
    const allRequests = [];
    let offset = 0;
    while (true) {
        const { data } = await supabase
            .from('user_requests')
            .select('request_ref, uid, renter_name, villa_slug, start_date, end_date, status, pre_paid')
            .neq('status', '')
            .range(offset, offset + 999);
        if (!data || data.length === 0) break;
        allRequests.push(...data.map(r => ({ ...r, source: 'user_req' })));
        offset += 1000;
    }

    const { data: adminData } = await supabase
        .from('admin_requests')
        .select('request_ref, uid, renter_name, villa_slug, start_date, end_date, status, pre_paid')
        .neq('status', '');
    if (adminData) allRequests.push(...adminData.map(r => ({ ...r, source: 'admin_req' })));

    console.log('Status dolu toplam request:', allRequests.length);

    /* Villa disabled_blocks */
    const { data: allVillas } = await supabase
        .from('villas')
        .select('slug, name, disabled_blocks');

    let totalBlocks = 0;
    const villaBlockMap = {};
    for (const v of allVillas || []) {
        const blocks = v.disabled_blocks || {};
        const blockKeys = Object.keys(blocks).map(Number);
        totalBlocks += blockKeys.length;
        villaBlockMap[v.slug] = { name: v.name, blockKeys, blocks };
    }
    console.log('Toplam disabled_blocks:', totalBlocks);

    /* Eşleştir: request.villa_slug + request.start_date === villa.slug + block key */
    const requestMatchKey = new Set();
    for (const req of allRequests) {
        requestMatchKey.add(req.villa_slug + ':' + req.start_date);
    }

    let blocksWithOwner = 0;
    let blocksWithoutOwner = 0;

    for (const [slug, villa] of Object.entries(villaBlockMap)) {
        for (const bk of villa.blockKeys) {
            if (requestMatchKey.has(slug + ':' + bk)) {
                blocksWithOwner++;
            } else {
                blocksWithoutOwner++;
            }
        }
    }

    console.log('\n=== SONUC ===');
    console.log('Toplam rezervasyon blogu:', totalBlocks);
    console.log('Sahibi bilinen (request eslesen):', blocksWithOwner);
    console.log('Sahibi bilinmeyen (eslesmeyen):', blocksWithoutOwner);
    console.log('Eslestirme orani:', (blocksWithOwner / totalBlocks * 100).toFixed(1) + '%');

    /* Manual references kontrolu */
    const { data: manualRefs } = await supabase
        .from('manual_references')
        .select('ref, name, surname, villa_slug, check_in, check_out');
    console.log('\nManual references:', (manualRefs || []).length);
    for (const m of manualRefs || []) {
        console.log('  ' + (m.name || '') + ' ' + (m.surname || '') + ' | villa: ' + (m.villa_slug || 'yok') + ' | ' + (m.check_in || '') + ' - ' + (m.check_out || ''));
    }

    /* Status='' ama villa_slug dolu olan user_requests ile de deneyelim */
    let offset2 = 0;
    const allRequestsIncEmpty = [];
    while (true) {
        const { data } = await supabase
            .from('user_requests')
            .select('request_ref, uid, renter_name, villa_slug, start_date, end_date, status')
            .neq('villa_slug', '')
            .gt('start_date', 0)
            .range(offset2, offset2 + 999);
        if (!data || data.length === 0) break;
        allRequestsIncEmpty.push(...data);
        offset2 += 1000;
    }
    console.log('\nTum user_requests (villa_slug + start_date dolu):', allRequestsIncEmpty.length);

    const allMatchKey2 = new Set();
    for (const req of allRequestsIncEmpty) {
        allMatchKey2.add(req.villa_slug + ':' + req.start_date);
    }

    let blocksMatched2 = 0;
    for (const [slug, villa] of Object.entries(villaBlockMap)) {
        for (const bk of villa.blockKeys) {
            if (allMatchKey2.has(slug + ':' + bk)) {
                blocksMatched2++;
            }
        }
    }
    console.log('Bu genis setle eslesen bloklar:', blocksMatched2, '/', totalBlocks);
    console.log('Eslestirme orani:', (blocksMatched2 / totalBlocks * 100).toFixed(1) + '%');
}

main();
