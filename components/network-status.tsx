"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

export default function NetworkStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    setOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fade-in dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Slide-up bottom bar */}
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-destructive text-white py-2 text-center shadow-lg flex items-center justify-center gap-2"
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 11 }}
          >
            <WifiOff size={20} />
            No Internet Connection
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
