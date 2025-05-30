import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './App_iPhone.css';

const SlideToUnlock = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [position, setPosition] = useState(0);
    const sliderRef = useRef(null);
    const [sliderWidth, setSliderWidth] = useState(0);
    const handleWidth = 32; // Width of the handle in pixels (w-8 in Tailwind)
    const containerPadding = 10; // Total padding (5px + 5px)

    // Transformation states if you plan on using them
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const isScreenVertical = window.innerHeight > window.innerWidth;

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    );
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useLayoutEffect(() => {
        const updateWidth = () => {
            if (sliderRef.current) {
                setSliderWidth(sliderRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Calculate the maximum position the slider handle can move to
    const maxPosition = sliderWidth - containerPadding - handleWidth;

    const handleDrag = (event, info) => {
        let newPosition = position + info.delta.x;
        newPosition = Math.max(0, Math.min(newPosition, maxPosition));
        setPosition(newPosition);
        const progress = (newPosition / maxPosition) * 100;
        setProgressPercentage(progress);
    };

    const handleDragEnd = () => {
        if (progressPercentage < 80) {
            setPosition(0);
            setProgressPercentage(0);
        } else {
            setPosition(maxPosition);
            setProgressPercentage(100);
            setIsUnlocked(true);
            window.location.href = 'https://store.bw8d.com/collections/all';
        }
    };

    // Listen for the pageshow event to reset state when coming back from bfcache
    useEffect(() => {
        const handlePageShow = (event) => {
            // Optionally, check event.persisted if you only want to reset on cached pages
            if (event.persisted) {
                setPosition(0);
                setProgressPercentage(0);
                setIsUnlocked(false);
            }
            // Alternatively, you can reset unconditionally:
            // setPosition(0);
            // setProgressPercentage(0);
            // setIsUnlocked(false);
        };

        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    return (
        // This wrapper will define the boundaries for the image and slider
        <div className="h-screen flex justify-center items-center">
            <div
                className="relative"
                style={{
                    height: isScreenVertical ? '737px' :window.innerHeight, // set this to your image's height
                    width: isScreenVertical ? '430px' : '500px', // set this to your image's width

                    overflow: 'hidden', // ensures that any overflow (slider) is hidden
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center',
                    paddingBottom: isScreenVertical ? 80 : 0,
                }}
            >
                <img
                    src="/images/borndifferent_screen_no_text.png"
                    alt="iPhone Screen"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        // paddingBottom: 30,
                    }}
                    draggable="false"
                />

                {/* Clock display overlay */}
                <div
                    style={{
                        fontSize: '52px',
                        position: 'absolute',
                        top: isScreenVertical ? '202px' : '242px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#fff',
                        textShadow: '0px 0px 8px rgba(0,0,0,0.8)',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'top',
                    }}
                >
                    {currentTime}
                </div>
                <div
                    style={{
                        fontSize: '11px',
                        position: 'absolute',
                        top: isScreenVertical ? '267px' : '307px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#fff',
                        textShadow: '0px 0px 8px rgba(0,0,0,0.8)',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'top',
                    }}
                >
                    {currentDate}
                </div>

                {/* Position the slider absolutely relative to the wrapper */}
                <div
                    className="absolute"
                    style={{
                        bottom: isScreenVertical ? '155px' : '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        paddingBottom: 62,
                    }}
                >
                    <div
                        className="w-44 h-10.5 bg-gray-300 relative"
                        ref={sliderRef}
                        style={{ padding: 5, borderRadius: '10px' }}
                    >
                        <div
                            className="gradient-text absolute inset-0 flex items-center justify-center text-gray-700 font-bold text-lg pointer-events-none"
                            style={{ paddingLeft: 15 }}
                        >
                            Slide to shop
                        </div>
                        {sliderWidth > 0 && (
                            <motion.div
                                className="w-8 h-8 bg-white shadow-md cursor-pointer flex items-center justify-center z-10"
                                drag="x"
                                dragConstraints={{ left: 0, right: maxPosition }}
                                dragElastic={0}
                                onDrag={handleDrag}
                                onDragEnd={handleDragEnd}
                                animate={{ x: position }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    borderRadius: '6px',
                                    willChange: 'transform',
                                    touchAction: 'none',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    WebkitTouchCallout: 'none',
                                }}
                            >
                                <img
                                    src="/images/arrow.svg"
                                    alt="Arrow"
                                    className="w-4 h-4 pointer-events-none select-none"
                                    draggable="false"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideToUnlock;
