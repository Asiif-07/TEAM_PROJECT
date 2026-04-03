
const Vector = () => {
  const cards = [
    { title: "Instant Support", desc: "Get immediate answer to your career questions" },
    { title: "Video Call", desc: "Speak Directly with our AI assistant" },
    { title: "Full Transcript", desc: "All Conversation are Record and transcribed" }
  ];

  return (
    <section 
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#050816] text-white px-6 py-20 overflow-hidden"
      style={{
        backgroundImage: `url('/src/assets/images/vectorbg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Header Section */}
      <div className="text-center max-w-3xl z-10 mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center">
             {/* Phone Icon */}
            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12  stroke-current stroke-2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          24/7 AI Career Assistant
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
          Have Questions about your CV? Need career Advice? Our AI assistant is <br className="hidden md:block" /> 
          available around the clock to Provide instant support and guidance.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10 mb-12">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white/2 rounded-2xl p-6 text-center transition-all hover:bg-white/20"
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Call Button */}
      <div className="z-10 w-full max-w-sm">
        <button className="w-full bg-[#007bff] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-500/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call Now: 1-800-AI-CAREER
        </button>
      </div>
    </section>
  );
};

export default Vector;