"use client";

import { useEffect, useRef, useState } from "react";
import { Ellipsis } from "lucide-react";

type ActionMenuItem = {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
};

type ActionMenuProps = {
  ariaLabel: string;
  items: ActionMenuItem[];
  menuWidthClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
};

const itemVariantClassNames: Record<NonNullable<ActionMenuItem["variant"]>, string> =
  {
    default:
      "text-foreground hover:bg-muted",
    destructive:
      "text-red hover:bg-red/5",
  };

export function ActionMenu({
  ariaLabel,
  items,
  menuWidthClassName = "w-40",
  menuClassName = "rounded-xl",
  itemClassName = "px-5 py-2 text-md",
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative ml-auto" ref={menuRef}>
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Ellipsis />
      </button>
      {isOpen && (
        <div
          className={`absolute top-full right-0 z-20 mt-4 overflow-hidden bg-card text-card-foreground ring-1 ring-foreground/10 shadow-xl shadow-black/10 dark:shadow-black/30 ${menuWidthClassName} ${menuClassName}`}
        >
          {items.map((item, index) => (
            <div key={item.label}>
              <button
                type="button"
                className={`flex w-full cursor-pointer items-center text-left transition-colors ${itemClassName} ${itemVariantClassNames[item.variant ?? "default"]}`}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
              >
                {item.label}
              </button>
              {index < items.length - 1 && <div className="mx-4 h-px bg-border" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
