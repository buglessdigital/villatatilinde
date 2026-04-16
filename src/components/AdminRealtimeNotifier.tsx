"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminRealtimeNotifier() {
    useEffect(() => {
        // Listen to new reservations
        const resChannel = supabase.channel('admin-reservations-notif')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'reservations' },
                () => {
                    playDing();
                }
            )
            .subscribe();

        // Listen to new questions/search requests
        const questChannel = supabase.channel('admin-questions-notif')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'user_questions' },
                () => {
                    playDing();
                }
            )
            .subscribe();

        // Listen to new callback requests (Sizi Arayalım)
        const callbackChannel = supabase.channel('admin-callback-notif')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'callback_requests' },
                () => {
                    playDing();
                }
            )
            .subscribe();

        // Listen to payment confirmations (UPDATE on reservations to 'confirmed' status)
        const paymentChannel = supabase.channel('admin-payments-notif')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'reservations' },
                (payload: any) => {
                    // Sadece status 'confirmed' (Kredi Kartı onayı) olduğunda çal
                    if (payload.new && payload.new.status === 'confirmed') {
                        playDing();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(resChannel);
            supabase.removeChannel(questChannel);
            supabase.removeChannel(callbackChannel);
            supabase.removeChannel(paymentChannel);
        };
    }, []);

    const playDing = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const playTone = (freq: number, startTime: number, duration: number, volume: number) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, startTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.95, startTime + duration);

                gainNode.gain.setValueAtTime(0.001, startTime);
                gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.connect(gainNode);
                gainNode.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            // Corporate "ping-pong" chime (G5 then C6)
            const now = ctx.currentTime;
            playTone(783.99, now, 0.8, 0.3);        // G5
            playTone(1046.50, now + 0.15, 1.2, 0.25); // C6
            
            // Add a subtle lower harmonic for "thickness"
            playTone(392.00, now + 0.15, 1.0, 0.1);  // G4

        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    return null; /* Invisible component, just hooks */
}
