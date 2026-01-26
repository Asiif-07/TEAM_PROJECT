export default function WhyChooseSection() {
    return (
        <section className="w-full max-w-[1268px] bg-white py-20 px-6">
            <div className="mx-auto max-w-[1237px] text-center">
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                    Why Choose{" "}
                    <span className="text-blue-600 font-bold">CurriculumVit.AI</span>
                </h2>

                <p className="mt-4 mx-auto max-w-[576px] font-inter text-[18px] leading-8 text-">
                    Experience the perfect blend of artificial intelligence and human
                    expertise for your career success.
                </p>


                {/* Highlight Card */}
                <div className="mt-12 max-w-[1268px] rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-10 shadow-sm">
    
                <h1 className="text-1xl max-w-[1080px] md:text-4xl font-bold leading-tight text-gray-900">
        "Combining AI with a Human touch, to create{" "}
        <span className="text-blue-600">
          Kick ASS CVS
        </span>
        <span>"</span>
        
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-gray-500 text-[20px] md:text-lg max-w-[983px] px-[60px] mx-auto">
        Experience the perfect blend of artificial intelligence and human
        expertise. Our proven process has helped over{" "}
        <span className="font-semibold text-gray-700">10,000 professionals</span>{" "}
        accelerate their careers with industry-leading results.
      </p>



                    {/* 🔥 Visual Image on Gradient */}
                    <div className="mt-10 flex justify-center">
                        <div className="bg-linear-to-r from-blue-100 via-blue-50 to-blue-100 rounded-xl p-6">
                            <div className="mx-auto w-full max-w-[1080px] min-h-[203px]">
                                <img
                                    src="/src/assets/images/whychooseimg1-removebg-preview.png"
                                    alt="Resume preview and career growth"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}
