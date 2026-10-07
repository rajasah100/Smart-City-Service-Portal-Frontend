import EmergencyAlerts from "../components/index/emergency/EmergencyAlerts"
import EmergencyContacts from "../components/index/emergency/EmergencyContacts"
import HeroSection from "../components/index/emergency/HeroSection"
import NearbyServices from "../components/index/emergency/NearbyServices"
import OfflineBanner from "../components/index/emergency/OfflineBanner"
import SafetyGuide from "../components/index/emergency/SafetyGuide"
import ShareLocation from "../components/index/emergency/ShareLocation"


const EmergencyPage = () => {
  return (
    <div className="bg-white">

      {/* Internet nabhaye dekhine banner */}
      <OfflineBanner />

      {/* Hero + Live Alerts */}
      <HeroSection />

      {/* SOS location share + report issue */}
      <ShareLocation />

      {/* National hotlines + department contacts */}
      <EmergencyContacts />

      {/* High priority notices */}
      <EmergencyAlerts />

      {/* Nearby services list + map */}
      <NearbyServices />

      {/* Before / During / After guide */}
      <SafetyGuide />

    </div>
  )
}

export default EmergencyPage
