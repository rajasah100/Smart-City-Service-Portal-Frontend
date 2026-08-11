import { FaTools } from "react-icons/fa"

// Generic placeholder so nav links never lead to a blank/broken page
// while a feature is still being built.
const ComingSoon = ({ title = "This page" }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 text-gray-500">
      <FaTools size={40} className="mb-4 text-gray-400" />
      <h1 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h1>
      <p>This feature is coming soon.</p>
    </div>
  )
}

export default ComingSoon
