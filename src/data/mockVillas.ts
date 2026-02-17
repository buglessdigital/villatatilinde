export interface Villa {
    slug: string;
    name: string;
    location: string;
    refCode: string;
    coverImage: string;
    images: string[];
    guests: number;
    bedrooms: number;
    baths: number;
    pWidth: number;
    pLength: number;
    pDepth: number;
    currency: string;
    minEver: number;
    priceBlocks: PriceBlock[];
    // Calendar
    calendarPrices: CalendarPriceRange[];
    calendarReservations: CalendarReservation[];
    // Distances
    toBeach: number;
    toRestaurant: number;
    toShop: number;
    toCentre: number;
    toHospital: number;
    saglikOcagi: number;
    toAirport: number;
    // Info
    deposit: number;
    cleaning: number;
    minRes: number;
    minResCleaning: number;
    checkIn: string;
    checkOut: string;
    comission: number;
    belgeNo: string;
    // Features
    features: string[];
    // Description
    descriptionHtml: string;
    // Rules
    pet: boolean;
    smoke: boolean;
    party: boolean;
    sound: boolean;
    // Map
    mapIframe: string;
    position: { lat: number; lng: number };
    // Video
    video: string[];
    // Reviews
    score: number;
    scoreCount: number;
    score5percent: number;
    score4percent: number;
    score3percent: number;
    score2percent: number;
    score1percent: number;
    reviews: Review[];
}

export interface PriceBlock {
    period: string;
    nightlyPrice: number;
    weeklyPrice: number;
    discount: number;
    minNights: number;
    originalPrice?: number;
}

export interface CalendarPriceRange {
    startDate: string; // "YYYY-MM-DD"
    endDate: string;   // "YYYY-MM-DD"
    price: number;
}

export interface CalendarReservation {
    startDate: string;
    endDate: string;
    status: "reserved" | "option";
}

export interface Review {
    authorName: string;
    initial2: string;
    nights: number;
    dateReadableTr: string;
    rate: number;
    body: string;
    images: string[];
}

