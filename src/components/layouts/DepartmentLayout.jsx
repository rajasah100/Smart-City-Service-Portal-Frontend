import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../department/Sidebar"
import Navbar from "../department/Navbar"
import useSosPushAlerts from "../../hooks/useSosPushAlerts"
import departmentApiRequest from "../../utils/departmentApiRequest"


const DepartmentLayout = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // SOS aauda dashboard band bhae pani phone/browser ma notification aaos
  useSosPushAlerts({
    api: departmentApiRequest,
    endpoint: "/departments/fcm-token",
    method: "post",
    storageKey: "departmentFcmToken",
    sosPath: "/department/sos",
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:ml-72 print:ml-0">
        <Navbar onMenu={() => setMenuOpen(true)} />

        {/* key={pathname}: page badlida halka animation */}
        <main key={pathname} className="animate-fade-up mx-auto max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DepartmentLayout
