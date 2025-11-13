"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";

interface RyzuoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RyzuoModal({ isOpen, onClose }: RyzuoModalProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => setShouldRender(false), 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modern 3D Modal with smooth scale animation */}
      <div
        className={`relative bg-gradient-to-br from-bethanz-dark via-bethanz-darker to-bethanz-dark border-2 border-bethanz-red/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl transition-all duration-500 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        style={{
          transform: isOpen 
            ? 'perspective(1200px) rotateX(0deg) translateZ(0) scale(1)' 
            : 'perspective(1200px) rotateX(10deg) translateZ(-50px) scale(0.9)',
          transformStyle: 'preserve-3d',
          boxShadow: isOpen 
            ? '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(200,16,46,0.3)' 
            : '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-bethanz-red/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center" style={{ transform: 'translateZ(30px)' }}>
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-white text-xl md:text-2xl font-semibold">Built By</span>
              <Image
                src="https://files.ryzuo.com/assets/ryzuo/logo/logo.png"
                alt="Ryzuo"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
                unoptimized
              />
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-1">
              Project includes full-stack development
            </p>
            <p className="text-gray-400 text-sm md:text-base">
              Real-time WebSocket integration
            </p>
          </div>

          {/* Button */}
          <div>
            <a
              href="https://www.ryzuo.com/projects/hanzleaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-bethanz-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>More Information</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
