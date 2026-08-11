
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
      <Outlet />
      <Footer />

      <FloatingAIButton 
        onClick={() => setOpenAI(true)}
      />

      <AIChatDrawer
        open={openAI}
        onClose={() => setOpenAI(false)}
      />
    </div>
  )
}

export default HomeLayout