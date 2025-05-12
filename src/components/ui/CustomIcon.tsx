"use client";

import { IconBaseProps } from "react-icons";
import { IconType } from "react-icons";

interface CustomIconProps extends IconBaseProps {
  icon: IconType;
}

/**
 * Custom icon component that doesn't rely on IconContext.Provider
 * This helps avoid hydration issues with react-icons in Next.js
 */
export const CustomIcon: React.FC<CustomIconProps & React.HTMLProps<SVGElement>> = ({
  icon: Icon,
  size = "1.5em",
  ...props
}) => <Icon size={size} {...props} />;

export default CustomIcon; 