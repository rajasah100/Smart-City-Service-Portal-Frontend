import { Outlet } from 'react-router-dom'
import UserNavbar from '../user/UserNavbar'
import Navbar from './Navbar'
import Footer from './Footer'
import useFirebaseNotification from "../../hooks/useFirebaseNotification";

const UserDashboardLayout = () => {
  useFirebaseNotification();

  return (
    <div className="">
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navbar - persists across every /user/* child route */}
            <div className="lg:col-span-1">
              <UserNavbar />
            </div>

            {/* Child page content */}
            <div className="lg:col-span-3 space-y-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UserDashboardLayout
