"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CloudSun, IndianRupee, MessageSquareQuote } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/context/AppProvider';

const NAV_ITEMS = [
  { href: '/', icon: Home, labelEn: 'Home', labelHi: 'होम' },
  { href: '/weather', icon: CloudSun, labelEn: 'Weather', labelHi: 'मौसम' },
  { href: '/prices', icon: IndianRupee, labelEn: 'Prices', labelHi: 'मंडी भाव' },
  { href: '/advisory', icon: MessageSquareQuote, labelEn: 'Advisory', labelHi: 'सलाह' },
];

export function Navigation() {
  const pathname = usePathname();
  const { language } = useAppContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
      <div className="sky-glass-card max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                isActive ? "text-emerald-600 scale-110" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-extrabold tracking-wide">
                {language === 'en' ? item.labelEn : item.labelHi}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
