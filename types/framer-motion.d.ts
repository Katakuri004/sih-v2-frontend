import * as React from "react";

declare module "framer-motion" {
  export interface SVGMotionProps extends React.SVGAttributes<SVGElement> {
    initial?: any;
    animate?: any;
    transition?: any;
  }
  
  export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
    initial?: any;
    animate?: any;
    transition?: any;
  }

  export const motion: {
    g: React.ForwardRefExoticComponent<SVGMotionProps>;
    circle: React.ForwardRefExoticComponent<SVGMotionProps>;
    path: React.ForwardRefExoticComponent<SVGMotionProps>;
    div: React.ForwardRefExoticComponent<MotionProps>;
  };

  export function useSpring(value: number | string, config?: any): any;
}

declare global {
  // Intentionally left blank: rely on React's existing JSX.IntrinsicElements
}