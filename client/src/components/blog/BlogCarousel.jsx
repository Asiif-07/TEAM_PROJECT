import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogCarousel = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [images, nextSlide]);

    if (!images || images.length === 0) return null;

    return (
        <div className="relative group w-full aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl border border-white/20">
            {/* Background Grain/Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            {/* Images */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                        }`}
                >
                    <img
                        src={img.secure_url || img}
                        alt={`Slide ${index}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
            ))}

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl glass flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl glass flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${index === currentIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogCarousel;
