import { useState, useEffect, useRef } from 'react';

const IOSSlider = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
    const sliderRef = useRef(null);
    const startX = useRef(0);
    const sliderWidth = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            if (sliderRef.current) {
                sliderWidth.current = sliderRef.current.offsetWidth;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleStart = (clientX) => {
        setIsDragging(true);
        startX.current = clientX;
    };

    const handleMove = (clientX) => {
        if (!isDragging) return;

        let newPosition = clientX - startX.current;
        newPosition = Math.max(0, Math.min(newPosition, sliderWidth.current * 0.8));
        setSliderPosition(newPosition);

        if (newPosition >= sliderWidth.current * 0.7) {
            setIsUnlocked(true);
            setIsDragging(false);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        setSliderPosition(0);
    };

    return (
        <div className="fixed bottom-0 w-full flex justify-center items-end h-32 bg-gradient-to-t from-gray-100 to-transparent">
            <div className="max-w-sm w-full px-4 pb-4 relative" ref={sliderRef}>
                <div className="relative bg-gray-300 rounded-full h-14">
                    <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                            isUnlocked ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                        style={{ width: `${sliderPosition}px` }}
                    />
                    <div
                        className={`absolute top-0 left-0 h-14 w-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            isDragging ? 'scale-110' : 'scale-100'
                        } ${isUnlocked ? 'bg-green-500' : 'bg-white'}`}
                        style={{ transform: `translateX(${sliderPosition}px)` }}
                        onMouseDown={(e) => handleStart(e.clientX)}
                        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                        onMouseMove={(e) => handleMove(e.clientX)}
                        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                        onMouseUp={handleEnd}
                        onTouchEnd={handleEnd}
                        onMouseLeave={handleEnd}
                    >
                        <svg
                            className={`w-6 h-6 transition-colors ${isUnlocked ? 'text-white' : 'text-gray-400'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium pointer-events-none">
            {isUnlocked ? 'Unlocked' : 'slide to unlock'}
          </span>
                </div>
            </div>
        </div>
    );
};

export default IOSSlider;