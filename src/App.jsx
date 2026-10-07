import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from "react-redux"
import store from './redux/store'
import HomeLayout from './components/layouts/HomeLayout'
import AdminLayout from './components/layouts/AdminLayout'
import UserDashboardLayout from './components/layouts/UserDashboardLayout'
import Herosec from './pages/Herosec'
import DepartmentLayout from './components/layouts/DepartmentLayout'
import DepartmentProtectedRoute from './components/common/DepartmentProtectedRoute'
import AuthProtectedRoute from './components/common/AuthProtectedRoute'
import PublicRoute from './components/common/PublicRoute'
import DepartmentPublicRoute from './components/common/DepartmentPublicRoute'
import InstallPWAButton from './components/common/InstallPWAButton'
import ScrollToTop from './components/common/ScrollToTop'
import SeoManager from './components/common/SeoManager'
import LoadingSpinner from './components/common/LoadingSpinner'

// Page haru lazy-load garne: admin/department ko code normal user le download garnu pardaina
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomePage'))
const UserDashboardHome = lazy(() => import('./pages/user/UserDashboardHome'))
const MyComplaints = lazy(() => import('./pages/user/MyComplaints'))
const ComplaintPage = lazy(() => import('./pages/ComplaintPage'))
const ComplaintDetailPage = lazy(() => import('./pages/user/ComplaintDetailPage'))
const DepartmentHomePage = lazy(() => import('./pages/department/DepartmentHomePage'))
const DepartmentLogin = lazy(() => import('./pages/auth/DepartmentLogin'))
const DepartmentComplaints = lazy(() => import('./pages/department/DepartmentComplaints'))
const LocationTracking = lazy(() => import('./pages/department/LocationTracking'))
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'))
const ComplaintsPage = lazy(() => import('./pages/admin/ComplaintsPage'))
const UserSettings = lazy(() => import('./components/user/UserSettings'))
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'))
const NoticePage = lazy(() => import('./pages/NoticePage'))
const NoticeDetailsPage = lazy(() => import('./pages/user/NoticeDetailsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const DepartmentNoticePage = lazy(() => import('./pages/department/DepartmentNoticePage'))
const AdminNoticePage = lazy(() => import('./pages/admin/AdminNoticePage'))
const AdminDepartmentPage = lazy(() => import('./pages/admin/AdminDepartmentPage'))
const AdminEmergencyServicePage = lazy(() => import('./pages/admin/AdminEmergencyServicePage'))
const AdminSosPage = lazy(() => import('./pages/admin/AdminSosPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))
const AdminHomeContentPage = lazy(() => import('./pages/admin/AdminHomeContentPage'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'))
const DepartmentSosPage = lazy(() => import('./pages/department/DepartmentSosPage'))
const DepartmentProfilePage = lazy(() => import('./pages/department/DepartmentProfilePage'))
const NotificationPage = lazy(() => import('./pages/user/NotificationPage'))
const ServicePage = lazy(() => import('./pages/ServicePage'))
const GovernmentPage = lazy(() => import('./pages/GovernmentPage'))
const EventPage = lazy(() => import('./pages/EventPage'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const EventrRegistration = lazy(() => import('./pages/EventrRegistration'))
const AdminEventPage = lazy(() => import('./pages/admin/AdminEventPage'))
const EventRegistrationPage = lazy(() => import('./pages/admin/EventRegistrationPage'))
const About = lazy(() => import('./pages/About'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'))
const LegalPage = lazy(() => import('./pages/LegalPage'))


const App = () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <SeoManager />
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            {/* Public Routes */}
            <Route index element={<Herosec />} />


            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="notices" element={<NoticePage />} />
            <Route path="notices/:id" element={<NoticeDetailsPage />} />
            <Route path='services' element={<ServicePage />} />
            <Route path='government' element={<GovernmentPage />} />
            <Route path='events' element={<EventPage />} />
            <Route path='events/:id' element={<EventDetails />} />
            <Route path='about' element={<About />} />
            <Route path='downloads' element={<DownloadsPage />} />
            <Route path='privacy' element={<LegalPage key="privacy" page="privacy" />} />
            <Route path='terms' element={<LegalPage key="terms" page="terms" />} />
            <Route path='accessibility' element={<LegalPage key="accessibility" page="accessibility" />} />


            {/* Protected Route */}
            <Route element={<AuthProtectedRoute allowedRoles={["user"]} />}>
              <Route path="complaint" element={<ComplaintPage />} />
              <Route path="/events/:id/register" element={<EventrRegistration />} />
            </Route>
          </Route>

          {/* Guest Only */}
          <Route element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Citizen (user) Dashboard */}
          <Route element={<AuthProtectedRoute allowedRoles={["user"]} />}>
            <Route path='/user' element={<UserDashboardLayout />}>
              <Route index element={<UserDashboardHome />} />
              <Route path='complaints' element={<MyComplaints />} />
              <Route path='notifications' element={<NotificationPage />} />
              <Route path='settings' element={<UserSettings />} />
              <Route path='complaints/:complaintId' element={<ComplaintDetailPage />} />
            </Route>
          </Route>


          {/* Admin Dashboard */}
          <Route element={<AuthProtectedRoute allowedRoles={["admin"]} />}>
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path='users' element={<UserManagementPage />} />
              <Route path='departments' element={<AdminDepartmentPage />} />
              <Route path='emergency-services' element={<AdminEmergencyServicePage />} />
              <Route path='sos' element={<AdminSosPage />} />
              <Route path='settings' element={<AdminSettingsPage />} />
              <Route path='home-content' element={<AdminHomeContentPage />} />
              <Route path='messages' element={<AdminMessagesPage />} />
              <Route path='notices' element={<AdminNoticePage />} />
              <Route path='events' element={<AdminEventPage />} />
              <Route path='event-registrations' element={<EventRegistrationPage />} />
              <Route path='complaints' element={<ComplaintsPage />} />
            </Route>
          </Route>

          {/* Department Login */}
          <Route element={<DepartmentPublicRoute />}>
            <Route path="department/login" element={<DepartmentLogin />} />
          </Route>

          {/* Department Dashboard */}
          <Route element={<DepartmentProtectedRoute />}>
            <Route path='/department' element={<DepartmentLayout />}>
              <Route index element={<DepartmentHomePage />} />
              <Route path='complaints' element={<DepartmentComplaints />} />
              <Route path='location' element={<LocationTracking />} />
              <Route path='sos' element={<DepartmentSosPage />} />
              <Route path='notices' element={<DepartmentNoticePage />} />
              <Route path='profile' element={<DepartmentProfilePage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
        </Suspense>

        {/* PWA Web App */}
        <InstallPWAButton />

      </BrowserRouter>
    </Provider >
  )
}

export default App
