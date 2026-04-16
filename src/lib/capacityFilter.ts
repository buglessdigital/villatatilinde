/**
 * Dinamik Kişi Filtreleme Mapping
 *
 * Arama motoruna girilen kişi sayısına göre aşağıdaki mantıkla sonuçlar döner.
 * İlk eleman tam eşleşme, sonrakiler yakınlık sırasına göre sıralanır.
 *
 * Örnek: 3 kişi seçilince → Önce 3, sonra 4, sonra 2 kişilik villalar
 */
export const capacityMapping: Record<number, number[]> = {
    1: [2, 3, 4],
    2: [2, 3, 4],
    3: [3, 4, 2, 5],
    4: [4, 5, 6, 3],
    5: [5, 6, 4, 7],
    6: [6, 7, 8, 5],
    7: [7, 8, 9, 6],
    8: [8, 9, 10, 7],
    9: [9, 10, 11, 8],
    10: [10, 12, 11, 13, 14],
    11: [11, 12, 13, 10, 14],
    12: [12, 13, 14, 11, 10],
    13: [13, 12, 14, 15, 16],
    14: [14, 13, 15, 16, 12],
    15: [15, 16, 14, 18, 20],
    16: [15, 16, 14, 18, 20],
};

/**
 * Verilen kişi sayısına göre izin verilen kapasiteleri döner.
 * Mapping'de olmayan değerler için [people, people+1] döner.
 */
export function getAllowedCapacities(people: number): number[] {
    return capacityMapping[people] || [people, people + 1];
}

/**
 * Villaları kişi sayısına göre filtreler VE priority sırasına göre sıralar.
 * T generic tipi, villa objesinin herhangi bir şekilde olmasına izin verir.
 *
 * @param villas - Filtrelenecek villa listesi
 * @param people - Seçilen kişi sayısı (0 ise filtre uygulanmaz)
 * @param getGuests - Her villadan misafir sayısını çıkaran fonksiyon
 * @returns Filtrelenmiş ve priority sırasına göre sıralanmış villa listesi
 */
export function filterAndSortByCapacity<T>(
    villas: T[],
    people: number,
    getGuests: (villa: T) => number
): T[] {
    if (people <= 0) return villas;

    const allowedCapacities = getAllowedCapacities(people);

    // Filtrele: sadece allowed kapasiteler
    const filtered = villas.filter((v) => allowedCapacities.includes(getGuests(v)));

    // Sırala: capacityMapping'deki sıraya göre (ilk eleman en yüksek öncelik)
    filtered.sort((a, b) => {
        const indexA = allowedCapacities.indexOf(getGuests(a));
        const indexB = allowedCapacities.indexOf(getGuests(b));
        return indexA - indexB;
    });

    return filtered;
}
