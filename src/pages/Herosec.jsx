import NoticeTicker from '../components/index/NoticeTicker';
import HeroCarousel from '../components/index/home/HeroCarousel';
import HeroNoticePanel from '../components/index/home/HeroNoticePanel';
import HomeStats from '../components/index/home/HomeStats';
import CitizenServices from '../components/index/home/CitizenServices';
import MunicipalityIntro from '../components/index/home/MunicipalityIntro';
import ComplaintProcess from '../components/index/home/ComplaintProcess';
import ImportantLinks from '../components/index/home/ImportantLinks';
import OfficialsSection from '../components/index/home/OfficialsSection';
import HomeDownloads from '../components/index/home/HomeDownloads';
import BannerCTA from '../components/index/BannerCTA';
import { useTranslation } from 'react-i18next';


// Nepal ka nagarpalika ko website jasto banot:
// सूचना ticker -> photo slider + ताजा सूचना -> tathyanka -> sewa -> parichaya -> prakriya -> link
const Herosec = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-slate-100">
      {/* SEO/screen reader: home ko mukhya shirshak (slider ko title badlirahanchha) */}
      <h1 className="sr-only">{t("seo.pages.home.title")}</h1>

      {/* सूचना ticker (pt-20 = fixed navbar ko uchai, natra navbar muni lukcha) */}
      <div className="pt-20">
        <NoticeTicker />
      </div>

      {/* Hero: slider + ताजा सूचना */}
      <section className="py-6">
        {/* Desktop ma sthir uchai: slider ra notice panel barabar, kehi pani bahira naposos */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:h-136 lg:grid-cols-3 lg:px-8">
          <div className="min-h-0 lg:col-span-2">
            <HeroCarousel />
          </div>

          <HeroNoticePanel />
        </div>
      </section>

      {/* Asli tathyanka */}
      <HomeStats />

      {/* नागरिक सेवा */}
      <CitizenServices />

      {/* जनप्रतिनिधि तथा कर्मचारी (admin le haleko bhae matra) */}
      <OfficialsSection />

      {/* नगरपालिकाको परिचय + कार्यक्रम */}
      <MunicipalityIntro />

      {/* गुनासो प्रक्रिया */}
      <ComplaintProcess />

      {/* डाउनलोड (kagajat bhae matra) */}
      <HomeDownloads />

      {/* महत्वपूर्ण लिंक */}
      <ImportantLinks />

      {/* Banner CTA */}
      <BannerCTA />

    </div>
  )
}

export default Herosec
