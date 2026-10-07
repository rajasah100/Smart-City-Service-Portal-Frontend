// Page ko SEO tag (title, description, canonical, Open Graph, Twitter, robots, JSON-LD) ek thau bata
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const upsert = (selector, create) => {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    return el;
};

const setMetaTag = (attr, key, content) => {
    const el = upsert(`meta[${attr}="${key}"]`, () => {
        const meta = document.createElement("meta");
        meta.setAttribute(attr, key);
        return meta;
    });
    el.setAttribute("content", content);
};

const setCanonical = (href) => {
    const el = upsert('link[rel="canonical"]', () => {
        const link = document.createElement("link");
        link.rel = "canonical";
        return link;
    });
    el.href = href;
};

// Page ko JSON-LD (structured data); null bhae hataune
const setJsonLd = (data) => {
    const existing = document.getElementById("ld-page");
    if (!data) {
        existing?.remove();
        return;
    }
    const el = existing || Object.assign(document.createElement("script"), { id: "ld-page", type: "application/ld+json" });
    el.textContent = JSON.stringify(data);
    if (!existing) document.head.appendChild(el);
};

// Description lai Google ko lagi ~160 akshar ma
const clip = (text = "", max = 160) => {
    const clean = String(text).replace(/\s+/g, " ").trim();
    return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

export const applySeo = ({ title, siteName, description, path = window.location.pathname, image, type = "website", noindex = false, lang = "ne", jsonLd = null }) => {
    const fullTitle = title && title !== siteName ? `${title} | ${siteName}` : siteName;
    const url = `${SITE_URL}${path}`;
    const desc = clip(description);

    document.title = fullTitle;
    document.documentElement.lang = lang;

    setMetaTag("name", "description", desc);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setCanonical(url);

    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", siteName);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", desc);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:image", image || DEFAULT_IMAGE);
    setMetaTag("property", "og:locale", lang === "en" ? "en_US" : "ne_NP");

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", desc);
    setMetaTag("name", "twitter:image", image || DEFAULT_IMAGE);

    setJsonLd(jsonLd);
};

// "2026-10-25T00:00:00Z" + "09:00" -> "2026-10-25T09:00:00+05:45" (Nepal ko samaya)
const nepalDateTime = (date, time = "00:00") => {
    if (!date) return undefined;
    const day = new Date(date).toISOString().slice(0, 10);
    const [h = "00", m = "00"] = String(time).split(":");
    return `${day}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+05:45`;
};

// Karyakram: Google ko Event rich result
export const eventJsonLd = (event, siteName) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: clip(event.description, 500),
    startDate: nepalDateTime(event.startDate, event.startTime),
    endDate: nepalDateTime(event.endDate || event.startDate, event.endTime),
    eventStatus: event.isCancelled ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: event.image?.url ? [event.image.url] : [DEFAULT_IMAGE],
    location: {
        "@type": "Place",
        name: event.location?.venue || event.location?.municipality || siteName,
        address: {
            "@type": "PostalAddress",
            streetAddress: [event.location?.tole, event.location?.ward && `Ward ${event.location.ward}`].filter(Boolean).join(", ") || undefined,
            addressLocality: event.location?.municipality,
            addressRegion: event.location?.district,
            addressCountry: "NP",
        },
    },
    organizer: { "@type": "Organization", name: event.organizer || siteName, url: SITE_URL },
    ...(event.isRegistrationRequired
        ? { offers: { "@type": "Offer", price: 0, priceCurrency: "NPR", availability: "https://schema.org/InStock", url: `${SITE_URL}/events/${event._id}` } }
        : {}),
});

// Suchana: Article (Google News/search ma sahi miti ra prakashak)
export const noticeJsonLd = (notice, siteName) => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: clip(notice.title, 110),
    description: clip(notice.description, 300),
    datePublished: notice.createdAt,
    dateModified: notice.updatedAt || notice.createdAt,
    image: [notice.attachment?.find?.((a) => a.type === "image")?.url || DEFAULT_IMAGE],
    author: { "@type": "Organization", name: notice.department?.name || notice.publishedBy || siteName },
    publisher: { "@type": "Organization", name: siteName, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
    mainEntityOfPage: `${SITE_URL}/notices/${notice._id}`,
});
