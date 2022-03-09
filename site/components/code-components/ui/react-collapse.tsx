import { Collapse } from "@components/ui";
import React from "react";

interface ReactCollapseProps {
  className: string;
  children: React.ReactNode;
  title: string;
  isActive?: boolean;
}

export function ReactCollapse(props: ReactCollapseProps) {
  const { children, title, className, isActive } = props;
  return (
    <Collapse 
      title={title}
      className={className}
      initialIsActive={isActive}
      key={JSON.stringify({title, isActive})}
    >
      {children}
    </Collapse>
  );
}