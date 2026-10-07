
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingAIButton from "../../components/ai/FloatingAIButton"
import AIChatDrawer from '../ai/AIChatDrawer'
import { useState } from 'react'

const HomeLayout = () => {
  const [openAI, setOpenAI] = useState(false);

  return (
    <div>
      <Navbar />

      {/* Desktop ma GovHeader (h-19) ko lagi thau */}
      <div className="md:pt-19 print:pt-0">
        <Outlet />
      </div>

      <Footer />

      <FloatingAIButton onClick={() => setOpenAI(true)} hidden={openAI} />

      <AIChatDrawer
        open={openAI}
        onClose={() => setOpenAI(false)}
      />
    </div>
  )
}

export default HomeLayout