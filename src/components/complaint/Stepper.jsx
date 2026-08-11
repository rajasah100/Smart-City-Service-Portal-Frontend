import { FaCheck } from "react-icons/fa";


const Stepper = ({steps, currentStep}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">

        {steps.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
                <div 
                key={index}
                className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">

                        {/* Step Circle */}
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-300 ${completed ? "bg-green-600 border-green-600 text-white" : active ? "bg-[#0f4c81] border-[#0f4c81] text-white" : "bg-white border-gray-300 text-gray-500"}`}>

                        {completed ? (
                            <FaCheck className="w-5 h-5" />
                        ) : (
                            index + 1
                        )}
                        </div>

                        {/* Step Title */}
                        <p 
                        className={`mt-3 text-sm font-medium text-center ${completed ? "text-green-600" : active ? "text-[#0f4c81]" : "text-gray-500"}`}
                        >
                            {step}
                        </p>

                        
                    </div>

                    {/* Progress Line */}
                        {index !== steps.length - 1 && (
                            <div className="flex-1 h-1 -mt-5 mx-3 rounded-full bg-gray-200">
                                <div className={`h-full rounded-full transition-all duration-500 ${completed ? "bg-green-600 w-full" : "bg-[#0f5a81] w-0"}`}>

                                </div>
                            </div>
                        )}
                </div>
            )
        })}

      </div>
    </div>
  )
}

export default Stepper
