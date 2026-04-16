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
    toPublicTransport?: number;
    // Info
    deposit: number;
    cleaning: number;
    minRes: number;
    minResCleaning: number;
    checkIn: string;
    checkOut: string;
    belgeNo: string;
    // Features
    features: string[];
    includedServices?: string[];
    // Description
    descriptionHtml: string;
    // Rules
    pet: boolean;
    smoke: boolean;
    party: boolean;
    sound: boolean;
    selfCheckin?: boolean;
    poolFence?: boolean;
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
    },
    {
        slug: "villa-kalkan-elite",
        name: "Villa Kalkan Elite",
        location: "Kalkan Merkez",
        refCode: "VTO71",
        coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
        ],
        guests: 4,
        bedrooms: 2,
        baths: 2,
        pWidth: 3.0, pLength: 6.0, pDepth: 1.40,
        currency: "TRY",
        minEver: 8000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 8000, weeklyPrice: 56000, discount: 0, minNights: 3 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 11000, weeklyPrice: 77000, discount: 5, minNights: 4, originalPrice: 11579 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 8000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 11000 },
        ],
        calendarReservations: [],
        toBeach: 2000, toRestaurant: 500, toShop: 300, toCentre: 500,
        toHospital: 8000, saglikOcagi: 1500, toAirport: 125000,
        deposit: 3000, cleaning: 2500, minRes: 3, minResCleaning: 3,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "07-9012",
        features: [
            "privatePool", "balcony", "gardenLounge", "airConditioning", "wifi",
            "fridge", "washingMac", "dishWasher", "oven",
            "affordableVillas", "centralVillas", "honeyMoon"
        ],
        descriptionHtml: `<p>Villa Kalkan Elite, Kalkan Merkez'de denize yürüme mesafesinde, 2 yatak odası ile çiftler ve küçük aileler için idealdir.</p>`,
        pet: false, smoke: true, party: false, sound: true,
        mapIframe: "", position: { lat: 36.2637, lng: 29.4139 }, video: [],
        score: 4.6, scoreCount: 8,
        score5percent: 60, score4percent: 30, score3percent: 10, score2percent: 0, score1percent: 0,
        reviews: [
            { authorName: "Selin", initial2: "B", nights: 5, dateReadableTr: "Haziran 2025", rate: 5, body: "Merkeze çok yakın, mükemmel bir konum.", images: [] },
        ],
    },
    {
        slug: "villa-kas-deniz",
        name: "Villa Kaş Deniz",
        location: "Kaş Merkez",
        refCode: "VTO85",
        coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
        ],
        guests: 6,
        bedrooms: 3,
        baths: 3,
        pWidth: 4.0, pLength: 8.0, pDepth: 1.50,
        currency: "TRY",
        minEver: 15000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 15000, weeklyPrice: 105000, discount: 0, minNights: 4 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 22000, weeklyPrice: 154000, discount: 8, minNights: 5, originalPrice: 23913 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 15000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 22000 },
        ],
        calendarReservations: [
            { startDate: "2026-07-05", endDate: "2026-07-12", status: "reserved" },
        ],
        toBeach: 800, toRestaurant: 600, toShop: 400, toCentre: 1000,
        toHospital: 12000, saglikOcagi: 2000, toAirport: 155000,
        deposit: 6000, cleaning: 4000, minRes: 4, minResCleaning: 4,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "07-6521",
        features: [
            "privatePool", "heatedPool", "jacuzziVillas", "sauna",
            "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "wifi", "smartTv", "fridge", "washingMac", "dishWasher", "oven",
            "seaview", "beachVillas"
        ],
        descriptionHtml: `<p>Villa Kaş Deniz, Kaş Merkez'de deniz manzaralı, jakuzili ve saunalı premium bir tatil villasıdır.</p>`,
        pet: true, smoke: true, party: true, sound: true,
        mapIframe: "", position: { lat: 36.2000, lng: 29.6400 }, video: [],
        score: 4.9, scoreCount: 18,
        score5percent: 88, score4percent: 10, score3percent: 2, score2percent: 0, score1percent: 0,
        reviews: [
            { authorName: "Deniz", initial2: "K", nights: 7, dateReadableTr: "Temmuz 2025", rate: 5, body: "Denize muhteşem bir manzara, jakuzi olağanüstüydü.", images: [] },
        ],
    },
    {
        slug: "villa-belek-golf",
        name: "Villa Belek Golf",
        location: "Belek",
        refCode: "VTO92",
        coverImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
        images: [
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
        ],
        guests: 12,
        bedrooms: 6,
        baths: 6,
        pWidth: 6.0, pLength: 14.0, pDepth: 1.80,
        currency: "TRY",
        minEver: 35000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 35000, weeklyPrice: 245000, discount: 0, minNights: 5 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 50000, weeklyPrice: 350000, discount: 10, minNights: 7, originalPrice: 55556 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 35000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 50000 },
        ],
        calendarReservations: [],
        toBeach: 3000, toRestaurant: 1000, toShop: 1500, toCentre: 5000,
        toHospital: 20000, saglikOcagi: 5000, toAirport: 30000,
        deposit: 15000, cleaning: 8000, minRes: 5, minResCleaning: 5,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "07-1234",
        features: [
            "privatePool", "infinityPool", "kidPoolVillas", "jacuzziVillas",
            "gymRoom", "sauna", "cinemaRoom", "winterGarden", "tennisTable", "poolTable",
            "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "floorHeating", "wifi", "smartTv", "fridge", "washingMac",
            "dryingMac", "dishWasher", "oven", "iron", "kitchen", "enSuite",
            "ultraLux", "newVillas"
        ],
        descriptionHtml: `<p>Villa Belek Golf, Belek'te golf sahalarına yakın, 6 yatak odalı ultra lüks bir villadır. Büyük aileler ve gruplar için ideal.</p>`,
        pet: true, smoke: true, party: true, sound: true,
        mapIframe: "", position: { lat: 36.8600, lng: 31.0500 }, video: [],
        score: 4.8, scoreCount: 15,
        score5percent: 80, score4percent: 15, score3percent: 5, score2percent: 0, score1percent: 0,
        reviews: [
            { authorName: "Emre", initial2: "S", nights: 7, dateReadableTr: "Ağustos 2025", rate: 5, body: "Ultra lüks deneyim! Golf oynadık, havuz müthişti.", images: [] },
        ],
    },
    {
        slug: "villa-islamlar-huzur",
        name: "Villa İslamlar Huzur",
        location: "Kalkan İslamlar",
        refCode: "VTO33",
        coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
        ],
        guests: 8,
        bedrooms: 4,
        baths: 3,
        pWidth: 4.0, pLength: 8.0, pDepth: 1.50,
        currency: "TRY",
        minEver: 10000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 10000, weeklyPrice: 70000, discount: 0, minNights: 4 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 16000, weeklyPrice: 112000, discount: 6, minNights: 4, originalPrice: 17022 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 10000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 16000 },
        ],
        calendarReservations: [
            { startDate: "2026-08-01", endDate: "2026-08-08", status: "reserved" },
        ],
        toBeach: 15000, toRestaurant: 3000, toShop: 2000, toCentre: 14000,
        toHospital: 28000, saglikOcagi: 14000, toAirport: 135000,
        deposit: 4000, cleaning: 3500, minRes: 4, minResCleaning: 4,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "07-4567",
        features: [
            "privatePool", "kidPoolVillas", "isolatedPoolVillas",
            "balcony", "gardenLounge", "airConditioning", "wifi", "fridge",
            "washingMac", "dishWasher", "oven", "iron",
            "isolatedVillas", "natureview", "affordableVillas"
        ],
        descriptionHtml: `<p>Villa İslamlar Huzur, Kalkan İslamlar'da doğa içinde, muhafazakar havuzu ile aileler için idealdir.</p>`,
        pet: false, smoke: true, party: false, sound: true,
        mapIframe: "", position: { lat: 36.3800, lng: 29.4200 }, video: [],
        score: 4.5, scoreCount: 10,
        score5percent: 55, score4percent: 35, score3percent: 10, score2percent: 0, score1percent: 0,
        reviews: [
            { authorName: "Hülya", initial2: "A", nights: 6, dateReadableTr: "Temmuz 2025", rate: 4.5, body: "Muhafazakar havuz mükemmeldi, doğa içinde huzurlu bir tatil.", images: [] },
        ],
    },
    {
        slug: "villa-kordere-panorama",
        name: "Villa Kördere Panorama",
        location: "Kalkan Kördere",
        refCode: "VTO44",
        coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        images: [
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
        ],
        guests: 10,
        bedrooms: 5,
        baths: 4,
        pWidth: 5.0, pLength: 10.0, pDepth: 1.60,
        currency: "TRY",
        minEver: 22000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 22000, weeklyPrice: 154000, discount: 0, minNights: 4 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 32000, weeklyPrice: 224000, discount: 8, minNights: 5, originalPrice: 34783 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 22000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 32000 },
        ],
        calendarReservations: [],
        toBeach: 6000, toRestaurant: 2000, toShop: 1500, toCentre: 5000,
        toHospital: 20000, saglikOcagi: 8000, toAirport: 128000,
        deposit: 8000, cleaning: 5000, minRes: 4, minResCleaning: 4,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "07-7890",
        features: [
            "privatePool", "infinityPool", "heatedPool", "jacuzziVillas",
            "sauna", "winterGarden", "poolTable",
            "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "floorHeating", "wifi", "smartTv", "fridge", "washingMac",
            "dishWasher", "oven", "iron", "kitchen", "enSuite",
            "seaview", "ultraLux"
        ],
        descriptionHtml: `<p>Villa Kördere Panorama, Kalkan Kördere'de panoramik deniz manzaralı, sonsuzluk havuzlu lüks bir villadır.</p>`,
        pet: true, smoke: true, party: true, sound: true,
        mapIframe: "", position: { lat: 36.2800, lng: 29.4300 }, video: [],
        score: 4.7, scoreCount: 22,
        score5percent: 72, score4percent: 20, score3percent: 8, score2percent: 0, score1percent: 0,
        reviews: [
            { authorName: "Cem", initial2: "T", nights: 7, dateReadableTr: "Ağustos 2025", rate: 5, body: "Sonsuzluk havuzundan deniz manzarası inanılmazdı.", images: [] },
        ],
    },
    {
        slug: "villa-fethiye-green",
        name: "Villa Fethiye Green",
        location: "Fethiye",
        refCode: "VTO66",
        coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
        ],
        guests: 6,
        bedrooms: 3,
        baths: 2,
        pWidth: 3.5, pLength: 7.0, pDepth: 1.45,
        currency: "TRY",
        minEver: 9000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 9000, weeklyPrice: 63000, discount: 0, minNights: 3 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 14000, weeklyPrice: 98000, discount: 5, minNights: 4, originalPrice: 14737 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 9000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 14000 },
        ],
        calendarReservations: [],
        toBeach: 5000, toRestaurant: 1000, toShop: 800, toCentre: 3000,
        toHospital: 10000, saglikOcagi: 3000, toAirport: 60000,
        deposit: 4000, cleaning: 3000, minRes: 3, minResCleaning: 3,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "48-5678",
        features: [
            "privatePool", "kidPoolVillas",
            "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "wifi", "fridge", "washingMac", "dishWasher", "oven",
            "natureview", "affordableVillas", "centralVillas"
        ],
        descriptionHtml: `<p>Villa Fethiye Green, Fethiye'de doğa manzaralı, ekonomik ve merkeze yakın bir tatil villasıdır.</p>`,
        pet: true, smoke: true, party: false, sound: true,
        mapIframe: "", position: { lat: 36.6200, lng: 29.1100 }, video: [],
        score: 4.4, scoreCount: 14,
        score5percent: 50, score4percent: 35, score3percent: 10, score2percent: 5, score1percent: 0,
        reviews: [
            { authorName: "Gül", initial2: "M", nights: 5, dateReadableTr: "Haziran 2025", rate: 4, body: "Fiyatına göre çok iyi bir villa. Doğası güzel.", images: [] },
        ],
    },
    {
        slug: "villa-honeymoon-kas",
        name: "Villa Honeymoon Kaş",
        location: "Kaş Çukurbağ",
        refCode: "VTO99",
        coverImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
        images: [
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
        ],
        guests: 2,
        bedrooms: 1,
        baths: 1,
        pWidth: 2.5, pLength: 5.0, pDepth: 1.30,
        currency: "TRY",
        minEver: 7000,
        priceBlocks: [
            { period: "01 - 31 Mayıs", nightlyPrice: 7000, weeklyPrice: 49000, discount: 0, minNights: 3 },
            { period: "01 Haziran - 31 Ağustos", nightlyPrice: 10000, weeklyPrice: 70000, discount: 5, minNights: 3, originalPrice: 10526 },
        ],
        calendarPrices: [
            { startDate: "2026-05-01", endDate: "2026-05-31", price: 7000 },
            { startDate: "2026-06-01", endDate: "2026-08-31", price: 10000 },
        ],
        calendarReservations: [],
        toBeach: 400, toRestaurant: 700, toShop: 1000, toCentre: 2500,
        toHospital: 14000, saglikOcagi: 2500, toAirport: 158000,
        deposit: 3000, cleaning: 2000, minRes: 3, minResCleaning: 3,
        checkIn: "16:00", checkOut: "10:00", belgeNo: "07-9999",
        features: [
            "privatePool", "jacuzziVillas", "heatedPool",
            "balcony", "gardenLounge", "sunbedUmbrella",
            "airConditioning", "wifi", "smartTv", "fridge",
            "honeyMoon", "seaview", "beachVillas", "affordableVillas"
        ],
        descriptionHtml: `<p>Villa Honeymoon Kaş, çiftler için tasarlanmış romantik bir balayı villasıdır. Deniz manzaralı özel havuzu ve jakuzisi ile unutulmaz anlar yaşayın.</p>`,
        pet: false, smoke: false, party: false, sound: false,
        mapIframe: "", position: { lat: 36.1970, lng: 29.6370 }, video: [],
        score: 5.0, scoreCount: 28,
        score5percent: 95, score4percent: 5, score3percent: 0, score2percent: 0, score1percent: 0,
        reviews: [
            { authorName: "Elif", initial2: "Y", nights: 5, dateReadableTr: "Haziran 2025", rate: 5, body: "Balayımız için mükemmeldi! Romantik atmosfer ve deniz manzarası.", images: [] },
        ],
    },
];

export function getVillaBySlug(slug: string): Villa | undefined {
    return mockVillas.find((v) => v.slug === slug);
}

export function formatDistance(meters: number): string {
    if (meters >= 1000) {
        const km = Math.round((meters * 100) / 100000);
        return `${km}km`;
    }
    return `${meters}m`;
}
