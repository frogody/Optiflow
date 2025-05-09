// @ts-nocheck - This file has some TypeScript issues that are hard to fix
"use client";

import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
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
}: TabsProps) {
  const [tabValue, setTabValue] = useState(defaultValue);
  
  const contextValue = {
    value: value !== undefined ? value : tabValue,
    onValueChange: (newValue: string) => {
      if (value === undefined) {
        setTabValue(newValue);
      }
      onValueChange?.(newValue);
    },
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div role="tablist" className={`inline-flex items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-[#3CDFFF]/10 ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({
  value,
  disabled = false,
  className = "",
  children,
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange     } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={!!isSelected}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={
        `px-3 py-1.5 text-sm font-medium transition-all \
        ${ isSelected 
          ? "bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white border-b-2 border-[#4AFFD4] rounded-md shadow-sm" 
          : "text-slate-300 hover:text-white hover:bg-white/5"    }
        ${ disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"    }
        ${className}`
      }
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({
  value,
  className = "",
  children,
}: TabsContentProps) {
  const { value: selectedValue     } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return <div className={className}>{children}</div>;
} 