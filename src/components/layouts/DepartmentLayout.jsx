import { Outlet } from "react-router-dom"
import Sidebar from "../department/Sidebar"
import Navbar from "../department/Navbar"


const DepartmentLayout = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="lg:ml-72">
        <Navbar />
      </div>

      <main className="lg:ml-72">
      <Outlet />

      </main>
    </div>
  )
}

export default DepartmentLayout
