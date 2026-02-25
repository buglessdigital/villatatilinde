/**
 * Eksik kayıtları bulan ve tekrar aktaran script
 */

import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
    readFileSync('./villatatilinde-firebase-adminsdk-fbsvc-3b692259cb.json', 'utf8')
);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const supabase = createClient(
    'https://ijdakzbhsxpsrnbqupiv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZGFremJoc3hwc3JuYnF1cGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYyMjQ5NiwiZXhwIjoyMDg3MTk4NDk2fQ.WiQvjF3FaniD9VT0xPqEi5bP79mlNzuFpYGURAOOpy0'
);

function sanitize(val) {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number' && !isFinite(val)) return null;
    if (val instanceof admin.firestore.Timestamp) return val.toDate().toISOString();
    if (Array.isArray(val)) return val.map(sanitize);
    if (typeof val === 'object' && val !== null) {
        const obj = {};
        for (const [k, v] of Object.entries(val)) {
            obj[k] = sanitize(v);
        }
        return obj;
    }
    return val;
}

// ─── Find missing user_requests ───
async function findMissingUserRequests() {
    console.log('\n═══ MISSING USER_REQUESTS ARAŞTIRMASI ═══');

    const snap = await db.collection('userRequests').get();
    console.log(`Firebase'de ${snap.size} doküman var`);

    // Get all request_refs from Supabase
    const allRefs = new Set();
    let offset = 0;
    const batchSize = 1000;
    while (true) {
        const { data, error } = await supabase
            .from('user_requests')
            .select('request_ref')
            .range(offset, offset + batchSize - 1);
        if (error) { console.error('Supabase hata:', error.message); break; }
        if (!data || data.length === 0) break;
        data.forEach(r => allRefs.add(r.request_ref));
        offset += batchSize;
    }
    console.log(`Supabase'de ${allRefs.size} kayıt var`);

    // Find missing
    const missing = [];
    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const requestRef = d.requestRef || doc.id;
        if (!allRefs.has(requestRef)) {
            missing.push({ doc, data: d, requestRef });
        }
    }

    console.log(`${missing.length} eksik kayıt bulundu`);

    // Log the first few missing to understand why
    for (const m of missing.slice(0, 5)) {
        console.log(`  Eksik: ${m.requestRef} (doc.id: ${m.doc.id})`);
    }

    return missing;
}

// ─── Find missing manual_references ───
async function findMissingManualReferences() {
    console.log('\n═══ MISSING MANUAL_REFERENCES ARAŞTIRMASI ═══');

    let firebaseTotal = 0;
    const allFirebaseRefs = [];

    for (const source of ['manualReferences', 'manualReferencesAdmin']) {
        const snap = await db.collection(source).get();
        console.log(`Firebase "${source}": ${snap.size} doküman`);
        firebaseTotal += snap.size;
        for (const doc of snap.docs) {
            const d = sanitize(doc.data());
            allFirebaseRefs.push({ ref: d.ref || doc.id, source, docId: doc.id });
        }
    }

    // Get all refs from Supabase
    const { data, error } = await supabase.from('manual_references').select('ref');
    if (error) { console.error('Supabase hata:', error.message); return []; }
    const supabaseRefs = new Set(data.map(r => r.ref));
    console.log(`Supabase'de ${supabaseRefs.size} kayıt var`);

    const missing = allFirebaseRefs.filter(r => !supabaseRefs.has(r.ref));
    console.log(`${missing.length} eksik kayıt bulundu`);
    for (const m of missing) {
        console.log(`  Eksik: ref="${m.ref}" (source: ${m.source}, doc.id: ${m.docId})`);
    }

    // Check for duplicate refs in Firebase
    const refCounts = {};
    for (const r of allFirebaseRefs) {
        refCounts[r.ref] = (refCounts[r.ref] || 0) + 1;
    }
    const duplicates = Object.entries(refCounts).filter(([, c]) => c > 1);
    if (duplicates.length > 0) {
        console.log(`\n  ⚠️  ${duplicates.length} adet duplicate ref bulundu (aynı ref birden fazla koleksiyonda):`);
        for (const [ref, count] of duplicates) {
            console.log(`    "${ref}" → ${count} kez`);
        }
        console.log(`  → Bu duplicate'ler upsert ile tek kayıt olarak yazılıyor, bu yüzden fark oluşuyor.`);
    }

    return missing;
}

// ─── Find missing user_details ───  
async function findMissingUserDetails() {
    console.log('\n═══ MISSING USER_DETAILS ARAŞTIRMASI ═══');

    let firebaseTotal = 0;
    const allFirebaseUids = [];

    for (const source of ['userdetails', 'uss']) {
        const snap = await db.collection(source).get();
        console.log(`Firebase "${source}": ${snap.size} doküman`);
        firebaseTotal += snap.size;
        for (const doc of snap.docs) {
            const d = sanitize(doc.data());
            allFirebaseUids.push({ uid: d.uid || doc.id, source, docId: doc.id });
        }
    }

    // Check for duplicates between two collections
    const uidCounts = {};
    for (const r of allFirebaseUids) {
        uidCounts[r.uid] = (uidCounts[r.uid] || 0) + 1;
    }
    const duplicates = Object.entries(uidCounts).filter(([, c]) => c > 1);
    if (duplicates.length > 0) {
        console.log(`\n  ⚠️  ${duplicates.length} adet duplicate uid bulundu (userdetails ve uss arasında):`);
        console.log(`  → Bu duplicate'ler upsert ile tek kayıt olarak yazılıyor, bu yüzden fark oluşuyor.`);
    }

    // Get count from Supabase
    const { count } = await supabase.from('user_details').select('*', { count: 'exact', head: true });
    console.log(`Supabase'de ${count} kayıt var`);
    console.log(`Firebase toplam: ${firebaseTotal}, Unique uid sayısı: ${Object.keys(uidCounts).length}`);
}

async function main() {
    console.log('🔍 Eksik kayıtları araştırıyoruz...\n');

    await findMissingUserRequests();
    await findMissingManualReferences();
    await findMissingUserDetails();

    process.exit(0);
}

main();
