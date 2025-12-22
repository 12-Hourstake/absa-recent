import { useState, useEffect, useCallback } from "react";
import "./css/BackgroundSlider.css";

interface BackgroundSliderProps {
  images: string[];
  interval?: number;
  transitionDuration?: number;
}

const BackgroundSlider = ({
  images,
  interval = 5000,
  transitionDuration = 1000,
}: BackgroundSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    }
  }, [images.length, isTransitioning, transitionDuration]);

  useEffect(() => {
    // Auto-advance slides
    const timer = setInterval(nextSlide, interval);
    
    return () => clearInterval(timer);
  }, [nextSlide, interval]);

  // Preload next image for smooth transitions
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    const img = new Image();
    img.src = images[nextIndex];
  }, [currentIndex, images]);

  return (
    <div className="background-slider">
      {images.map((image, index) => {
        const isActive = index === currentIndex;
        const isPrev = index === (currentIndex - 1 + images.length) % images.length;
        
        return (
          <div
            key={index}
            className={`slider-image ${isActive ? "active" : ""} ${isPrev ? "prev" : ""}`}
            style={{
              backgroundImage: `url(${image})`,
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateX(0)" : "translateX(-100%)",
            }}
            aria-hidden={!isActive}
          />
        );
      })}
    </div>
  );
};

export default BackgroundSlider;
