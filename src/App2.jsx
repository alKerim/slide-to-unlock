import { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const SlideToUnlock = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [position, setPosition] = useState(0); // Track slider position in pixels
    const sliderRef = useRef(null);
    const [sliderWidth, setSliderWidth] = useState(0);

    useLayoutEffect(() => {
        const updateWidth = () => {
            if (sliderRef.current) {
                const width = sliderRef.current.offsetWidth;
                setSliderWidth(width);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleDrag = (event, info) => {
        // Calculate new position based on the previous position and delta
        let newPosition = position + info.delta.x;

        // Clamp the new position to be between 0 and (sliderWidth - handleWidth)
        newPosition = Math.max(0, Math.min(newPosition, sliderWidth - 70));
        setPosition(newPosition);

        // Calculate progress percentage
        const progress = (newPosition / (sliderWidth - 70)) * 100;
        setProgressPercentage(progress);
    };

    const handleDragEnd = () => {
        // If less than 80% of the slider is completed, snap back to start
        if (progressPercentage < 80) {
            setPosition(0);
            setProgressPercentage(0);
        } else {
            // Otherwise, snap forward to complete 100% and mark as unlocked
            setPosition(sliderWidth - 70);
            setProgressPercentage(100);
            setIsUnlocked(true);

            // Wait 0.5 seconds and navigate to the link
            setTimeout(() => {
                window.location.href = 'https://store.bw8d.com/collections/all';
            }, 0);
        }
    };

    return (
        <div className="flex items-end justify-center h-screen bg-gray-100" style={{padding: 50, paddingBottom: 130}}>
            <div
                className="w-96 h-16 bg-gray-300 relative"
                ref={sliderRef}
                style={{padding: 5, borderRadius: '12px'}}
            >
                <div
                    className="gradient-text absolute inset-0 flex items-center justify-center text-gray-700 font-bold text-lg pointer-events-none">
                    {isUnlocked ? 'Unlocked!' : `slide to unlock`}
                </div>
                {!isUnlocked && sliderWidth > 0 && (
                    <motion.div
                        className="w-14 h-14 bg-white shadow-md cursor-pointer flex items-center justify-center z-10"
                        drag="x"
                        dragConstraints={{left: 0, right: sliderWidth - 70}} // backup constraints
                        dragElastic={0}  // prevent over-dragging
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        // Bind the x position to our state and animate it with spring physics
                        animate={{x: position}}
                        transition={{type: 'spring', stiffness: 300, damping: 30}}
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.95}}
                        style={{
                            borderRadius: '12px',
                            willChange: 'transform',
                            touchAction: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            WebkitTouchCallout: 'none'
                        }}
                    >
                        <img
                            src="/images/arrow.svg"
                            alt="Arrow"
                            className="w-6 h-6 text-gray-700 pointer-events-none select-none"
                            draggable="false"
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SlideToUnlock;
