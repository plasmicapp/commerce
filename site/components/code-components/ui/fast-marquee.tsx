import Marquee from "react-fast-marquee";
import React from "react";
import { useProduct } from "../contexts";

interface ReactFastMarqueeProps {
  className: string;
  children: React.ReactNode;
  gradient?: boolean;
  speed?: number;
  customStyle?: object;
}

export function ReactFastMarquee(props: ReactFastMarqueeProps) {
  const { className, children, gradient, speed, customStyle } = props;
  return (
    <Marquee 
      className={className} 
      gradient={gradient}
      speed={speed}
      style={customStyle}
    >
      {children}
    </Marquee>
  );
}