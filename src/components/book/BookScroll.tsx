import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 39;
const FRAME_PREFIX = "/frames/frame-";
const PRIORITY_FRAMES = 5; // Load first 5 frames with high priority

// Image cache for better performance
const imageCache = new Map<number, HTMLImageElement>();

// Load a single image with caching
const loadImage = (index: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Check cache first
    if (imageCache.has(index)) {
      const cached = imageCache.get(index)!;
      if (cached.complete && cached.naturalWidth > 0) {
        resolve(cached);
        return;
      }
    }

    const img = new Image();
    const frameNum = (index + 1).toString().padStart(3, "0");
    img.src = `${FRAME_PREFIX}${frameNum}.jpg`;
    
    img.onload = () => {
      imageCache.set(index, img);
      resolve(img);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load frame: ${frameNum}`);
      reject(new Error(`Failed to load frame ${frameNum}`));
    };
  });
};

// Progressive image loader - loads priority frames first, then rest in background
const useProgressiveImages = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const allImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    // Phase 1: Load priority frames (first few) immediately
    const loadPriorityFrames = async () => {
      const priorityPromises = [];
      for (let i = 0; i < PRIORITY_FRAMES; i++) {
        priorityPromises.push(
          loadImage(i).then((img) => {
            allImages[i] = img;
            loadedCountRef.current++;
            if (isMounted) {
              setLoadProgress((loadedCountRef.current / TOTAL_FRAMES) * 100);
            }
          }).catch(() => {
            loadedCountRef.current++;
          })
        );
      }
      await Promise.all(priorityPromises);
      
      if (isMounted && allImages[0]) {
        setImages([...allImages]);
        setIsReady(true);
      }
    };

    // Phase 2: Load remaining frames in background with idle callback
    const loadRemainingFrames = () => {
      const loadBatch = (startIndex: number) => {
        if (startIndex >= TOTAL_FRAMES || !isMounted) return;

        const batchSize = 3; // Load 3 frames per batch
        const endIndex = Math.min(startIndex + batchSize, TOTAL_FRAMES);
        
        const batchPromises = [];
        for (let i = startIndex; i < endIndex; i++) {
          if (i < PRIORITY_FRAMES) continue; // Skip already loaded priority frames
          
          batchPromises.push(
            loadImage(i).then((img) => {
              allImages[i] = img;
              loadedCountRef.current++;
              if (isMounted) {
                setLoadProgress((loadedCountRef.current / TOTAL_FRAMES) * 100);
                setImages([...allImages]);
              }
            }).catch(() => {
              loadedCountRef.current++;
            })
          );
        }

        Promise.all(batchPromises).then(() => {
          // Use requestIdleCallback for background loading, fallback to setTimeout
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => loadBatch(endIndex), { timeout: 100 });
          } else {
            setTimeout(() => loadBatch(endIndex), 16);
          }
        });
      };

      loadBatch(PRIORITY_FRAMES);
    };

    loadPriorityFrames().then(() => {
      loadRemainingFrames();
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { images, isReady, loadProgress };
};

export function BookScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const { images, isReady, loadProgress } = useProgressiveImages();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Draw frame to canvas with validation
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frameIndex = Math.min(Math.max(0, Math.round(index)), images.length - 1);
    const img = images[frameIndex];
    
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    // Set canvas size to match image aspect ratio
    const dpr = window.devicePixelRatio || 1;
    const containerWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    const containerHeight = canvas.parentElement?.clientHeight || window.innerHeight;
    
    // Calculate dimensions to contain the image
    const imgAspect = img.width / img.height;
    const containerAspect = containerWidth / containerHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspect > containerAspect) {
      // Image is wider - fit to width
      drawWidth = containerWidth;
      drawHeight = containerWidth / imgAspect;
      offsetX = 0;
      offsetY = (containerHeight - drawHeight) / 2;
    } else {
      // Image is taller - fit to height
      drawHeight = containerHeight;
      drawWidth = containerHeight * imgAspect;
      offsetX = (containerWidth - drawWidth) / 2;
      offsetY = 0;
    }
    
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, containerWidth, containerHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // Update canvas on scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const roundedFrame = Math.round(latest);
    setCurrentFrame(roundedFrame);
    drawFrame(roundedFrame);
  });

  // Initial draw and resize handling
  useEffect(() => {
    if (images.length > 0) {
      drawFrame(0);
      
      const handleResize = () => drawFrame(currentFrame);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [images, currentFrame, drawFrame]);

  // Text overlay opacity transforms based on scroll position
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const craftedOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const designedOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  // Show loading state until priority frames are ready
  if (!isReady) {
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
      </div>
    </div>
  );
}
