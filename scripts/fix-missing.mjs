/**
 * Eksik kayıtları tekrar aktaran script
 * Sadece user_requests ve user_details tabloları
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

// ─── Fix missing user_requests ───
async function fixUserRequests() {
    console.log('\n═══ USER_REQUESTS EKSİK KAYITLARI TAMAMLANIYOR ═══');

    const snap = await db.collection('userRequests').get();
    console.log(`Firebase'de ${snap.size} doküman var`);

    // Get all existing request_refs from Supabase
    const allRefs = new Set();
    let offset = 0;
    while (true) {
        const { data, error } = await supabase
            .from('user_requests')
            .select('request_ref')
            .range(offset, offset + 999);
        if (error) { console.error('Hata:', error.message); break; }
        if (!data || data.length === 0) break;
        data.forEach(r => allRefs.add(r.request_ref));
        offset += 1000;
    }
    console.log(`Supabase'de ${allRefs.size} kayıt var`);

    let added = 0;
    let errors = 0;

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const requestRef = d.requestRef || doc.id;

        if (allRefs.has(requestRef)) continue; // zaten var

        const row = {
            request_ref: requestRef,
            uid: d.uid || '',
            status: d.status || '',
            status2: d.status2 || '',
            is_active: d.isActive || false,
            admin_acted: d.adminActed || false,
            admin_read: d.adminRead || false,
            allowed_by_admin: d.allowedByAdmin || false,
            approve_date: d.approveDate || '',
            disapprove_date: d.disapproveDate || '',
            unread: d.unread || false,
            unread_by_admin: d.unreadByAdmin || false,
            unread_by_user: d.unreadByUser || false,
            chat: d.chat || false,
            reviewed: d.reviewed || false,
            villa_name: d.villaName || '',
            villa_slug: d.villaSlug || '',
            cover_image: d.coverImage || '',
            renter_name: d.renterName || '',
            renter_email: d.renterEmail || '',
            renter_phone_code: d.renterPhoneCode || '',
            renter_phone_number: d.renterPhoneNumber || '',
            renter_tc_passport: d.renterTCPassport || '',
            renter_address: d.renterAddress || '',
            renter_code_full: d.renterCodeFull || null,
            guest2_name: d.guest2Name || '',
            guest3_name: d.guest3Name || '',
            guest4_name: d.guest4Name || '',
            guest5_name: d.guest5Name || '',
            guest6_name: d.guest6Name || '',
            guest7_name: d.guest7Name || '',
            guest8_name: d.guest8Name || '',
            guest9_name: d.guest9Name || '',
            guest10_name: d.guest10Name || '',
            guest11_name: d.guest11Name || '',
            guest12_name: d.guest12Name || '',
            start_date: d.startDate || 0,
            end_date: d.endDate || 0,
            check_in: d.checkIn || '',
            check_out: d.checkOut || '',
            first_d: d.firstD || '',
            first_d_tr: d.firstDTr || '',
            second_d: d.secondD || '',
            second_d_tr: d.secondDTr || '',
            nights: d.nights || 1,
            total_guests: d.totalGuests || 1,
            deposit: d.deposit || 0,
            cleaning: d.cleaning || 0,
            discount: d.discount || 0,
            before_discount: d.beforeDiscount || 0,
            after_discount: d.afterDiscount || 0,
            pre_payment: d.prePayment || 0,
            rest_payment: d.restPayment || 0,
            pre_paid: d.prePaid || false,
            pre_paid_via: d.prePaidVia || '',
            rest_paid: d.restPaid || false,
            offered_discount: d.offeredDiscount || 0,
            currency: d.currency || '',
            currency_symbol: d.currencySymbol || '',
            payment_link: d.paymentLink || '',
            payment_iban: d.paymentIban || '',
            payment_iban_bank: d.paymentIbanBank || '',
            payment_iban_bank_number: d.paymentIbanBankNumber || '',
            payment_iban_name: d.paymentIbanName || '',
            will_pay_via: d.willPayVia || '',
            pre_selected_pre_payment_method: d.preSelectedPrePaymentMethod || '',
            asked_for_bank: d.askedForBank || false,
            asked_for_card: d.askedForCard || false,
            requested_eft_info: d.requestedEftInfo || false,
            requested_payment_link: d.requestedPaymentLink || false,
            starts_waiting_payment: d.startedWaitingPayment || '',
            ends_waiting_payment: d.endsWaitingPayment || '',
            promotion: d.promotion || false,
            promotion_used: d.promotionUsed || false,
            promotion_used_on: d.promotionUsedOn || '',
            promotion_accepted_by: d.promotionAcceptedBy || '',
            promotion_usage_date: d.promotionUsageDate || 0,
            reason: d.reason || '',
            messages: d.messages || [],
            notifications: d.notifications || [],
            user_name: d.userName || '',
            user_email: d.userEmail || '',
            user_image: d.userImage || '',
            user_phone_code: d.userPhoneCode || '',
            user_phone_number: d.userPhoneNumber || '',
            user_phone_number_full: d.userPhoneNumberFull || '',
            user_code_full: d.userCodeFull || '',
            uid_phone_number: d.uidPhoneNumber || '',
            basket_id: d.basketId || '',
            conversation_id: d.conversationId || '',
            payment_id: d.paymentId || '',
            last4: d.last4 || '',
            fail_mail_awaiting: d.failMailAwaiting || false,
            success_mail_awaiting: d.successMailAwaiting || false,
            creation_date: d.creationDate || null,
            update_date: d.updateDate || null,
            update_date_readable: d.updateDateReadable || '',
            date_st_admin: d.dateStAdmin || 0,
            date_st_user: d.dateStUser || 0,
            allow_start_date: d.allowStartDate || 0,
            allow_end_date: d.allowEndDate || 0,
        };

        const { error } = await supabase.from('user_requests').upsert(row, { onConflict: 'request_ref' });
        if (error) {
            console.error(`   ❌ ${doc.id} hata:`, error.message);
            errors++;
        } else {
            console.log(`   ✅ ${doc.id}`);
            added++;
        }
    }

    console.log(`\n📊 ${added} kayıt eklendi, ${errors} hata`);
}

// ─── Fix missing user_details ───
async function fixUserDetails() {
    console.log('\n═══ USER_DETAILS EKSİK KAYITLARI TAMAMLANIYOR ═══');

    // Get all existing uids from Supabase
    const allUids = new Set();
    let offset = 0;
    while (true) {
        const { data, error } = await supabase
            .from('user_details')
            .select('uid')
            .range(offset, offset + 999);
        if (error) { console.error('Hata:', error.message); break; }
        if (!data || data.length === 0) break;
        data.forEach(r => allUids.add(r.uid));
        offset += 1000;
    }
    console.log(`Supabase'de ${allUids.size} kayıt var`);

    let added = 0;
    let errors = 0;

    for (const source of ['userdetails', 'uss']) {
        const snap = await db.collection(source).get();
        console.log(`Firebase "${source}": ${snap.size} doküman`);

        for (const doc of snap.docs) {
            const d = sanitize(doc.data());
            const uid = d.uid || doc.id;

            if (allUids.has(uid)) continue;

            const row = {
                uid: uid,
                name: d.name || '',
                surname: d.surname || '',
                email: d.email || '',
                email_verified: d.emailVerified || false,
                phone_code: d.phoneCode || '',
                phone_number: d.phoneNumber || '',
                full_phone_number: d.fullPhoneNumber || '',
                tc: d.tc || '',
                passport_number: d.passportNumber || '',
                image: d.image || '',
                language: d.language || 'tr',
                currency: d.currency || 'try',
                currency_symbol: d.currencySymbol || '₺',
                code_full: d.codeFull || null,
                is_anonymous: d.isAnonymous ?? true,
                cookies_all: d.cookiesAll || false,
                cookies_some: d.cookiesSome || false,
                subscription: d.subscription || false,
                some_subscription: d.someSubscription || false,
                subscription_date: d.subscriptionDate || 0,
                subscription_date_readable: d.subscriptionDateReadable || '0',
                sub_class1: d.subClass1 || false,
                sub_class2: d.subClass2 || false,
                sub_class3: d.subClass3 || false,
                sub_class4: d.subClass4 || false,
                no_sub: d.noSub || false,
                status: d.status || '',
                cart: d.cart || [],
                halfs: d.halfs || [],
                last_half: d.lastHalf || {},
                last_visited: d.lastVisited || [],
                past_req: d.pastReq || [],
                wishes: d.wishes || [],
                used_qrs: d.usedQrs || [],
                notifications: d.notifications || {},
                the_chat_ref: d.theChatRef || '',
                the_promotion_ref: d.thePromotionRef || '',
                reviews: d.reviews || {},
            };

            const { error } = await supabase.from('user_details').upsert(row, { onConflict: 'uid' });
            if (error) {
                console.error(`   ❌ ${doc.id} hata:`, error.message);
                errors++;
            } else {
                console.log(`   ✅ ${doc.id} (${source})`);
                added++;
                allUids.add(uid); // avoid re-inserting
            }
        }
    }

    console.log(`\n📊 ${added} kayıt eklendi, ${errors} hata`);
}

async function main() {
    console.log('🔧 Eksik kayıtlar tamamlanıyor...\n');

    await fixUserRequests();
    await fixUserDetails();

    console.log('\n\n✅ Tamamlama işlemi bitti!');
    process.exit(0);
}

main();
