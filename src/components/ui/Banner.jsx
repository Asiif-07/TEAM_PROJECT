import Button from "./button.jsx";

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

          <Button className="mt-6 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            {buttonText}
          </Button>
        </div>

        {/* Image */}
        <div className="flex-1">
          <img src={image} alt="" className="w-full max-w-md mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default Banner;
