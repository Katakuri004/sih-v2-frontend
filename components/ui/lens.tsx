import React, { useRef } from "react";
import { motion, MotionValue, useMotionValue, useSpring } from "framer-motion";

export const Lens = ({
  children,
  imageSrc,
  enabled = true
}: {
  children: React.ReactNode;
  imageSrc: string;
  enabled?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;
    x.set(newX);
    y.set(newY);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16/9" }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {children}
        {enabled && (
          <motion.div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundColor: "white",
              x: mouseX,
              y: mouseY,
              translateX: "-50%",
              translateY: "-50%",
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              pointerEvents: "none",
              opacity: 0.9,
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          />
        )}
      </div>
    </div>
  );
};