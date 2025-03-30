import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SpinWheel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "";
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [blinkSegment, setBlinkSegment] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinDuration = 4; // seconds

  useEffect(() => {
    if (!name) {
      navigate("/");
      return;
    }
    
    startSpin();
  }, [name, navigate]);

  // Start blinking effect after spin completes
  useEffect(() => {
    if (showResult) {
      const blinkInterval = setInterval(() => {
        setBlinkSegment(prev => !prev);
      }, 500); // Blink every 500ms
      
      return () => clearInterval(blinkInterval);
    }
  }, [showResult]);

  const startSpin = () => {
    setSpinning(true);
    setShowResult(false);
    setBlinkSegment(false);
    
    const nameLength = name.length;
    const isEven = nameLength % 2 === 0;
    
    // Select from even or odd numbers based on name length
    const possibleStops = isEven ? [2, 4, 6, 8] : [1, 3, 5, 7];
    const chosenNumber = possibleStops[Math.floor(Math.random() * possibleStops.length)];
    setResult(chosenNumber);
    
    // Calculate the final position
    // Each section is 45 degrees (360 / 8)
    // For a bottom marker (270 degrees from top), we need to align differently
    // We add additional rotation to ensure the wheel stops with the chosen number at bottom (270 degrees)
    const segmentAngle = 360 / 8;
    const bottomPosition = 270; // 270 degrees is bottom
    
    // Calculate required rotation to place the segment at the bottom marker
    // We need to align the center of the segment with the bottom marker
    const finalPosition = (chosenNumber - 1) * segmentAngle + segmentAngle / 2;
    // Calculate how much to rotate so that finalPosition ends at the bottom
    const rotationToBottom = (bottomPosition - finalPosition + 360) % 360;
    
    // Add multiple full rotations for effect
    const fullSpins = 5 * 360; // 5 full rotations
    const totalRotation = fullSpins + rotationToBottom;
    
    setRotation(totalRotation);
    
    // Show the result after the spin animation completes
    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);
    }, spinDuration * 1000); // Matches the duration of spin animation
  };

  const wheelSegments = 8;
  const segmentAngle = 360 / wheelSegments;
  const segments = Array.from({ length: wheelSegments }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 overflow-hidden"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">🎯 Spin the Wheel!</h1>
        <p className="text-xl text-white/80">Good luck, {name}!</p>
      </motion.div>

      {/* Wheel Container */}
      <div className="relative mb-8">
        {/* Bottom Center Marker */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-red-500 filter drop-shadow-lg"></div>
        </div>

        {/* Wheel Background */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          className="relative"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/5 backdrop-filter backdrop-blur-sm border-4 border-white/20 shadow-2xl flex items-center justify-center">
            {/* Spinning Wheel */}
            <motion.div
              ref={wheelRef}
              animate={{ rotate: rotation }}
              transition={{ 
                duration: spinDuration,
                ease: [0.17, 0.67, 0.38, 0.98],
                type: "tween"
              }}
              className="w-full h-full rounded-full overflow-hidden relative"
            >
              {/* Wheel Segments */}
              {segments.map((segment, i) => {
                const isEven = i % 2 === 0;
                const angle = i * segmentAngle;
                const isWinningSegment = showResult && segment === result;
                
                return (
                  <div
                    key={segment}
                    className={`absolute w-full h-full transition-colors duration-300 ${
                      isEven ? 'bg-blue-500/90' : 'bg-indigo-500/90'
                    } ${isWinningSegment && blinkSegment ? 'bg-yellow-400' : ''}`}
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(Math.PI * angle / 180)}% ${50 + 50 * Math.sin(Math.PI * angle / 180)}%, ${50 + 50 * Math.cos(Math.PI * (angle + segmentAngle) / 180)}% ${50 + 50 * Math.sin(Math.PI * (angle + segmentAngle) / 180)}%)`,
                    }}
                  >
                    <div 
                      className={`absolute font-bold text-xl md:text-2xl ${isWinningSegment && blinkSegment ? 'text-black' : 'text-white'}`}
                      style={{
                        left: `${50 + 35 * Math.cos(Math.PI * (angle + segmentAngle/2) / 180)}%`,
                        top: `${50 + 35 * Math.sin(Math.PI * (angle + segmentAngle/2) / 180)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {segment}
                    </div>
                  </div>
                );
              })}
              
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-300 shadow-inner"></div>
            </motion.div>
            
            {/* Fixed Center Top Marker (doesn't rotate with wheel) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="relative w-16 h-16">
                {/* Marker Arrow pointing to top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="h-8 w-4 bg-red-500 rounded-t-full"></div>
                </div>
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Result Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showResult ? 1 : 0, 
          y: showResult ? 0 : 20 
        }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {showResult && result !== null && (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              🎉 You landed on {result}!
            </h2>
            <p className="text-xl text-white/80">
              {(result % 2 === 0) ? 
                "That's an even number!" : 
                "That's an odd number!"}
            </p>
          </>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          disabled={spinning}
          className={`px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all ${
            spinning
              ? "bg-blue-400/50 text-white/50 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {spinning ? "Spinning..." : "Spin Again"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SpinWheel;