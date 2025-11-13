"use client";

export default function FloatingElements() {
  // Complex geometric shapes with varied animations
  const shapes = [
    { left: 10, top: 20, delay: 0, size: 1, duration: 8, type: 'diamond' },
    { left: 85, top: 15, delay: 1.5, size: 1.5, duration: 10, type: 'star' },
    { left: 20, top: 60, delay: 2, size: 0.8, duration: 9, type: 'hexagon' },
    { left: 75, top: 70, delay: 1, size: 1.2, duration: 11, type: 'triangle' },
    { left: 50, top: 30, delay: 0.5, size: 1, duration: 8.5, type: 'pentagon' },
    { left: 30, top: 80, delay: 2.5, size: 0.9, duration: 9.5, type: 'diamond' },
    { left: 90, top: 50, delay: 1.2, size: 1.3, duration: 10.5, type: 'star' },
    { left: 15, top: 45, delay: 3, size: 0.7, duration: 8, type: 'hexagon' },
    { left: 65, top: 25, delay: 0.8, size: 1.1, duration: 9, type: 'triangle' },
    { left: 40, top: 75, delay: 2.2, size: 1, duration: 10, type: 'pentagon' },
    { left: 80, top: 85, delay: 1.8, size: 0.9, duration: 8.5, type: 'diamond' },
    { left: 25, top: 10, delay: 3.5, size: 1.4, duration: 11, type: 'star' },
  ];

  const lines = [
    { left: 5, top: 25, delay: 0, rotation: 45, duration: 12 },
    { left: 95, top: 35, delay: 1.5, rotation: -30, duration: 14 },
    { left: 20, top: 65, delay: 2, rotation: 60, duration: 13 },
    { left: 70, top: 15, delay: 0.8, rotation: -45, duration: 15 },
    { left: 50, top: 80, delay: 2.5, rotation: 30, duration: 12 },
    { left: 85, top: 60, delay: 1.2, rotation: -60, duration: 13 },
  ];

  const particles = [
    { left: 15, top: 20, delay: 0, duration: 10 },
    { left: 35, top: 30, delay: 0.5, duration: 11 },
    { left: 55, top: 40, delay: 1, duration: 9 },
    { left: 75, top: 25, delay: 1.5, duration: 12 },
    { left: 25, top: 60, delay: 2, duration: 10 },
    { left: 45, top: 70, delay: 2.5, duration: 11 },
    { left: 65, top: 50, delay: 3, duration: 9.5 },
    { left: 85, top: 75, delay: 3.5, duration: 10.5 },
  ];

  const renderShape = (shape: any) => {
    const size = shape.size * 20;
    const baseStyle = {
      width: `${size}px`,
      height: `${size}px`,
      animation: `float ${shape.duration}s ease-in-out infinite`,
      animationDelay: `${shape.delay}s`,
      opacity: 0.15 + Math.random() * 0.1,
      transform: 'translateZ(0)',
      filter: 'blur(0.5px)',
    };

    switch (shape.type) {
      case 'diamond':
        return (
          <div
            key={`diamond-${shape.left}-${shape.top}`}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              ...baseStyle,
            }}
          >
            <div
              className="bg-bethanz-red"
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 15px rgba(200, 16, 46, 0.6)',
              }}
            />
          </div>
        );
      case 'star':
        return (
          <div
            key={`star-${shape.left}-${shape.top}`}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              ...baseStyle,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(200, 16, 46, 0.6))' }}
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                className="text-bethanz-red"
              />
            </svg>
          </div>
        );
      case 'hexagon':
        return (
          <div
            key={`hexagon-${shape.left}-${shape.top}`}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              ...baseStyle,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(200, 16, 46, 0.6))' }}
            >
              <path
                d="M12 2L18 6L18 12L12 16L6 12L6 6L12 2Z"
                fill="currentColor"
                className="text-bethanz-red"
              />
            </svg>
          </div>
        );
      case 'triangle':
        return (
          <div
            key={`triangle-${shape.left}-${shape.top}`}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              ...baseStyle,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(200, 16, 46, 0.6))' }}
            >
              <path
                d="M12 2L22 20L2 20L12 2Z"
                fill="currentColor"
                className="text-bethanz-red"
              />
            </svg>
          </div>
        );
      case 'pentagon':
        return (
          <div
            key={`pentagon-${shape.left}-${shape.top}`}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              ...baseStyle,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(200, 16, 46, 0.6))' }}
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                className="text-bethanz-red"
                transform="rotate(36 12 12)"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh',
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        isolation: 'isolate'
      }}
    >
      {/* Complex geometric shapes */}
      {shapes.map((shape, i) => renderShape(shape))}
      
      {/* Animated gradient lines */}
      {lines.map((line, i) => (
        <div
          key={`line-${i}`}
          className="absolute"
          style={{
            left: `${line.left}%`,
            top: `${line.top}%`,
            animation: `float ${line.duration}s ease-in-out infinite`,
            animationDelay: `${line.delay}s`,
            opacity: 0.08 + Math.random() * 0.04,
            transform: `rotate(${line.rotation}deg) translateZ(0)`,
          }}
        >
          <div className="w-32 h-px md:w-64 md:h-px bg-gradient-to-r from-transparent via-bethanz-red to-transparent" style={{ filter: 'blur(1px)' }} />
        </div>
      ))}

      {/* Glowing particles */}
      {particles.map((particle, i) => (
        <div
          key={`particle-${i}`}
          className="absolute"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: 0.3 + Math.random() * 0.2,
            transform: 'translateZ(0)',
          }}
        >
          <div 
            className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-bethanz-red" 
            style={{ 
              boxShadow: '0 0 10px rgba(200, 16, 46, 0.8), 0 0 20px rgba(200, 16, 46, 0.4)',
              filter: 'blur(0.5px)'
            }} 
          />
        </div>
      ))}

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200, 16, 46, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 16, 46, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'float 20s ease-in-out infinite',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}
