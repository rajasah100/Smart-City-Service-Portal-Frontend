import EmergencyAlerts from "../components/index/emergency/EmergencyAlerts"
import EmergencyContacts from "../components/index/emergency/EmergencyContacts"
import EmergencyMap from "../components/index/emergency/EmergencyMap"
import HeroSection from "../components/index/emergency/HeroSection"
import NearbyServices from "../components/index/emergency/NearbyServices"


const EmergencyPage = () => {
  return (
    <div className="mt-18 bg-gray-50">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Emergency Contacts */}
      <EmergencyContacts />

      {/* Emergency Alerts */}
      <EmergencyAlerts />

      {/* NearbyServices */}
      <NearbyServices />

      {/* Emergency Map */}
      <EmergencyMap />

    </div>
  )
}

export default EmergencyPage
