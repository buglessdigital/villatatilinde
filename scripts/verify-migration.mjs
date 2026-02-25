/**
 * Firebase ↔ Supabase Veri Doğrulama Script'i
 * 
 * Firebase ve Supabase'deki kayıt sayılarını karşılaştırır.
 */

import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ─── Firebase Setup ───
const serviceAccount = JSON.parse(
    readFileSync('./villatatilinde-firebase-adminsdk-fbsvc-3b692259cb.json', 'utf8')
);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ─── Supabase Setup ───
const supabase = createClient(
    'https://ijdakzbhsxpsrnbqupiv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZGFremJoc3hwc3JuYnF1cGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYyMjQ5NiwiZXhwIjoyMDg3MTk4NDk2fQ.WiQvjF3FaniD9VT0xPqEi5bP79mlNzuFpYGURAOOpy0'
);

async function getFirebaseCount(collectionName) {
    const snap = await db.collection(collectionName).get();
    return snap.size;
}

async function getSupabaseCount(tableName) {
    const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
    if (error) {
        console.error(`   Supabase "${tableName}" hata:`, error.message);
        return -1;
    }
    return count;
}

async function main() {
    console.log('🔍 Firebase ↔ Supabase veri doğrulama başlıyor...\n');

    const checks = [
        { firebase: ['activeVillas', 'inactiveVillas'], supabase: 'villas', label: 'Villas' },
        { firebase: ['activeBlogs'], supabase: 'blogs', label: 'Blogs' },
        { firebase: ['activeFaqs'], supabase: 'faqs', label: 'FAQs' },
        { firebase: ['activeQuestions'], supabase: 'questions', label: 'Questions' },
        { firebase: ['adminRequests'], supabase: 'admin_requests', label: 'Admin Requests' },
        { firebase: ['userRequests'], supabase: 'user_requests', label: 'User Requests' },
        { firebase: ['manualReferences', 'manualReferencesAdmin'], supabase: 'manual_references', label: 'Manual References' },
        { firebase: ['policies'], supabase: 'policies', label: 'Policies' },
        { firebase: ['successfullPayments'], supabase: 'successful_payments', label: 'Successful Payments' },
        { firebase: ['successfullPaymentsManual'], supabase: 'successful_payments_manual', label: 'Successful Payments Manual' },
        { firebase: ['userQuestions'], supabase: 'user_questions', label: 'User Questions' },
        { firebase: ['userdetails', 'uss'], supabase: 'user_details', label: 'User Details' },
    ];

    let allOk = true;
    const results = [];

    for (const check of checks) {
        let firebaseTotal = 0;
        for (const col of check.firebase) {
            const count = await getFirebaseCount(col);
            firebaseTotal += count;
        }

        const supabaseCount = await getSupabaseCount(check.supabase);

        const match = supabaseCount >= firebaseTotal;
        const icon = match ? '✅' : '❌';
        if (!match) allOk = false;

        results.push({
            label: check.label,
            firebase: firebaseTotal,
            supabase: supabaseCount,
            match,
            icon
        });

        console.log(`${icon} ${check.label.padEnd(30)} Firebase: ${String(firebaseTotal).padStart(6)} | Supabase: ${String(supabaseCount).padStart(6)} ${match ? '' : ' ← EKSİK!'}`);
    }

    // Numbers tablosu özel - Firebase'de tek doküman, her key ayrı satır
    const numbersSnap = await db.collection('numbers').get();
    let firebaseNumberKeys = 0;
    for (const doc of numbersSnap.docs) {
        firebaseNumberKeys += Object.keys(doc.data()).length;
    }
    const supabaseNumbersCount = await getSupabaseCount('numbers');
    const numbersMatch = supabaseNumbersCount >= firebaseNumberKeys;
    console.log(`${numbersMatch ? '✅' : '❌'} ${'Numbers'.padEnd(30)} Firebase: ${String(firebaseNumberKeys).padStart(6)} | Supabase: ${String(supabaseNumbersCount).padStart(6)} ${numbersMatch ? '' : ' ← EKSİK!'}`);
    if (!numbersMatch) allOk = false;

    console.log('\n' + '═'.repeat(70));
    if (allOk) {
        console.log('✅✅✅ TÜM VERİLER DOĞRULANDI - EKSİK VERİ YOK! ✅✅✅');
    } else {
        console.log('⚠️  BAZI TABLOLARDA EKSİK VERİ TESPİT EDİLDİ!');
    }

    process.exit(0);
}

main();
