import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NameInput: React.FC = () => {
  const [name, setName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonDisabled(name.trim() === "");
  }, [name]);

  const handleSubmit = () => {
    if (name.trim() !== "") {
      navigate(`/spin-wheel?name=${encodeURIComponent(name)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      handleSubmit();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-2">🎡 Spin It!</h1>
          <p className="text-white/80 mb-8">Enter your name to try your luck</p>
        </motion.div>

        <div className="space-y-6">
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your name here..."
              className="w-full px-6 py-4 text-lg bg-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/70 border-2 border-white/30"
            />
          </div>

          <motion.button
            whileHover={{ scale: isButtonDisabled ? 1 : 1.05 }}
            whileTap={{ scale: isButtonDisabled ? 1 : 0.95 }}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className={`w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 ${
              isButtonDisabled
                ? "bg-yellow-400/50 text-gray-600/50 cursor-not-allowed"
                : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
            }`}
          >
            Start Spinning
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NameInput;
