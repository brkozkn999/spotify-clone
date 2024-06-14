"use client";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "./theme-switcher";
import { UserButton } from "@clerk/clerk-react";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const { theme } = useTheme();

    return (
        <nav className={cn("py-4 shadow-lg", theme === 'dark' ? 'bg-gray-800' : 'bg-white')}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className={cn("font-bold text-xl", theme === 'dark' ? 'text-white' : 'text-black')}>
                    <Image src={theme === 'dark' ? '/logo-transparent.png' : '/logo-transparent-black.png'} alt="app logo" width={60} height={60} className="items-center justify-center flex" />
                </Link>
                <div className="flex items-center gap-5">
                    <ThemeSwitcher />
                    <UserButton />
                </div>
            </div>
        </nav>
    );
};