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


// Nepal ka nagarpalika ko website jasto banot:
// सूचना ticker -> photo slider + ताजा सूचना -> tathyanka -> sewa -> parichaya -> prakriya -> link
const Herosec = () => {
  return (
    <div className="flex flex-col bg-slate-100">

      {/* सूचना ticker (pt-20 = fixed navbar ko uchai, natra navbar muni lukcha) */}
      <div className="pt-20">
        <NoticeTicker />
      </div>

      {/* Hero: slider + ताजा सूचना */}
      <section className="py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
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
