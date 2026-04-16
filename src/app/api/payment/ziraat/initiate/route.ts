import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { reservationId } = body;

        if (!reservationId) {
            return NextResponse.json({ error: "reservationId is required" }, { status: 400 });
        }

        // Fetch reservation
        const { data: rez, error: rezError } = await supabase
            .from("reservations")
            .select("id, status, prepayment_amount, currency")
            .eq("id", reservationId)
            .single();

        if (rezError || !rez) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        if (rez.status !== "pre_approved" && rez.status !== "pending") {
            return NextResponse.json({ error: "Payment not allowed for this status" }, { status: 400 });
        }

        if (rez.prepayment_amount < 1) {
            return NextResponse.json({ error: "Ödenecek tutar 0 veya geçerli değil. İşlem başlatılamaz." }, { status: 400 });
        }

        // Ziraat API credentials
        const clientId = process.env.ZIRAAT_CLIENT_ID || "";
        const storeKey = process.env.ZIRAAT_STORE_KEY || "";
        const targetUrl = process.env.ZIRAAT_POS_URL || "https://sanalpos2.ziraatbank.com.tr/fim/est3Dgate";

        const origin = new URL(req.url).origin;
        const okUrl = `${origin}/api/payment/ziraat/callback`;
        const failUrl = `${origin}/api/payment/ziraat/callback`;

        // Payment details
        // Random string for 'rnd'
        const rnd = Date.now().toString();
        // Ziraat allows 64 chars max for OID. UUID is 36. So we can append without truncation.
        const oid = `${reservationId}_${rnd.slice(-6)}`;
        
        // Ziraat amount expects normal decimal (e.g., 100.50) without grouping separators
        const amount = rez.prepayment_amount.toFixed(2);
        
        const islemtipi = "Auth";
        const taksit = "";
        const storetype = "3d_pay_hosting";
        
        // Ensure https for local testing to avoid 'okUrl requires https' error from Ziraat
        // Even if local, we pretend it's https so the bank initiates the 3D secure page.
        // The callback won't reach localhost anyway, but it avoids immediate form rejection.
        const secureOkUrl = okUrl.replace('http://', 'https://');
        const secureFailUrl = failUrl.replace('http://', 'https://');

        // Parameter definition
        const params: Record<string, string> = {
            clientid: clientId,
            storetype,
            hashAlgorithm: "ver3",
            islemtipi,
            amount,
            currency: "949",
            oid,
            okUrl: secureOkUrl,
            failUrl: secureFailUrl,
            lang: "tr",
            rnd,
            taksit
        };

        // Payten Nestpay Hash V3 Algorithm:
        // 1. Sort all parameters alphabetically by key.
        const keys = Object.keys(params).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
        
        // 2. Escape \ and | characters, then join with |
        let hashval = "";
        for (const key of keys) {
            const val = params[key] || "";
            const escaped = val.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
            hashval += escaped + "|";
        }
        
        // 3. Append escaped storeKey
        hashval += storeKey.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
        
        // 4. SHA512 hash and Base64 encode
        const hash = crypto.createHash("sha512").update(hashval).digest("base64");
        params.hash = hash;

        // We return these variables so the client can generate and auto-submit the POST form
        return NextResponse.json({
            targetUrl,
            params
        });

    } catch (err: any) {
        console.error("Ziraat Init Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
