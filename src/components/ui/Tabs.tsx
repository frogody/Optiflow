/**
 * Tabs component that implements the WAI-ARIA Tabs Pattern.
 * TabsTrigger components must be direct children of TabsList for proper ARIA functionality.
 * 
 * @example
 * <Tabs defaultValue="tab1">
 *   <TabsList aria-label="Tabs example">
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */

"use client";

import React, { createContext, useContext, useState, forwardRef, useId } from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className = "", children, "aria-label": ariaLabel, ...props }, ref) {
    const { baseId } = useTabsContext();
    return (
      <div 
        ref={ref}
        role="tablist"
        id={`${baseId}-tablist`}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-[#3CDFFF]/10 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  'data-tabs-trigger'?: string;
  'aria-controls'?: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, disabled = false, className = "", children, ...props }, ref) {
    const { value: selectedValue, onValueChange, baseId } = useTabsContext();
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${baseId}-tab-${value}`}
        aria-controls={`${baseId}-panel-${value}`}
        aria-selected={isSelected ? "true" : "false"}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        className={
          `px-3 py-1.5 text-sm font-medium transition-all \
          ${isSelected 
            ? "bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white border-b-2 border-[#4AFFD4] rounded-md shadow-sm" 
            : "text-slate-300 hover:text-white hover:bg-white/5"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}`
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, className = "", children, ...props }, ref) {
    const { value: selectedValue, baseId } = useTabsContext();
    const isSelected = selectedValue === value;
    const panelId = `${baseId}-panel-${value}`;
    const tabId = `${baseId}-tab-${value}`;

    if (!isSelected) return null;

    return (
      <div 
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className = "",
  children,
  ...props
}: TabsProps) {
  const [tabValue, setTabValue] = useState(defaultValue);
  const baseId = useId();
  
  const contextValue = {
    value: value !== undefined ? value : tabValue,
    onValueChange: (newValue: string) => {
      if (value === undefined) {
        setTabValue(newValue);
      }
      onValueChange?.(newValue);
    },
    baseId,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
} 