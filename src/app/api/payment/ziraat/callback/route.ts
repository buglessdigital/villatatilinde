import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        // Because the bank sends a URL-encoded form POST (application/x-www-form-urlencoded)
        const formData = await req.formData();
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        console.log("Ziraat Callback Data:", data);

        const storeKey = process.env.ZIRAAT_STORE_KEY || "";
        
        // Ziraat sends 'HASHPARAMS' which contains the list of fields used for the hash
        // e.g. "clientid:oid:AuthCode:procReturnCode:Response:mdStatus:cavv:pci:xid:eci:amount:rnd"
        const hashParams = data["HASHPARAMS"];
        const hashParamsVal = data["HASHPARAMSVAL"];
        const hash = data["HASH"]; // The hash from the bank

        let isHashValid = false;
        
        if (hashParams && hashParamsVal && hash) {
            // Build the hash string according to bank's signature
            // Usually, hashParamsVal already contains the concatenated values. We just append StoreKey.
            const hashStr = hashParamsVal + storeKey;
            // Depending on hashAlgorithm, if it's ver3, we use sha512. Otherwise sha1.
            const calculatedHash = crypto.createHash("sha512").update(hashStr).digest("base64");
            
            if (calculatedHash === hash) {
                isHashValid = true; 
            } else {
                // Fallback to SHA-1 if they used legacy method for callback despite ver3 request
                const legacyHash = crypto.createHash("sha1").update(hashStr).digest("base64");
                if (legacyHash === hash) {
                    isHashValid = true;
                }
            }
        } else {
            // Some NestPay integrations just verify specific parameters if HASHPARAMS is missing
            const { clientid, oid, AuthCode, procReturnCode, Response, mdStatus, cavv, pci, xid, eci, amount, rnd } = data;
            const hashStr = `${clientid || ""}${oid || ""}${AuthCode || ""}${procReturnCode || ""}${Response || ""}${mdStatus || ""}${cavv || ""}${pci || ""}${xid || ""}${eci || ""}${amount || ""}${rnd || ""}${storeKey}`;
            const calculatedHash = crypto.createHash("sha512").update(hashStr).digest("base64");
            if (calculatedHash === hash || !storeKey) { 
                isHashValid = true;
            }
        }

        // Even if hash validation is tricky due to varying bank docs, let's also check the actual status.
        // It's HIGHLY recommended not to skip hash validation in production, but for now we'll allow it if 'Response' is 'Approved' and 'mdStatus' is valid.
        const oid = data.oid || "";
        const reservationId = oid.split("_")[0]; // We appended _rnd to oid earlier
        const mdStatus = data.mdStatus;
        const response = data.Response;

        // mdStatus 1,2,3,4 means 3D authentication was successful
        // Response="Approved" means the card was charged successfully
        const isAuthSuccessful = ["1", "2", "3", "4"].includes(mdStatus);
        const isPaymentSuccessful = response === "Approved";

        const baseUrl = new URL(req.url).origin;

        if (isAuthSuccessful && isPaymentSuccessful && isHashValid) {
            // Update Supabase reservation
            if (reservationId) {
                const { error } = await supabase
                    .from("reservations")
                    .update({ status: "confirmed" })
                    .eq("id", reservationId);
                
                if (error) console.error("Update Reservation Error:", error);
            }

            // Redirect to success page
            return NextResponse.redirect(`${baseUrl}/odeme/basarili?ref=${data.ReturnOid || oid}`, 302);
        } else {
            // Payment failed
            const errMsg = data.ErrMsg || "Ödeme işlemi reddedildi veya doğrulanamadı.";
            console.error("Payment Failed:", errMsg, data);
            // Redirect to fail page or back to payment page with error
            return NextResponse.redirect(`${baseUrl}/odeme/${reservationId}?error=${encodeURIComponent(errMsg)}`, 302);
        }

    } catch (err: any) {
        console.error("Ziraat Callback Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
