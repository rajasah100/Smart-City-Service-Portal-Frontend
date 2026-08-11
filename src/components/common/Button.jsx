const Button = ({ props }) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={`h-10 rounded-md text-white ${props.bg} w-25 hover:bg-[#4a6c8f]/20 cursor-pointer`}
    >
      {props.text}
    </button>
  )
}

export default Button