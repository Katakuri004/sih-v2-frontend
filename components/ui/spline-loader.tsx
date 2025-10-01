"use client";

import { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";

interface SplineLoaderProps {
  children: React.ReactNode;
}

export default function SplineLoader({ children }: SplineLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("metro-mind-visited");
    const firstVisit = !hasVisited;
    setIsFirstVisit(firstVisit);

    // Mark as visited
    if (firstVisit) {
      localStorage.setItem("metro-mind-visited", "true");
    }

    // Hardcoded timing: 1 loop (8 seconds) for first visit, 3 seconds for reloads
    const loadingTime = firstVisit ? 8000 : 3000;

    // Set loading timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    // Clean up timer
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
            }}
          >
            {/* 3D Spline Scene Container */}
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
              <div className="absolute inset-0 w-full h-full">
                <Spline
                  scene="https://prod.spline.design/LWkULIRVw5jp23zy/scene.splinecode"
                  style={{ width: "100%", height: "100%" }}
                  onLoad={() => {
                    console.log("Spline scene loaded successfully");
                    setSplineLoaded(true);
                  }}
                  onError={(error) => {
                    console.error("Spline scene failed to load:", error);
                    // Continue loading even if Spline fails
                    setSplineLoaded(true);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content */}
      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        {children}
      </div>
    </>
  );
}
