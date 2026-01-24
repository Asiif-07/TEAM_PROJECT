function Banner({
  title,
  text,
  image,
  buttonText,
  imageLeft = false,
}) {
  return (
    <div className="mx-auto px-6 py-12" style={{ maxWidth: '1440px', maxHeight: '556.59px' }}>
      <div
        className={`flex flex-col md:flex-row items-center gap-10 h-full ${
          imageLeft ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-3 text-gray-600">
            {text}
          </p>

          <button className="mt-6 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            {buttonText}
          </button>
        </div>

        {/* Image */}
        <div className="flex-1" style={{ position: 'relative' }}>
          <img 
            src={image} 
            alt="" 
            style={{
              width: '574px',
              height: '435.39px',
              position: 'absolute',
              top: '80.59px',
              left: '786px',
              opacity: 1,
              transform: 'rotate(0deg)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
