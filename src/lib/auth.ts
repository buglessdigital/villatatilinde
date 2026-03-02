import { supabase } from './supabase';

/* ─── Auth Helper Functions ─── */

/** Admin giriş (e-posta + şifre) */
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { user: null, error: error.message };
    }

    // Önce auth_uid ile dene, bulamazsa email ile dene
    let profile = null;
    let profileError = null;

    // 1) auth_uid ile eşleştirmeyi dene
    const res1 = await supabase
        .from('users')
        .select('id, role, auth_uid')
        .eq('auth_uid', data.user.id)
        .maybeSingle();

    if (res1.data) {
        profile = res1.data;
    } else {
        // 2) email ile eşleştirmeyi dene
        const res2 = await supabase
            .from('users')
            .select('id, role, auth_uid')
            .eq('email', email)
            .maybeSingle();

        if (res2.data) {
            profile = res2.data;

            // auth_uid boşsa otomatik bağla
            if (!profile.auth_uid) {
                await supabase
                    .from('users')
                    .update({ auth_uid: data.user.id })
                    .eq('id', profile.id);
            }
        } else {
            profileError = 'Kullanıcı profili bulunamadı.';
        }
    }

    if (profileError || !profile) {
        await supabase.auth.signOut();
        return { user: null, error: profileError || 'Kullanıcı profili bulunamadı.' };
    }

    if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        return { user: null, error: 'Bu hesap admin yetkisine sahip değil.' };
    }

    return { user: data.user, error: null };
}

/** Çıkış yap */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
}

/** Mevcut oturumu al */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session;
}

/** Mevcut kullanıcıyı al */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
}

/** Kullanıcının admin olup olmadığını kontrol et */
export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    // Önce auth_uid, sonra email ile kontrol et
    const { data: data1 } = await supabase
        .from('users')
        .select('role')
        .eq('auth_uid', user.id)
        .maybeSingle();

    if (data1) return data1.role === 'admin';

    // email fallback
    if (user.email) {
        const { data: data2 } = await supabase
            .from('users')
            .select('role')
            .eq('email', user.email)
            .maybeSingle();

        if (data2) return data2.role === 'admin';
    }

    return false;
}
