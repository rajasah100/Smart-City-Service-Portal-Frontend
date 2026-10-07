import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";
import slide1 from "../../../assets/city1.webp";
import slide2 from "../../../assets/cityImg.jpg";
import slide3 from "../../../assets/register.jpg";
import useHomeContent from "../../../hooks/useHomeContent";

const DEFAULT_IMAGES = [slide1, slide2, slide3];
const INTERVAL_MS = 6000;

const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Sarkari website jastai photo slider (caption + button sahit)
// Admin → Home Content bata photo haleko bhae tyo dekhaucha, natra default 3 wata
const HeroCarousel = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const adminSlides = useHomeContent("/slides");

    const [index, setIndex] = useState(0);
    // "Reduce motion" on bhae aafai nachalaune
    const [playing, setPlaying] = useState(() => !prefersReducedMotion());
    const [hovered, setHovered] = useState(false);

    const defaultSlides = t("homeGov.heroGov.slides", { returnObjects: true });

    const slides =
        adminSlides && adminSlides.length > 0
            ? adminSlides.map((slide) => ({
                  key: slide._id,
                  image: slide.image?.url,
                  title: isEn ? slide.titleEn || slide.titleNe : slide.titleNe,
                  text: isEn ? slide.textEn || slide.textNe : slide.textNe,
                  to: slide.link,
                  cta: slide.link ? t("homeGov.intro.readMore") : "",
              }))
            : (Array.isArray(defaultSlides) ? defaultSlides : []).map((slide, i) => ({
                  ...slide,
                  key: `default-${i}`,
                  image: DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
              }));

    const count = slides.length;
    // Slide sankhya badlida index bahira najaos
    const current = count > 0 ? index % count : 0;

    useEffect(() => {
        if (!playing || hovered || count < 2) return;

        const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
        return () => clearInterval(timer);
    }, [playing, hovered, count]);

    if (count === 0) return null;

    const go = (next) => setIndex((next + count) % count);

    // Bahira ko link (https://) naya tab ma, website bhitra ko link React Router le
    const isExternal = (to) => /^https?:\/\//.test(to || "");

    return (
        <div
            className="relative h-80 overflow-hidden rounded-xl bg-[#10151c] shadow-lg sm:h-96 lg:h-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-roledescription="carousel"
        >
            {slides.map((slide, i) => (
                <div
                    key={slide.key}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        i === current ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={i !== current}
                    role="group"
                    aria-roledescription="slide"
                >
                    <img
                        src={slide.image}
                        alt=""
                        className={`h-full w-full object-cover transition-transform duration-6000 ease-linear ${
                            i === current && playing ? "scale-105" : "scale-100"
                        }`}
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#0b1b3a]/90 via-[#0b1b3a]/30 to-transparent" />

                    {/* Caption */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <div className="max-w-2xl border-l-4 border-[#dc143c] pl-4">
                            <h2 className="line-clamp-2 text-xl font-bold leading-tight text-white drop-shadow sm:text-3xl">{slide.title}</h2>
                            {slide.text && (
                                <p className="mt-2 line-clamp-2 text-sm text-slate-200 sm:text-base">{slide.text}</p>
                            )}
                        </div>

                        {slide.to && slide.cta && (
                            isExternal(slide.to) ? (
                                <a
                                    href={slide.to}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    tabIndex={i === current ? 0 : -1}
                                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#dc143c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b51031]"
                                >
                                    {slide.cta}
                                    <FaChevronRight className="text-xs" />
                                </a>
                            ) : (
                                <Link
                                    to={slide.to}
                                    tabIndex={i === current ? 0 : -1}
                                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#dc143c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b51031]"
                                >
                                    {slide.cta}
                                    <FaChevronRight className="text-xs" />
                                </Link>
                            )
                        )}
                    </div>
                </div>
            ))}

            {count > 1 && (
                <>
                    {/* Arrows */}
                    <button
                        onClick={() => go(current - 1)}
                        aria-label={t("homeGov.heroGov.prev")}
                        className="absolute left-3 top-1/2 hidden h-10 w-10 sm:flex -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        onClick={() => go(current + 1)}
                        aria-label={t("homeGov.heroGov.next")}
                        className="absolute right-3 top-1/2 hidden h-10 w-10 sm:flex -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                    >
                        <FaChevronRight />
                    </button>

                    {/* Dots + pause */}
                    <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5">
                        {slides.map((slide, i) => (
                            <button
                                key={slide.key}
                                onClick={() => go(i)}
                                aria-label={t("homeGov.heroGov.goTo", { n: i + 1 })}
                                aria-current={i === current}
                                className={`h-2 rounded-full transition-all ${
                                    i === current ? "w-6 bg-[#d9a441]" : "w-2 bg-white/60 hover:bg-white"
                                }`}
                            />
                        ))}

                        <button
                            onClick={() => setPlaying((value) => !value)}
                            aria-label={playing ? t("homeGov.heroGov.pause") : t("homeGov.heroGov.play")}
                            className="ml-1 text-[10px] text-white/80 hover:text-white"
                        >
                            {playing ? <FaPause /> : <FaPlay />}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroCarousel;
