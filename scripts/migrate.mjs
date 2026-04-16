/**
 * Firebase → Supabase Veri Taşıma Script'i
 * 
 * Bu script Firebase'den verileri SADECE OKUR ve Supabase'e yazar.
 * Firebase'de hiçbir değişiklik yapmaz.
 * 
 * Kullanım: node scripts/migrate.mjs
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

// ─── Helpers ───
function sanitize(val) {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number' && !isFinite(val)) return null; // -Infinity, Infinity, NaN → null
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

function camelToSnake(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

async function getCollection(name) {
    console.log(`📖 Firebase'den "${name}" okunuyor...`);
    const snap = await db.collection(name).get();
    console.log(`   → ${snap.size} doküman bulundu`);
    return snap;
}

// ─── Migration Functions ───

async function migrateVillas() {
    console.log('\n═══ VILLAS ═══');

    for (const source of ['activeVillas', 'inactiveVillas']) {
        const snap = await getCollection(source);
        const isActive = source === 'activeVillas';

        for (const doc of snap.docs) {
            const d = sanitize(doc.data());
            const row = {
                slug: d.slug || doc.id,
                name: d.name || '',
                ref_code: d.refCode || '',
                address: d.address || '',
                location: d.location || '',
                location2: d.location2 || '',
                location3: d.location3 || '',
                guests: d.guests || '',
                bedrooms: d.bedrooms || '',
                beds: d.beds || '',
                baths: d.baths || '',
                rooms: typeof d.rooms === 'number' ? d.rooms : 1,
                p_width: d.pWidth || '',
                p_length: d.pLength || '',
                p_depth: d.pDepth || '',
                p_shared: d.pShared || false,
                pool_fence: d.poolFence || false,
                currency: d.currency || 'try',
                currency_symbol: d.currencySymbol || '₺',
                min_ever: d.minEver || 0,
                max_ever: d.maxEver || 0,
                fallback_price: d.fallbackPrice || 0,
                cover_image: d.coverImage || '',
                image_small: d.imageSmall || '',
                images: d.images || [],
                images3: d.images3 || [],
                image10: d.image10 || [],
                video: d.video || [],
                video_poster: d.videoPoster || '',
                video_real_width: d.videoRealWidth || 0,
                video_real_height: d.videoRealHeight || 0,
                description: d.description || '',
                description_en: d.descriptionEn || '',
                description_detail: d.descriptionDetail || '',
                description_detail_en: d.descriptionDetailEn || '',
                description_html_content: d.descriptionHtmlContent || '',
                summary: d.summary || '',
                summary_en: d.summaryEn || '',
                vt_sum: d.vtSum || '',
                vt_sum_en: d.vtSumEn || '',
                page_title: d.pageTitle || '',
                page_description: d.pageDescription || '',
                category: d.category || [],
                features: d.features || [],
                to_beach: d.toBeach || '',
                to_restaurant: d.toRestaurant || '',
                to_shop: d.toShop || '',
                to_centre: d.toCentre || '',
                to_hospital: d.toHospital || '',
                saglik_ocagi: d.saglikOcagi || '',
                to_airport: d.toAirport || '',
                to_bus: d.toBus || '',
                deposit: d.deposit || '',
                cleaning: d.cleaning || '',
                comission: typeof d.comission === 'number' ? String(d.comission) : (d.comission || ''),
                min_res: d.minRes || '',
                min_res_cleaning: d.minResCleaning || '',
                min_res_winter: d.minResWinter || 1,
                check_in: d.checkIn || '16:00',
                check_out: d.checkOut || '10:00',
                belge_no: d.belgeNo || '',
                pet: d.pet ?? true,
                smoke: d.smoke ?? true,
                party: d.party ?? true,
                sound: d.sound ?? true,
                carbon_alarm: d.carbonAlarm || false,
                self_check_in: d.selfCheckIn || false,
                map_iframe: d.mapIframe || '',
                map_iframe_orig: d.mapIframeOrig || '',
                position_lat: d.position?.lat || null,
                position_lng: d.position?.lng || null,
                price_blocks: d.priceBlocks || {},
                discount_dates: d.discountDates || [],
                discount_exists: d.discountExists || false,
                discount_months: d.discountMonths || [],
                max_discount: d.maxDiscount || 0,
                low_months: d.lowMonths || [],
                disabled_dates: d.disabledDates || [],
                disabled_blocks: d.disabledBlocks || {},
                enabled_dates: d.enabledDates || [],
                optioned_dates: d.optionedDates || [],
                check_ins: d.checkIns || [],
                check_outs: d.checkOuts || [],
                min2: d.min2 || false,
                min3: d.min3 || false,
                min4: d.min4 || false,
                min5: d.min5 || false,
                min6: d.min6 || false,
                min2_availables: d.min2Availables || [],
                min3_availables: d.min3Availables || [],
                min4_availables: d.min4Availables || [],
                min5_availables: d.min5Availables || [],
                min7_availables: d.min7Availables || [],
                min2days_dates: d.min2daysDates || [],
                min3days_dates: d.min3daysDates || [],
                min4days_dates: d.min4daysDates || [],
                firsat_blocks: d.firsatBlocks || {},
                firsat_price: d.firsatPrice || 0,
                firsat_price_list: d.firsatPriceList || {},
                firsat_blocks_can: d.firsatBlocksCan || {},
                firsats_from_now: d.firsatsFromNow || [],
                enabled_firsat: d.enabledFirsat || [],
                score: d.score || 0,
                score_count: d.scoreCount || 0,
                score1: d.score1 || 0, score1_percent: d.score1percent || 0,
                score2: d.score2 || 0, score2_percent: d.score2percent || 0,
                score3: d.score3 || 0, score3_percent: d.score3percent || 0,
                score4: d.score4 || 0, score4_percent: d.score4percent || 0,
                score5: d.score5 || 0, score5_percent: d.score5percent || 0,
                p_review: d.pReview || [],
                owner_name: d.ownerName || '',
                owner_phone: d.ownerPhone || '',
                owner_iban: d.ownerIban || '',
                owner_not: d.ownerNot || '',
                publish: isActive ? (d.publish !== false) : false,
                cheapest_villa: d.cheapestVilla || false,
                exclusive_villa: d.exclusiveVilla || false,
                weekly_discount: d.weeklyDiscount || false,
                superlow: d.superlow || false,
                superlow_count: d.superlowCount || 0,
                superlow_first_date: d.superlowFirstDate || '',
                fp: d.fp || 1,
                order: d.order || 0,
                last_discount_starts_at: d.lastDiscountStartsAt || 0,
                last_overall: d.lastOverall || 0,
                last_short2_starts_at: d.lastShort2StartsAt || 0,
                last_short3_starts_at: d.lastShort3StartsAt || 0,
                last_short4_starts_at: d.lastShort4StartsAt || 0,
                promos: d.promos || [],
                policy: d.policy || '',
                not_field: d.not || '',
                not_en: d.notEn || '',
                dr1: d.dr1 || '',
                dr2: d.dr2 || '',
                dr_length: d.drLength || '',
                im_anim: d.imAnim || false,
                im_index: typeof d.imIndex === 'number' ? String(d.imIndex) : (d.imIndex || ''),
                id_field: d.id || '',
                position0: d.position0 || '',
                min_unselected_dates_for_the_price: d.minUnselectedDatesForThePrice || [],
                min_unselected_dates_for_the_price_show: d.minUnselectedDatesForThePriceShow || [],
                creation_date: d.creationDate || null,
            };

            // Handle -Infinity in JSONB arrays
            for (const key of ['discount_months', 'low_months']) {
                if (Array.isArray(row[key])) {
                    row[key] = row[key].map(v => (typeof v === 'number' && !isFinite(v)) ? null : v);
                }
            }
            // Handle -Infinity in price_blocks values
            if (row.price_blocks && typeof row.price_blocks === 'object') {
                for (const [k, v] of Object.entries(row.price_blocks)) {
                    if (Array.isArray(v)) {
                        row.price_blocks[k] = v.map(item =>
                            (typeof item === 'number' && !isFinite(item)) ? null : item
                        );
                    }
                }
            }
            // Handle last_discount_starts_at -Infinity
            if (typeof row.last_discount_starts_at === 'number' && !isFinite(row.last_discount_starts_at)) {
                row.last_discount_starts_at = 0;
            }

            const { error } = await supabase.from('villas').upsert(row, { onConflict: 'slug' });
            if (error) {
                console.error(`   ❌ Villa "${d.name}" hata:`, error.message);
            } else {
                console.log(`   ✅ ${d.name}`);
            }
        }
    }
}

async function migrateBlogs() {
    console.log('\n═══ BLOGS ═══');
    const snap = await getCollection('activeBlogs');

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            slug: d.slug || doc.id,
            title: d.h || '',
            subtitle: d.h0 || '',
            author: d.author || 'Villa Tatilinde',
            cover_image: d.coverImage || '',
            images: d.images || [],
            tags: d.tags || [],
            type: d.type || 1,
            description_html_content: d.descriptionHtmlContent || '',
            description_html_content2: d.descriptionHtmlContent2 || '',
            read_time: d.readTime || '',
            en_read_time: d.enReadTime || '',
            en_author: d.enAuthor || '',
            publish: d.publish !== false,
            create_date: d.createDate || null,
            date_readable: d.dateReadable || '',
            date_readable_en: d.dateReadableEn || '',
            update_date: d.updateDate || '',
            update_date_en: d.updateDateEn || '',
        };
        const { error } = await supabase.from('blogs').upsert(row, { onConflict: 'slug' });
        if (error) console.error(`   ❌ Blog "${d.slug}" hata:`, error.message);
        else console.log(`   ✅ ${row.title || row.slug}`);
    }
}

async function migrateFaqs() {
    console.log('\n═══ FAQS ═══');
    const snap = await getCollection('activeFaqs');

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            slug: d.slug || doc.id,
            question: d.question || '',
            description_html_content: d.descriptionHtmlContent || '',
            publish: d.publish !== false,
            create_date: d.createDate || null,
            date_readable: d.dateReadable || '',
            date_readable_en: d.dateReadableEn || '',
            update_date: d.updateDate || 0,
            update_date_en: d.updateDateEn || 0,
        };
        const { error } = await supabase.from('faqs').upsert(row, { onConflict: 'slug' });
        if (error) console.error(`   ❌ FAQ "${d.slug}" hata:`, error.message);
        else console.log(`   ✅ ${row.question}`);
    }
}

async function migrateQuestions() {
    console.log('\n═══ QUESTIONS ═══');
    const snap = await getCollection('activeQuestions');

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            slug: d.slug || doc.id,
            question: d.question || '',
            description_html_content: d.descriptionHtmlContent || '',
            publish: d.publish !== false,
            create_date: d.createDate || null,
            date_readable: d.dateReadable || '',
            date_readable_en: d.dateReadableEn || '',
            update_date: d.updateDate || 0,
            update_date_en: d.updateDateEn || 0,
        };
        const { error } = await supabase.from('questions').upsert(row, { onConflict: 'slug' });
        if (error) console.error(`   ❌ Question "${d.slug}" hata:`, error.message);
        else console.log(`   ✅ ${row.question}`);
    }
}

async function migrateRequests(firebaseCollection, supabaseTable) {
    console.log(`\n═══ ${supabaseTable.toUpperCase()} ═══`);
    const snap = await getCollection(firebaseCollection);

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            request_ref: d.requestRef || doc.id,
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
        const { error } = await supabase.from(supabaseTable).upsert(row, { onConflict: 'request_ref' });
        if (error) console.error(`   ❌ ${doc.id} hata:`, error.message);
        else console.log(`   ✅ ${doc.id}`);
    }
}

async function migrateManualReferences() {
    console.log('\n═══ MANUAL_REFERENCES ═══');

    for (const source of ['manualReferences', 'manualReferencesAdmin']) {
        const snap = await getCollection(source);
        const isAdmin = source === 'manualReferencesAdmin';

        for (const doc of snap.docs) {
            const d = sanitize(doc.data());
            const row = {
                ref: d.ref || doc.id,
                short_ref: d.shortRef || '',
                active: d.active || false,
                show_admin: isAdmin ? true : (d.showAdmin || false),
                available: d.available ?? true,
                name: d.name || '',
                surname: d.surname || '',
                email: d.email || '',
                phone_code: d.phoneCode || '',
                phone_number: d.phoneNumber || '',
                tc_or_passport: d.tcOrPassport || '',
                address: d.address || '',
                city: d.city || '',
                country: d.country || '',
                check_in: d.checkIn || '',
                check_out: d.checkOut || '',
                d: d.d || null,
                d1: d.d1 || null,
                d2: d.d2 || null,
                nights: d.nights || [],
                currency: d.currency || '',
                currency_symbol: d.currencySymbol || '',
                comission: d.comission || '',
                deposit: d.deposit || '',
                total: d.total || '',
                what_to_pay: d.whatToPay || 0,
                what_to_pay_at_entrance: d.whatToPayAtEntrance || 0,
                what_to_pay_try: d.whatToPayTry || '',
                paid: d.paid || false,
                paid_date: d.paidDate || '',
                paid_date_readable: d.paidDateReadable || '',
                pi: d.pi || '',
                dead_line: d.deadLine || '',
                dead_line_d: d.deadLineD || null,
                dead_line_readable: d.deadLineReadable || '',
                link: d.link || '',
                mesafeli: d.mesafeli || '',
                villa_slug: d.villaSlug || '',
                villa: d.villa || null,
            };
            const { error } = await supabase.from('manual_references').upsert(row, { onConflict: 'ref' });
            if (error) console.error(`   ❌ ${doc.id} hata:`, error.message);
            else console.log(`   ✅ ${doc.id}`);
        }
    }
}

async function migrateNumbers() {
    console.log('\n═══ NUMBERS ═══');
    const snap = await getCollection('numbers');

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        for (const [key, value] of Object.entries(d)) {
            const row = { key, value: typeof value === 'number' ? value : 0 };
            const { error } = await supabase.from('numbers').upsert(row, { onConflict: 'key' });
            if (error) console.error(`   ❌ ${key} hata:`, error.message);
            else console.log(`   ✅ ${key}: ${value}`);
        }
    }
}

async function migratePolicies() {
    console.log('\n═══ POLICIES ═══');
    const snap = await getCollection('policies');

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            slug: doc.id,
            policy: d.policy || '',
        };
        const { error } = await supabase.from('policies').upsert(row, { onConflict: 'slug' });
        if (error) console.error(`   ❌ ${doc.id} hata:`, error.message);
        else console.log(`   ✅ ${doc.id}`);
    }
}

async function migrateSuccessfulPayments(firebaseCollection, supabaseTable) {
    console.log(`\n═══ ${supabaseTable.toUpperCase()} ═══`);
    const snap = await getCollection(firebaseCollection);

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            cdata: d.cdata || '',
            date: d.date || null,
            date_readable: d.dateReadable || '',
            pid: d.pid || '',
            refno: d.refno || '',
            ...(d.uid !== undefined ? { uid: d.uid } : {}),
        };
        const { error } = await supabase.from(supabaseTable).insert(row);
        if (error) {
            if (error.code === '23505') {
                console.log(`   ⏩ ${doc.id} zaten var, atlanıyor`);
            } else {
                console.error(`   ❌ ${doc.id} hata:`, error.message);
            }
        } else {
            console.log(`   ✅ ${doc.id}`);
        }
    }
}

async function migrateUserQuestions() {
    console.log('\n═══ USER_QUESTIONS ═══');
    const snap = await getCollection('userQuestions');

    for (const doc of snap.docs) {
        const d = sanitize(doc.data());
        const row = {
            slug: d.slug || doc.id,
            question: d.question || '',
            description_html_content: d.descriptionHtmlContent || '',
            answered_by: d.answeredBy || '',
            email: d.email || '',
            uid: d.uid || '',
            villa: d.villa || '',
            notification: d.notification || false,
            publish: d.publish !== false,
            date: d.date || null,
            date_readable: d.dateReadable || '',
            date_readable_en: d.dateReadableEn || '',
        };
        const { error } = await supabase.from('user_questions').upsert(row, { onConflict: 'slug' });
        if (error) console.error(`   ❌ ${doc.id} hata:`, error.message);
        else console.log(`   ✅ ${doc.id}`);
    }
}

async function migrateUserDetails() {
    console.log('\n═══ USER_DETAILS ═══');

    for (const source of ['userdetails', 'uss']) {
        const snap = await getCollection(source);

        for (const doc of snap.docs) {
            const d = sanitize(doc.data());
            const row = {
                uid: d.uid || doc.id,
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
            if (error) console.error(`   ❌ ${doc.id} hata:`, error.message);
            else console.log(`   ✅ ${doc.id}`);
        }
    }
}

// ─── Main ───
async function main() {
    console.log('🚀 Firebase → Supabase veri taşıma başlıyor...');
    console.log('⚠️  Firebase verileri SADECE OKUNUYOR, değiştirilmiyor.\n');

    try {
        await migrateVillas();
        await migrateBlogs();
        await migrateFaqs();
        await migrateQuestions();
        await migrateRequests('adminRequests', 'admin_requests');
        await migrateRequests('userRequests', 'user_requests');
        await migrateManualReferences();
        await migrateNumbers();
        await migratePolicies();
        await migrateSuccessfulPayments('successfullPayments', 'successful_payments');
        await migrateSuccessfulPayments('successfullPaymentsManual', 'successful_payments_manual');
        await migrateUserQuestions();
        await migrateUserDetails();

        console.log('\n\n✅✅✅ Tüm veriler başarıyla taşındı! ✅✅✅');
    } catch (err) {
        console.error('\n❌ HATA:', err);
    }

    process.exit(0);
}

main();
