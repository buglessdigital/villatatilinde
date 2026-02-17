/* ─── Tatil Yerleri / Destination Mock Data ─── */

export interface Destination {
    slug: string;
    name: string;           // e.g. "Kalkan Merkez Villalar"
    location: string;       // e.g. "Kalkan Merkez"
    villaCount: number;
    image: string;
    description: string;
    tags: string[];
    filterParam: string;    // query param for /sonuclar?location=...
}

export const destinations: Destination[] = [
    {
        slug: "kalkan-merkez",
        name: "Kalkan Merkez Villalar",
        location: "Kalkan Merkez",
        villaCount: 115,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-merkez",
    },
    {
        slug: "kalkan-kalamar",
        name: "Kalkan Kalamar Villalar",
        location: "Kalkan Kalamar",
        villaCount: 19,
        image: "https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-kalamar",
    },
    {
        slug: "kalkan-komurluk",
        name: "Kalkan Kömürlük Villalar",
        location: "Kalkan Kömürlük",
        villaCount: 1,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-komurluk",
    },
    {
        slug: "kalkan-kisla",
        name: "Kalkan Kışla Villalar",
        location: "Kalkan Kışla",
        villaCount: 19,
        image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-kisla",
    },
    {
        slug: "kalkan-ortaalan",
        name: "Kalkan Ortaalan Villalar",
        location: "Kalkan Ortaalan",
        villaCount: 42,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-ortaalan",
    },
    {
        slug: "kalkan-kiziltas",
        name: "Kalkan Kızıltaş Villalar",
        location: "Kalkan Kızıltaş",
        villaCount: 35,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-kiziltas",
    },
    {
        slug: "kalkan-patara",
        name: "Kalkan Patara Villalar",
        location: "Kalkan Patara",
        villaCount: 12,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-patara",
    },
    {
        slug: "kalkan-ulugol",
        name: "Kalkan Ulugöl Villalar",
        location: "Kalkan Ulugöl",
        villaCount: 8,
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-ulugol",
    },
    {
        slug: "kalkan-kordere",
        name: "Kalkan Kördere Villalar",
        location: "Kalkan Kördere",
        villaCount: 74,
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-kordere",
    },
    {
        slug: "kalkan-islamlar",
        name: "Kalkan İslamlar Villalar",
        location: "Kalkan İslamlar",
        villaCount: 63,
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-islamlar",
    },
    {
        slug: "kalkan-uzumlu",
        name: "Kalkan Üzümlü Villalar",
        location: "Kalkan Üzümlü",
        villaCount: 28,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-uzumlu",
    },
    {
        slug: "kalkan-bezirgan",
        name: "Kalkan Bezirgan Villalar",
        location: "Kalkan Bezirgan",
        villaCount: 7,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-bezirgan",
    },
    {
        slug: "kalkan-saribelen",
        name: "Kalkan Sarıbelen Villalar",
        location: "Kalkan Sarıbelen",
        villaCount: 9,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-saribelen",
    },
    {
        slug: "kalkan-yesilkoy",
        name: "Kalkan Yeşilköy Villalar",
        location: "Kalkan Yeşilköy",
        villaCount: 15,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kalkan-yesilkoy",
    },
    {
        slug: "kas-merkez",
        name: "Kaş Merkez Villalar",
        location: "Kaş Merkez",
        villaCount: 24,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "kas-merkez",
    },
    {
        slug: "fethiye",
        name: "Fethiye Villalar",
        location: "Fethiye",
        villaCount: 34,
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "fethiye",
    },
    {
        slug: "belek",
        name: "Belek'da Bulunan Villalar",
        location: "Belek",
        villaCount: 15,
        image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800&q=80",
        description: "Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası",
        tags: ["Muhafazakar", "Özel Havuzlu", "Deniz Manzaralı", "Plaja Yakın Villalar", "Uygun Fiyatlarla"],
        filterParam: "belek",
    },
];

/* ─── Popular search items for "En Çok Arananlar" footer section ─── */
export interface PopularSearch {
    title: string;
    subtitle: string;
    href: string;
}

export const popularSearches: PopularSearch[] = [
    { title: "Uygun Fiyatlı Villalar", subtitle: "Ekonomik deniz manzaralı villalar", href: "/sonuclar?category=ekonomik" },
    { title: "Muhafazakar Villalar", subtitle: "Dışarıdan görünmeyen lüx villalar", href: "/sonuclar?category=muhafazakar" },
    { title: "Balayı Villaları", subtitle: "Çiftler iki kişilik villalar", href: "/sonuclar?category=balayi" },
    { title: "Ultra Lüx Villalar", subtitle: "Ultra lüx ve modern tatil villaları", href: "/sonuclar?category=ultra-luks" },
    { title: "Merkezi Konumlu Villalar", subtitle: "Şehir merkezinde tatil villaları", href: "/sonuclar?category=merkezi-konumlu" },
    { title: "Denize Yakın Villalar", subtitle: "Denize yürüme mesafesinde villalar", href: "/sonuclar?category=denize-yakin" },
    { title: "Deniz Manzaralı Villalar", subtitle: "Deniz manzaralı tatil villaları", href: "/sonuclar?category=deniz-manzarali" },
    { title: "Doğa Manzaralı Villalar", subtitle: "Doğa içinde ve doğa manzaralı tatil villaları", href: "/sonuclar?category=doga-manzarali" },
    { title: "Havuzu Korunaklı Villalar", subtitle: "Havuzu dışarıdan görünmeyen villalar", href: "/sonuclar?category=havuzu-korunakli" },
    { title: "Çocuk Havuzlu Villalar", subtitle: "Çocuk havuzlu tatil villaları", href: "/sonuclar?category=cocuk-havuzlu" },
    { title: "Yeni Villalar", subtitle: "Yeni yapılmış modern ve geniş tatil villaları", href: "/sonuclar?category=yeni" },
    { title: "Kalkan Tatil Villaları", subtitle: "Kalkan'da bulunan tatil villaları", href: "/sonuclar?location=kalkan-merkez" },
    { title: "Kaş Tatil Villaları", subtitle: "Kaş'ta bulunan tatil villaları", href: "/sonuclar?location=kas-merkez" },
];
