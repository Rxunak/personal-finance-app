"use client";

import React from "react";
import { PanelLeftOpen } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

export default function MobileNavigation() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="md:hidden cursor-pointer bg-beige-100 p-2">
      <div className="bg-white rounded-2xl h-12 w-12 flex justify-center items-center mt-6">
        <PanelLeftOpen
          onClick={toggleSidebar}
          className="size-8 hover:rotate-180 transition duration-800"
        />
      </div>
    </div>
  );
}
