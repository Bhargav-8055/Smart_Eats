import React, { useState, useEffect } from 'react';

const HeroSlider = ({ currentCity }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            tag: "🔥 Trending Now",
            title: "Craving something",
            highlight: "delicious?",
            description: `Discover the best restaurants and food items in ${currentCity}. Order now and get it delivered fresh!`,
            gradient: "from-orange-600 via-red-600 to-pink-600",
            bgGradient: "from-orange-600 via-red-600 to-pink-600",
            textGradient: "from-orange-600 via-red-600 to-pink-600",
            tagBg: "from-orange-600 to-red-600",
            image: "/hero-food-1.png",
            // Unified warm peach/cream background
            cardBg: "bg-gradient-to-br from-orange-100 via-peach-50 to-amber-50",
            meshGradient: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-200/50 via-amber-100/30 to-transparent",
            orb1Pos: "top-0 right-0",
            orb1Color: "bg-gradient-to-br from-orange-400/60 to-red-400/40",
            orb2Pos: "bottom-0 left-0",
            orb2Color: "bg-gradient-to-tr from-amber-400/50 to-orange-300/40",
            orb3Pos: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            orb3Color: "bg-gradient-to-bl from-red-200/40 to-pink-200/30",
            imageOverlay: "bg-gradient-to-br from-orange-500 to-red-500"
        },
        {
            id: 2,
            tag: "💰 Big Savings",
            title: "Hungry for",
            highlight: "savings?",
            description: "Get up to 50% off on your first order. Terms and conditions apply. Don't miss out!",
            gradient: "from-orange-600 via-red-600 to-pink-600",
            bgGradient: "from-orange-600 via-red-600 to-pink-600",
            textGradient: "from-orange-600 via-red-600 to-pink-600",
            tagBg: "from-orange-600 to-red-600",
            image: "/hero-food-2.png",
            // Unified warm peach/cream background
            cardBg: "bg-gradient-to-br from-orange-100 via-peach-50 to-amber-50",
            meshGradient: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-200/50 via-amber-100/30 to-transparent",
            orb1Pos: "top-0 left-0",
            orb1Color: "bg-gradient-to-br from-orange-400/60 to-red-400/40",
            orb2Pos: "bottom-0 right-0",
            orb2Color: "bg-gradient-to-tr from-amber-400/50 to-orange-300/40",
            orb3Pos: "top-1/3 right-1/3",
            orb3Color: "bg-gradient-to-bl from-red-200/40 to-pink-200/30",
            imageOverlay: "bg-gradient-to-br from-orange-500 to-red-500"
        },
        {
            id: 3,
            tag: "🌙 Late Night",
            title: "Late night",
            highlight: "cravings?",
            description: "We deliver until 3 AM. Satisfy your hunger anytime, anywhere in the city.",
            gradient: "from-orange-600 via-red-600 to-pink-600",
            bgGradient: "from-orange-600 via-red-600 to-pink-600",
            textGradient: "from-orange-600 via-red-600 to-pink-600",
            tagBg: "from-orange-600 to-red-600",
            image: "/hero-food-3.png",
            // Unified warm peach/cream background
            cardBg: "bg-gradient-to-br from-orange-100 via-peach-50 to-amber-50",
            meshGradient: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-200/50 via-amber-100/30 to-transparent",
            orb1Pos: "top-0 right-1/4",
            orb1Color: "bg-gradient-to-br from-orange-400/60 to-red-400/40",
            orb2Pos: "bottom-0 left-1/4",
            orb2Color: "bg-gradient-to-tr from-amber-400/50 to-orange-300/40",
            orb3Pos: "top-2/3 right-1/2",
            orb3Color: "bg-gradient-to-bl from-red-200/40 to-pink-200/30",
            imageOverlay: "bg-gradient-to-br from-orange-500 to-red-500"
        },
        {
            id: 4,
            tag: "🥗 Eat Healthy",
            title: "Eating",
            highlight: "healthy?",
            description: "Explore our curated healthy menu with calorie counts and nutritional information.",
            gradient: "from-orange-600 via-red-600 to-pink-600",
            bgGradient: "from-orange-600 via-red-600 to-pink-600",
            textGradient: "from-orange-600 via-red-600 to-pink-600",
            tagBg: "from-orange-600 to-red-600",
            image: "/hero-food-4.png",
            // Unified warm peach/cream background
            cardBg: "bg-gradient-to-br from-orange-100 via-peach-50 to-amber-50",
            meshGradient: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-200/50 via-amber-100/30 to-transparent",
            orb1Pos: "top-0 left-1/3",
            orb1Color: "bg-gradient-to-br from-orange-400/60 to-red-400/40",
            orb2Pos: "bottom-0 right-1/3",
            orb2Color: "bg-gradient-to-tl from-amber-400/50 to-orange-300/40",
            orb3Pos: "top-1/2 left-1/4",
            orb3Color: "bg-gradient-to-br from-red-200/40 to-pink-200/30",
            imageOverlay: "bg-gradient-to-br from-orange-500 to-red-500"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className='w-full max-w-7xl px-6 mt-8 mb-10 relative z-10'>
            <div className='relative overflow-hidden rounded-3xl shadow-2xl shadow-gray-200/50'>
                <div
                    className='flex transition-transform duration-500 ease-in-out'
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className='w-full flex-shrink-0'>
                            <div className={`bg-gradient-to-r ${slide.bgGradient} p-[2px]`}>
                                <div className={`relative overflow-hidden h-full min-h-[300px] rounded-[calc(1.5rem-2px)] ${slide.cardBg}`}>
                                    {/* Animated gradient orbs - positioned based on slide */}
                                    <div className={`absolute ${slide.orb1Pos} w-96 h-96 ${slide.orb1Color} rounded-full blur-3xl opacity-40 animate-pulse`}></div>
                                    <div className={`absolute ${slide.orb2Pos} w-80 h-80 ${slide.orb2Color} rounded-full blur-3xl opacity-30`}
                                        style={{ animationDelay: '1s' }}></div>
                                    <div className={`absolute ${slide.orb3Pos} w-72 h-72 ${slide.orb3Color} rounded-full blur-2xl opacity-20`}></div>

                                    {/* Mesh gradient overlay */}
                                    <div className={`absolute inset-0 ${slide.meshGradient} opacity-50`}></div>

                                    <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-10'>
                                        {/* Left side - Text content */}
                                        <div>
                                            <div className='inline-block mb-3'>
                                                <span className={`bg-gradient-to-r ${slide.tagBg} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                                                    {slide.tag}
                                                </span>
                                            </div>
                                            <h1 className='text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight drop-shadow-sm'>
                                                {slide.title}
                                                <span className={`block bg-gradient-to-r ${slide.textGradient} bg-clip-text text-transparent`}>
                                                    {slide.highlight}
                                                </span>
                                            </h1>
                                            <p className='text-base text-gray-700 font-medium max-w-2xl drop-shadow-sm'>
                                                {slide.description}
                                            </p>
                                        </div>

                                        {/* Right side - Food image (Unblended) */}
                                        <div className='hidden md:flex justify-center items-center'>
                                            <div className='relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/50'>
                                                <img
                                                    src={slide.image}
                                                    alt={slide.title}
                                                    className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-500'
                                                />
                                                {/* Image overlay gradient - kept subtle as per original design */}
                                                <div className={`absolute inset-0 ${slide.imageOverlay} opacity-20 mix-blend-overlay`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Dots */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20'>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                                ? 'bg-gray-800 w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;