export const mockVillas: Villa[] = [
    {
        slug: "villa-doga",
        name: "Villa Doğa",
        location: "Kalkan Bezirgan",
        refCode: "VTO26",
        coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
        ],
        guests: 6,
        bedrooms: 3,
        baths: 3,
        pWidth: 3.0,
        pLength: 7.0,
        pDepth: 1.55,
        currency: "TRY",
        minEver: 12000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 12000, weeklyPrice: 84000, discount: 0, minNights: 4 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 14904, weeklyPrice: 104328, discount: 8, minNights: 4, originalPrice: 16200 },
            { period: "01 - 30 Eylül", nightlyPrice: 13440, weeklyPrice: 94080, discount: 4, minNights: 4, originalPrice: 14000 },
            { period: "01 - 31 Ekim", nightlyPrice: 12000, weeklyPrice: 84000, discount: 0, minNights: 4 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 12000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 14904 },
            { startDate: "2026-09-01", endDate: "2026-09-30", price: 13440 },
            { startDate: "2026-10-01", endDate: "2026-10-31", price: 12000 },
        ],
        calendarReservations: [
            { startDate: "2026-06-15", endDate: "2026-06-22", status: "reserved" },
            { startDate: "2026-07-10", endDate: "2026-07-17", status: "reserved" },
            { startDate: "2026-08-01", endDate: "2026-08-07", status: "option" },
            { startDate: "2026-08-20", endDate: "2026-08-28", status: "reserved" },
        ],
        toBeach: 13000,
        toRestaurant: 2500,
        toShop: 1000,
        toCentre: 12000,
        toHospital: 25000,
        saglikOcagi: 13000,
        toAirport: 130000,
        deposit: 5000,
        cleaning: 4000,
        minRes: 4,
        minResCleaning: 4,
        checkIn: "16:00",
        checkOut: "10:00",
        comission: 30,
        belgeNo: "07-7039",
        features: [
            "privatePool", "kidPoolVillas", "balcony", "gardenLounge",
            "airConditioning", "wifi", "fridge", "washingMac",
            "dishWasher", "oven", "iron",
            "affordableVillas", "isolatedVillas", "natureview", "kidPoolVillas"
        ],
        descriptionHtml: `<p>Villa Doğa, Kalkan Bezirgan Köyü'nde doğa içerisinde, 3 yatak odası ve 6 kişi konaklama kapasitesine sahiptir. Villamız taş ve ahşap mimariye sahiptir. Villamızda badem ağaçlarının yer aldığı yemyeşil geniş bahçe alanı, özel havuzu, terası, enerji kesilmesi durumda güneş enerji sistemi bulunmaktadır. Villamızın yeşillere bezenmiş bahçesi ve geniş terasında sevdikleriniz ile doğa içerisinde keyifli ve huzurlu bir tatil geçirebilirsiniz.</p><p><strong>NOT: Elektrikli aracı olan misafirlerimiz için villamızda şarj istasyonu mevcuttur.</strong></p>`,
        pet: true,
        smoke: true,
        party: true,
        sound: true,
        mapIframe: "https://yandex.com.tr/map-widget/v1/?um=constructor%3A323dd7906d9e6dd2d30af325b36db8cd0918a90a66969f767a8041223d445e25&source=constructor",
        position: { lat: 36.3957, lng: 29.4164 },
        video: [],
        score: 4.8,
        scoreCount: 12,
        score5percent: 75,
        score4percent: 20,
        score3percent: 5,
        score2percent: 0,
        score1percent: 0,
        reviews: [
            {
                authorName: "Mehmet",
                initial2: "K",
                nights: 7,
                dateReadableTr: "Ağustos 2025",
                rate: 5,
                body: "Harika bir tatil geçirdik. Villa çok temiz ve bakımlıydı. Havuz mükemmeldi. Doğa ile iç içe bir deneyim yaşadık. Kesinlikle tekrar geleceğiz.",
                images: []
            },
            {
                authorName: "Ayşe",
                initial2: "T",
                nights: 4,
                dateReadableTr: "Temmuz 2025",
                rate: 4.5,
                body: "Villa gerçekten çok güzeldi. Sadece markete biraz uzak ama araçla sorun değil. Bahçe muhteşemdi, çocuklar çok eğlendi.",
                images: []
            },
            {
                authorName: "Ali",
                initial2: "Y",
                nights: 5,
                dateReadableTr: "Haziran 2025",
                rate: 5,
                body: "Mükemmel bir villa. Sessiz, huzurlu ve doğa ile iç içe. Taş ve ahşap mimarisi çok hoşumuza gitti. Havuz yeterli büyüklükteydi.",
                images: []
            }
        ],
    },
    {
        slug: "villa-azure",
        name: "Villa Azure",
        location: "Kaş Çukurbağ",
        refCode: "VTO42",
        coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
        ],
        guests: 8,
        bedrooms: 4,
        baths: 4,
        pWidth: 5.0,
        pLength: 10.0,
        pDepth: 1.60,
        currency: "TRY",
        minEver: 18000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 18000, weeklyPrice: 126000, discount: 0, minNights: 5 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 25000, weeklyPrice: 175000, discount: 10, minNights: 5, originalPrice: 27778 },
            { period: "01 - 30 Eylül", nightlyPrice: 22000, weeklyPrice: 154000, discount: 5, minNights: 5, originalPrice: 23158 },
            { period: "01 - 31 Ekim", nightlyPrice: 18000, weeklyPrice: 126000, discount: 0, minNights: 5 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 18000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 25000 },
            { startDate: "2026-09-01", endDate: "2026-09-30", price: 22000 },
            { startDate: "2026-10-01", endDate: "2026-10-31", price: 18000 },
        ],
        calendarReservations: [
            { startDate: "2026-07-01", endDate: "2026-07-10", status: "reserved" },
            { startDate: "2026-07-20", endDate: "2026-07-25", status: "option" },
            { startDate: "2026-08-10", endDate: "2026-08-18", status: "reserved" },
        ],
        toBeach: 500,
        toRestaurant: 800,
        toShop: 1200,
        toCentre: 3000,
        toHospital: 15000,
        saglikOcagi: 3000,
        toAirport: 160000,
        deposit: 8000,
        cleaning: 5000,
        minRes: 5,
        minResCleaning: 5,
        checkIn: "16:00",
        checkOut: "10:00",
        comission: 30,
        belgeNo: "07-8142",
        features: [
            "privatePool", "infinityPool", "heatedPool", "jacuzziVillas",
            "sauna", "gymRoom", "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "wifi", "smartTv", "fridge", "washingMac",
            "dryingMac", "dishWasher", "oven", "iron", "kitchen", "enSuite",
            "ultraLux", "seaview", "beachVillas"
        ],
        descriptionHtml: `<p>Villa Azure, Kaş Çukurbağ yarımadasında muhteşem deniz manzarasına sahip ultra lüks bir villadır. 4 yatak odası ve 8 kişi kapasitesiyle geniş ailelere ideal bir tatil deneyimi sunar. Sonsuzluk havuzu, jakuzi, sauna ve spor odası ile tatilinizi unutulmaz kılacaktır.</p><p>Villamızın geniş terası ve bahçesinde Akdeniz'in eşsiz maviliğinin keyfini çıkarabilirsiniz. Modern mimarisi ve şık iç tasarımıyla konforlu bir konaklama deneyimi yaşayacaksınız.</p>`,
        pet: true,
        smoke: true,
        party: true,
        sound: true,
        mapIframe: "https://yandex.com.tr/map-widget/v1/?um=constructor%3A323dd7906d9e6dd2d30af325b36db8cd0918a90a66969f767a8041223d445e25&source=constructor",
        position: { lat: 36.1960, lng: 29.6360 },
        video: [],
        score: 4.9,
        scoreCount: 24,
        score5percent: 85,
        score4percent: 12,
        score3percent: 3,
        score2percent: 0,
        score1percent: 0,
        reviews: [
            {
                authorName: "Zeynep",
                initial2: "A",
                nights: 7,
                dateReadableTr: "Temmuz 2025",
                rate: 5,
                body: "Hayatımda gördüğüm en güzel villa! Sonsuzluk havuzundan Akdeniz manzarası inanılmazdı. Her şey kusursuzdu.",
                images: []
            },
            {
                authorName: "Burak",
                initial2: "M",
                nights: 10,
                dateReadableTr: "Ağustos 2025",
                rate: 5,
                body: "Ultra lüks deneyim. Jakuzi, sauna, spor odası... Her şey düşünülmüş. Ailemizle harika vakit geçirdik.",
                images: []
            }
        ],
    },
    {
        slug: "villa-sunset",
        name: "Villa Sunset",
        location: "Fethiye Ölüdeniz",
        refCode: "VTO58",
        coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
        ],
        guests: 10,
        bedrooms: 5,
        baths: 5,
        pWidth: 6.0,
        pLength: 12.0,
        pDepth: 1.80,
        currency: "TRY",
        minEver: 20000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 20000, weeklyPrice: 140000, discount: 0, minNights: 4 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 30000, weeklyPrice: 210000, discount: 10, minNights: 7, originalPrice: 33333 },
            { period: "01 - 30 Eylül", nightlyPrice: 25000, weeklyPrice: 175000, discount: 5, minNights: 4, originalPrice: 26316 },
            { period: "01 - 31 Ekim", nightlyPrice: 20000, weeklyPrice: 140000, discount: 0, minNights: 4 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 20000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 30000 },
            { startDate: "2026-09-01", endDate: "2026-09-30", price: 25000 },
            { startDate: "2026-10-01", endDate: "2026-10-31", price: 20000 },
        ],
        calendarReservations: [
            { startDate: "2026-06-20", endDate: "2026-06-30", status: "reserved" },
            { startDate: "2026-07-15", endDate: "2026-07-22", status: "option" },
            { startDate: "2026-08-05", endDate: "2026-08-15", status: "reserved" },
            { startDate: "2026-09-01", endDate: "2026-09-07", status: "option" },
        ],
        toBeach: 300,
        toRestaurant: 200,
        toShop: 500,
        toCentre: 1500,
        toHospital: 10000,
        saglikOcagi: 2000,
        toAirport: 65000,
        deposit: 10000,
        cleaning: 6000,
        minRes: 4,
        minResCleaning: 4,
        checkIn: "16:00",
        checkOut: "10:00",
        comission: 30,
        belgeNo: "48-3921",
        features: [
            "privatePool", "infinityPool", "kidPoolVillas", "jacuzziVillas",
            "cinemaRoom", "winterGarden", "tennisTable", "poolTable",
            "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "wifi", "smartTv", "fridge", "washingMac",
            "dryingMac", "dishWasher", "oven", "iron", "kitchen", "enSuite",
            "ultraLux", "seaview", "beachVillas", "centralVillas", "honeyMoon"
        ],
        descriptionHtml: `<p>Villa Sunset, Fethiye Ölüdeniz'de denize yürüme mesafesinde, 5 yatak odası ve 10 kişi konaklama kapasitesiyle büyük aileler ve arkadaş grupları için idealdir. Sonsuzluk havuzu, çocuk havuzu, jakuzi ile açık alanda keyifli vakit geçirebilirsiniz.</p><p>Villa içerisinde sinema odası, kış bahçesi, masa tenisi ve bilardo masası gibi eğlence imkanları mevcuttur. Gün batımı manzarası eşliğinde unutulmaz bir tatil deneyimi yaşayacaksınız.</p>`,
        pet: true,
        smoke: true,
        party: true,
        sound: true,
        mapIframe: "https://yandex.com.tr/map-widget/v1/?um=constructor%3A323dd7906d9e6dd2d30af325b36db8cd0918a90a66969f767a8041223d445e25&source=constructor",
        position: { lat: 36.5500, lng: 29.1150 },
        video: [],
        score: 4.7,
        scoreCount: 36,
        score5percent: 70,
        score4percent: 22,
        score3percent: 5,
        score2percent: 2,
        score1percent: 1,
        reviews: [
            {
                authorName: "Fatih",
                initial2: "D",
                nights: 7,
                dateReadableTr: "Ağustos 2025",
                rate: 5,
                body: "Muhteşem bir villa. Denize çok yakın, havuz ve jakuzi mükemmel. Sinema odası çocuklar için harikaydı. Kesinlikle tavsiye ederim.",
                images: []
            }
        ],
    }
];

export function getVillaBySlug(slug: string): Villa | undefined {
    return mockVillas.find((v) => v.slug === slug);
}

export function formatDistance(meters: number): string {
    if (meters >= 1000) {
        const km = Math.round((meters * 100) / 100000);
        const mi = Math.round(meters * 0.000621371 * 100) / 100;
        return `${km}km | ${mi}mi`;
    }
    const ft = Math.round(meters * 3.28084 * 100) / 100;
    return `${meters}m | ${ft}ft`;
}
