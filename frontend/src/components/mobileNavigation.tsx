"use client";

import React from "react";
import { PanelLeftOpen } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

export default function MobileNavigation() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="md:hidden cursor-pointer">
      <PanelLeftOpen onClick={toggleSidebar} />
    </div>
  );
}
