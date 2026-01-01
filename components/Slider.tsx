import React, { useState, useEffect, useCallback } from 'react';
import type { PageSection } from '../types';

interface SliderProps {
    section: PageSection;
}

const Slider: React.FC<SliderProps> = ({ section }) => {
    const images = section.sliderImages || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const interval = (section.sliderInterval || 5) * 1000;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    useEffect(() => {
        if (images.length <= 1 || isHovered) return;

        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [images.length, interval, nextSlide, isHovered]);

    if (images.length === 0) return null;

    return (
        <div
            className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${currentIndex * 100}%)`, direction: 'ltr' }}
            >
                {[...images].reverse().map((slide, index) => (
                    <div key={slide.id} className="min-w-full h-full relative">
                        <img
                            src={slide.url}
                            alt={slide.caption || ''}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: slide.imagePosition || 'center center' }}
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Caption */}
                        {slide.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-white text-xl md:text-3xl font-bold drop-shadow-lg max-w-4xl mx-auto line-clamp-2">
                                    {slide.caption}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 z-20"
                        aria-label="Previous Slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 z-20"
                        aria-label="Next Slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Slider;
