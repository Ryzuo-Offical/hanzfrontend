"use client";

import { useState } from "react";
import Image from "next/image";
import RyzuoModal from "./modals/RyzuoModal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
          <footer className="glass border-t border-bethanz-red/20 mt-20 relative bg-bethanz-dark/20 animate-fade-in-up" style={{ animationDelay: '0.8s', opacity: 0, backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)', background: 'rgba(26, 26, 26, 0.5)', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <Image 
              src="/bethanz-logo.png" 
              alt="BETHANZ" 
              width={200} 
              height={60}
              className="object-contain h-10 md:h-12 w-auto mx-auto"
            />
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto text-center mb-6 md:mb-8 px-2">
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              WE DO NOT TAKE RESPONSIBILITY FOR ANY LOSSES FROM GAMBLING NOR DO
              WE ENCOURAGE BETTING WHICH ARE LINKED OR PROMOTED ON OUR WEBSITES.
              AS A PLAYER, YOU ARE RESPONSIBLE FOR YOUR BETS.
            </p>
          </div>

          {/* Copyright and Watermark */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                © COPYRIGHT {currentYear} BETHANZ
              </p>
            </div>
            <div className="text-center md:text-right">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center md:justify-end gap-2 text-gray-500 hover:text-bethanz-red text-xs transition-colors cursor-pointer"
              >
                <span>Built By</span>
                <Image
                  src="https://files.ryzuo.com/assets/ryzuo/logo/logo.png"
                  alt="Ryzuo"
                  width={80}
                  height={27}
                  className="h-5 w-auto object-contain"
                  unoptimized
                />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <RyzuoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
