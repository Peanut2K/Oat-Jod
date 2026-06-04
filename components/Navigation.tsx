"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, BarChart2, Settings } from "lucide-react";
import { useLang } from "./LanguageContext";
import clsx from "clsx";

const navItems = [
  { href: "/", icon: Home, key: "home" },
  { href: "/record", icon: PlusCircle, key: "record" },
  { href: "/reports", icon: BarChart2, key: "reports" },
  { href: "/settings", icon: Settings, key: "settings" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active ? "text-green-600" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon
                size={22}
                className={active ? "text-green-600" : "text-gray-400"}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {t(key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
