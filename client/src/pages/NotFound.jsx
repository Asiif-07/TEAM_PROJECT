
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Ghost, Rocket } from 'lucide-react';

const NotFound = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Starfield Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const stars = Array.from({ length: 200 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 2,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        }));

        const animate = () => {
            ctx.fillStyle = 'rgba(17, 24, 39, 0.2)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Movement based on mouse position (parallax)
                const moveX = (mousePosition.x * 0.5) * star.z;
                const moveY = (mousePosition.y * 0.5) * star.z;
                
                star.x += star.speed + moveX * 0.1; 
                
                // Reset stars
                if (star.x > canvas.width) star.x = 0;
                if (star.x < 0) star.x = canvas.width;
                if (star.y > canvas.height) star.y = 0;
                if (star.y < 0) star.y = canvas.height;
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mousePosition]);

    // Mouse Move Handler
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 2 - 1, // -1 to 1
                y: (e.clientY / window.innerHeight) * 2 - 1, // -1 to 1
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 3D Tilt Style
    const tiltStyle = {
        transform: `perspective(1000px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`,
        transition: 'transform 0.1s ease-out'
    };

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative flex items-center justify-center font-sans selection:bg-red-500/30">
            {/* Canvas Starfield */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full z-0 opacity-60"
            />

            {/* Dynamic Background Blobs */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"
                    style={{ transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)` }}
                ></div>
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"
                    style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)` }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"
                ></div>
            </div>

            {/* Main Content Card with 3D Tilt */}
            <div 
                ref={containerRef}
                className="relative z-10 p-12 max-w-5xl w-full mx-4"
                style={tiltStyle}
            >
                <div className="relative z-20 flex flex-col items-center">
                    
                    {/* Animated Icon Container */}
                    <div className="relative group mb-8">
                        <div className="absolute inset-0 bg-red-500/30 rounded-full blur-3xl animate-pulse group-hover:bg-red-500/50 transition-all duration-500"></div>
                        <div className="relative bg-gray-900/40 backdrop-blur-md p-8 rounded-full border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.2)] group-hover:scale-110 transition-transform duration-500 ease-out">
                            <Ghost className="w-32 h-32 text-red-500 animate-[float_3s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" strokeWidth={1} />
                            
                            {/* Orbiting Elements */}
                            <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-red-400 rounded-full shadow-[0_0_10px_#f87171]"></div>
                            </div>
                            <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse] scale-75 opacity-70">
                                <div className="absolute -bottom-4 right-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Glitch 404 Text */}
                    <div className="relative mb-6">
                        <h1 className="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tighter filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse">
                            404
                        </h1>
                        <h1 
                            className="absolute inset-0 text-9xl sm:text-[12rem] font-black text-red-500/40 tracking-tighter mix-blend-overlay animate-[glitch_2s_infinite]"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px)' }}
                        >
                            404
                        </h1>
                        <h1 
                            className="absolute inset-0 text-9xl sm:text-[12rem] font-black text-blue-500/40 tracking-tighter mix-blend-overlay animate-[glitch_2s_infinite_reverse]"
                            style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: 'translate(2px)' }}
                        >
                            404
                        </h1>
                    </div>

                    {/* Typewriter Text */}
                    <div className="h-20 flex items-center justify-center text-center">
                        <p className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-200 via-white to-red-200 animate-fade-in-up leading-relaxed">
                            Houston, we have a problem.
                        </p>
                    </div>

                    <p className="text-gray-400 text-lg max-w-xl text-center mb-12 animate-fade-in-up delay-100">
                        The coordinates you entered led us to this uncharted sector of cyberspace.
                        Engage warp drive to return to the known universe.
                    </p>

                    {/* Interactive Buttons */}
                    <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up delay-200">
                        <Link
                            to="/"
                            className="group relative px-8 py-4 bg-red-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] focus:ring-4 focus:ring-red-500/30"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="relative flex items-center gap-3">
                                <Rocket className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
                                <span>WARP HOME</span>
                            </div>
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </Link>

                        <button 
                            onClick={() => window.history.back()}
                            className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-2 group"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping"></div>
                            <span>ABORT MISSION</span>
                        </button>
                    </div>

                </div>
            </div>
            
            {/* Corner Decor */}
            <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-white/20 rounded-tl-3xl"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-white/20 rounded-br-3xl"></div>
        </div>
    );
};

export default NotFound;
