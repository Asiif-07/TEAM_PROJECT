export default function WhyChooseSection() {
    return (
      <div className="w-full bg-white">
        <section className="w-full max-w-7xl py-16 md:py-24 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Why Choose{" "}
              <span className="text-blue-600">CurriculumVit.AI</span>
            </h2>
  
            <p className="mt-4 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 font-medium">
              Experience the perfect blend of artificial intelligence and human
              expertise for your career success.
            </p>
  
            {/* Highlight Card */}
            <div className="mt-10 md:mt-16 rounded-[2rem] bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-12 lg:p-16 shadow-sm border border-blue-100">
              
              {/* Card Hero Text */}
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-gray-900 mx-auto max-w-4xl">
                "Combining AI with a Human touch, to create{" "}
                <span className="text-blue-600 block sm:inline">
                  Kick ASS CVS
                </span>
                <span>"</span>
              </h3>
  
              {/* Subtext - Removed fixed padding for responsive flow */}
              <p className="mt-6 text-gray-500 text-sm md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Experience the perfect blend of artificial intelligence and human
                expertise. Our proven process has helped over{" "}
                <span className="font-bold text-gray-800">10,000 professionals</span>{" "}
                accelerate their careers with industry-leading results.
              </p>
  
              {/* 🔥 Responsive Image Container */}
              <div className="mt-12 flex justify-center">
                <div className="bg-gradient-to-r from-blue-100/50 via-white to-blue-100/50 rounded-2xl p-4 md:p-8 w-full max-w-5xl shadow-inner">
                  <div className="relative w-full aspect-video md:aspect-auto flex items-center justify-center">
                    <img
                      src="/src/assets/images/whychooseimg1-removebg-preview.png"
                      alt="Resume preview and career growth"
                      className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </section>
      </div>
    );
  }