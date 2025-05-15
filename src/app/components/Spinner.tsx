const Spinner = () => {
  return (
    <div className="flex space-x-1 justify-center items-center">
      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
    </div>
  )
}

export default Spinner