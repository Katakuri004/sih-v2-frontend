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
  const [loadingType, setLoadingType] = useState<
    "initial" | "refresh" | "force"
  >("initial");
  const [isBackgroundCompiling, setIsBackgroundCompiling] = useState(false);

  // Real page compilation/preloading function
  const startBackgroundCompilation = (immediate = false) => {
    setIsBackgroundCompiling(true);
    const startMessage = immediate
      ? "🚀 Starting immediate page compilation..."
      : "🔄 Starting background page compilation...";
    console.log(startMessage);

    // Mark compilation as active in session storage
    sessionStorage.setItem("compilation-active", "true");
    sessionStorage.setItem("compilation-start-time", Date.now().toString());

    // Get current page path
    const currentPath = window.location.pathname;

    // ALL available pages - COMPILE EVERYTHING DURING ANIMATION
    const allPages = [
      { path: "/", name: "Dashboard" },
      { path: "/metro-map", name: "Metro Map Interactive" },
      { path: "/analytics", name: "Analytics Dashboard" },
      { path: "/fleet-shadow", name: "Digital Fleet Shadow" },
      { path: "/maintenance", name: "Maintenance Hub" },
      { path: "/induction-review", name: "Induction Review" },
      { path: "/branding-monitor", name: "Branding Monitor" },
      { path: "/reports", name: "Reports Dashboard" },
    ];

    // Smart compilation order: current page first, then others
    const getCurrentPagePriority = () => {
      const currentPage = allPages.find((page) => page.path === currentPath);
      const otherPages = allPages.filter((page) => page.path !== currentPath);

      if (currentPage) {
        return [currentPage, ...otherPages];
      } else {
        // If current path not found, prioritize dashboard for first-time visitors
        const dashboard = allPages.find((page) => page.path === "/");
        const remaining = allPages.filter((page) => page.path !== "/");
        return dashboard ? [dashboard, ...remaining] : allPages;
      }
    };

    const pagesToCompile = getCurrentPagePriority();
    console.log(
      `📋 Compilation order: Current page (${currentPath}) first, then remaining pages`
    );

    let taskIndex = 0;
    const compileNextPage = async () => {
      if (taskIndex < pagesToCompile.length) {
        const page = pagesToCompile[taskIndex];
        const isCurrentPage = page.path === currentPath;
        const priority = isCurrentPage ? "🎯 PRIORITY" : "📦";

        console.log(
          `${priority} Preloading ${page.name}${
            isCurrentPage ? " (Current Page)" : ""
          }...`
        );

        try {
          // Preload the page by creating a link element
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = page.path;
          document.head.appendChild(link);

          // Also preload critical resources for each page using Next.js 15 patterns
          const criticalResources = [];

          // Add CSS resources (these are more likely to exist)
          criticalResources.push(
            "/_next/static/css/app/globals.css"
          );

          // Page-specific resources
          if (page.path === "/fleet-shadow") {
            // Only preload Spline for fleet-shadow page
            criticalResources.push(
              "https://prod.spline.design/LWkULIRVw5jp23zy/scene.splinecode"
            );
          }

          // Preload critical resources with better error handling
          criticalResources.forEach((resource) => {
            try {
              const resourceLink = document.createElement("link");
              
              // Use different strategies based on resource type
              if (resource.includes("spline.design")) {
                resourceLink.rel = "preconnect";
                resourceLink.href = "https://prod.spline.design";
              } else if (resource.endsWith(".js")) {
                resourceLink.rel = "modulepreload";
                resourceLink.href = resource;
              } else {
                resourceLink.rel = "prefetch";
                resourceLink.href = resource;
              }
              
              // Add error handling
              resourceLink.onerror = () => {
                console.warn(`Failed to preload resource: ${resource}`);
              };
              
              document.head.appendChild(resourceLink);
            } catch (error) {
              console.warn(`Failed to create preload link for: ${resource}`, error);
            }
          });

          // Simulate processing time for each page
          await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (error) {
          console.warn(`⚠️ Failed to preload ${page.name}:`, error);
        }

        taskIndex++;
        compileNextPage();
      } else {
        setIsBackgroundCompiling(false);
        sessionStorage.removeItem("compilation-active");
        sessionStorage.removeItem("compilation-start-time");
        console.log("✅ All pages preloaded successfully!");
      }
    };

    // Start the compilation process
    compileNextPage();

    // Return a cleanup function
    return () => {
      setIsBackgroundCompiling(false);
      sessionStorage.removeItem("compilation-active");
      sessionStorage.removeItem("compilation-start-time");
    };
  };

  useEffect(() => {
    // Add debugging
    console.log("🔄 SplineLoader useEffect triggered");
    
    // Check if we've already compiled in this session
    const sessionCompiled = sessionStorage.getItem(
      "metro-mind-session-compiled"
    );
    console.log("Session compiled flag:", sessionCompiled);
    
    if (sessionCompiled === "true") {
      // Already compiled in this session, skip loading screen
      console.log("✅ Session already compiled, skipping loader");
      setIsLoading(false);
      return;
    }

    // Get last visit timestamp and refresh count
    const lastVisit = localStorage.getItem("metro-mind-last-visit");
    const refreshCount =
      sessionStorage.getItem("metro-mind-refresh-count") || "0";
    const currentTime = Date.now();

    let isInitialLoad = false;
    let isForceReload = false;
    let currentRefreshCount = parseInt(refreshCount);

    // Check if this is initial load (first visit or > 10 minutes since last visit)
    if (!lastVisit || currentTime - parseInt(lastVisit) > 10 * 60 * 1000) {
      isInitialLoad = true;
      setLoadingType("initial");
      // Reset refresh count on initial load
      sessionStorage.setItem("metro-mind-refresh-count", "0");
    } else {
      // This is a refresh within 10 minutes
      currentRefreshCount += 1;
      sessionStorage.setItem(
        "metro-mind-refresh-count",
        currentRefreshCount.toString()
      );

      // Check for triple refresh (3 times simultaneously)
      if (currentRefreshCount >= 3) {
        isForceReload = true;
        setLoadingType("force");
        // Reset count after force reload
        sessionStorage.setItem("metro-mind-refresh-count", "0");
      } else {
        setLoadingType("refresh");
      }
    }

    // Update last visit timestamp
    localStorage.setItem("metro-mind-last-visit", currentTime.toString());

    // Determine loading duration based on type
    let loadingTime: number;
    if (isInitialLoad || isForceReload) {
      loadingTime = 8000; // 8 seconds for initial load or force reload
    } else {
      loadingTime = 3000; // 3 seconds for regular refresh
    }

    console.log(`🎯 Loading type: ${loadingType}, Duration: ${loadingTime}ms`);

    // Start compilation immediately for ALL loads (initial, refresh, force)
    let compilationCleanup: (() => void) | null = null;
    try {
      compilationCleanup = startBackgroundCompilation(true);
      console.log("✅ Background compilation started successfully");
    } catch (error) {
      console.error("❌ Failed to start background compilation:", error);
    }

    // Set loading timer
    const timer = setTimeout(() => {
      console.log("⏰ Loading timer completed, hiding loading screen");
      setIsLoading(false);
      // Mark that we've compiled in this session
      sessionStorage.setItem("metro-mind-session-compiled", "true");
      console.log("✅ Session marked as compiled");
    }, loadingTime);

    // Clear session flag on page unload (refresh/close)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("metro-mind-session-compiled");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up timer and compilation if component unmounts
    return () => {
      console.log("🧹 Cleaning up SplineLoader effects");
      clearTimeout(timer);
      if (compilationCleanup) {
        compilationCleanup();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Ensure compilation persists across component lifecycle
  useEffect(() => {
    // Check if there's an ongoing compilation that should continue
    const compilationStartTime = sessionStorage.getItem(
      "compilation-start-time"
    );
    const isCompilationActive =
      sessionStorage.getItem("compilation-active") === "true";

    if (isCompilationActive && compilationStartTime) {
      const elapsed = Date.now() - parseInt(compilationStartTime);
      const totalCompilationTime = 8 * 800; // 8 tasks * 800ms each

      if (elapsed < totalCompilationTime) {
        // Compilation should still be running
        setIsBackgroundCompiling(true);
        console.log("🔄 Resuming background compilation...");

        // Calculate remaining tasks
        const completedTasks = Math.floor(elapsed / 800);
        const remainingTasks = 8 - completedTasks;

        if (remainingTasks > 0) {
          // Use same smart prioritization for resume
          const currentPath = window.location.pathname;
          const allPages = [
            { path: "/", name: "Dashboard" },
            { path: "/metro-map", name: "Metro Map Interactive" },
            { path: "/analytics", name: "Analytics Dashboard" },
            { path: "/fleet-shadow", name: "Digital Fleet Shadow" },
            { path: "/maintenance", name: "Maintenance Hub" },
            { path: "/induction-review", name: "Induction Review" },
            { path: "/branding-monitor", name: "Branding Monitor" },
            { path: "/reports", name: "Reports Dashboard" },
          ];

          const getCurrentPagePriority = () => {
            const currentPage = allPages.find(
              (page) => page.path === currentPath
            );
            const otherPages = allPages.filter(
              (page) => page.path !== currentPath
            );

            if (currentPage) {
              return [currentPage, ...otherPages];
            } else {
              const dashboard = allPages.find((page) => page.path === "/");
              const remaining = allPages.filter((page) => page.path !== "/");
              return dashboard ? [dashboard, ...remaining] : allPages;
            }
          };

          const pagesToCompile = getCurrentPagePriority();
          console.log(
            `🔄 Resuming compilation with current page (${currentPath}) priority`
          );

          let taskIndex = completedTasks;
          const resumeCompilation = async () => {
            while (taskIndex < pagesToCompile.length) {
              const page = pagesToCompile[taskIndex];
              const isCurrentPage = page.path === currentPath;
              const priority = isCurrentPage ? "🎯 PRIORITY" : "📦";

              console.log(
                `${priority} Resuming preload of ${page.name}${
                  isCurrentPage ? " (Current Page)" : ""
                }...`
              );

              try {
                const link = document.createElement("link");
                link.rel = "prefetch";
                link.href = page.path;
                document.head.appendChild(link);

                await new Promise((resolve) => setTimeout(resolve, 800));
              } catch (error) {
                console.warn(`⚠️ Failed to preload ${page.name}:`, error);
              }

              taskIndex++;
            }

            setIsBackgroundCompiling(false);
            sessionStorage.removeItem("compilation-active");
            sessionStorage.removeItem("compilation-start-time");
            console.log("✅ Background compilation resumed and completed!");
          };

          resumeCompilation();
        }
      } else {
        // Compilation should be done
        sessionStorage.removeItem("compilation-active");
        sessionStorage.removeItem("compilation-start-time");
      }
    }
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
                    console.log("✅ Spline scene loaded successfully");
                    setSplineLoaded(true);
                  }}
                  onError={(error) => {
                    console.warn("⚠️ Spline scene failed to load, using fallback:", error);
                    // Continue loading even if Spline fails
                    setSplineLoaded(true);
                  }}
                />
              </div>
              
              {/* Fallback loading indicator if Spline fails */}
              {!splineLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-foreground">Loading MetroMind AI...</p>
                    <p className="text-sm text-muted-foreground mt-2">Preparing your experience</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Compilation Indicator */}
      <AnimatePresence>
        {isBackgroundCompiling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-lg px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Compiling pages...</span>
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
