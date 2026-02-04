import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 40; // Frames 001-040 available in public/frames/
const FRAME_PREFIX = "/frames/frame-";

// Preload all images with proper validation
const preloadImages = (onProgress: (progress: number) => void): Promise<HTMLImageElement[]> => {
  return new Promise((resolve) => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `${FRAME_PREFIX}${frameNum}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        onProgress((loadedCount / TOTAL_FRAMES) * 100);
        if (loadedCount === TOTAL_FRAMES) {
          resolve(images);
        }
      };
      
      img.onerror = () => {
        loadedCount++;
        console.warn(`Failed to load frame: ${frameNum}`);
        onProgress((loadedCount / TOTAL_FRAMES) * 100);
        if (loadedCount === TOTAL_FRAMES) {
          resolve(images);
        }
      };
      
      images.push(img);
    }
  });
};

export function BookScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Performance refs - avoid state updates during scroll
  const pendingFrame = useRef<number>(0);
  const rafId = useRef<number | null>(null);
  const cachedDimensions = useRef({ width: 0, height: 0, dpr: 1 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Cache dimensions on mount and resize
  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;
    
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement.clientWidth || window.innerWidth;
    const height = canvas.parentElement.clientHeight || window.innerHeight;
    
    cachedDimensions.current = { width, height, dpr };
    
    // Update canvas size
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  // Preload images on mount
  useEffect(() => {
    preloadImages((progress) => {
      setLoadProgress(progress);
    }).then((loadedImages) => {
      setImages(loadedImages);
      setIsLoading(false);
    });
  }, []);

  // Optimized draw frame - uses cached dimensions
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frameIdx = Math.min(Math.max(0, Math.round(index)), images.length - 1);
    const img = images[frameIdx];
    
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const { width, height, dpr } = cachedDimensions.current;
    if (width === 0 || height === 0) return;
    
    // Calculate dimensions to contain the image
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = width / height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspect > containerAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgAspect;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // RAF-throttled scroll handler
  useMotionValueEvent(frameIndex, "change", (latest) => {
    pendingFrame.current = latest;
    
    // Cancel any pending RAF to avoid multiple draws per frame
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }
    
    // Schedule single draw for next frame
    rafId.current = requestAnimationFrame(() => {
      drawFrame(pendingFrame.current);
      rafId.current = null;
    });
  });

  // Initial setup and resize handling
  useEffect(() => {
    if (images.length === 0) return;
    
    // Initial dimension calculation and draw
    updateDimensions();
    drawFrame(0);
    
    const handleResize = () => {
      updateDimensions();
      drawFrame(pendingFrame.current);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [images, updateDimensions, drawFrame]);

  // Text overlay opacity transforms based on scroll position
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const craftedOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const designedOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center z-50">
        <div className="relative w-24 h-24">
          <svg className="animate-spin" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${loadProgress * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white/80 text-sm font-medium">
            {Math.round(loadProgress)}%
          </span>
        </div>
        <p className="mt-6 text-white/60 text-sm tracking-widest uppercase">Loading Experience</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative h-[400vh]"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
        />
        
        {/* Text Overlays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Hero Title - 0% scroll */}
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white/90 tracking-tighter">
              JuicyFish.
            </h1>
            <p className="mt-4 text-white/50 text-sm md:text-base tracking-widest uppercase">
              Scroll to explore
            </p>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-8"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/40">
                <path d="M12 5L12 19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>

          {/* Crafted Text - 30% scroll */}
          <motion.div 
            style={{ opacity: craftedOpacity }}
            className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24"
          >
            <div className="max-w-xl">
              <p className="text-white/40 text-sm tracking-widest uppercase mb-4">The Process</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tight leading-none">
                Crafted<br />Page by Page.
              </h2>
              <p className="mt-6 text-white/60 text-lg md:text-xl max-w-md leading-relaxed">
                Every layer serves a purpose. Every detail is intentional.
              </p>
            </div>
          </motion.div>

          {/* Designed Text - 60% scroll */}
          <motion.div 
            style={{ opacity: designedOpacity }}
            className="absolute inset-0 flex items-center justify-end px-8 md:px-16 lg:px-24"
          >
            <div className="max-w-xl text-right">
              <p className="text-white/40 text-sm tracking-widest uppercase mb-4">The Architecture</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tight leading-none">
                Designed from<br />the Inside Out.
              </h2>
              <p className="mt-6 text-white/60 text-lg md:text-xl max-w-md ml-auto leading-relaxed">
                Cover. Spine. Binding. Pages. Each component engineered for excellence.
              </p>
            </div>
          </motion.div>

          {/* CTA - 90% scroll */}
          <motion.div 
            style={{ opacity: ctaOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">The Experience</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white/90 tracking-tighter text-center">
              Read the<br />Difference.
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 px-10 py-4 bg-white text-[#1a1a1a] font-semibold text-lg rounded-full pointer-events-auto hover:bg-white/90 transition-colors"
            >
              Pre-order Now
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 md:w-64">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <div className="flex justify-between mt-2 text-white/40 text-xs tracking-wider">
            <span>START</span>
            <span>END</span>
          </div>
        </div>
      </div>
    </div>
  );
}
