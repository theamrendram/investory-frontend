"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardClaimModalProps {
  show: boolean;
  onClose: () => void;
}

export default function RewardClaimModal({
  show,
  onClose,
}: RewardClaimModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-sm text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Reward Claimed!</h2>
              <p className="text-sm text-muted-foreground">
                Congratulations on earning your reward.
              </p>
              <Button className="mt-4 w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
