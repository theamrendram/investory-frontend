"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { GlowingStarsBackgroundCard } from "../components/ui/glowing-stars";


const faqs = [
    {
        question: "What is Investory?",
        answer:
            "Investory is an interactive platform designed to teach stock market concepts through engaging games, paper trading simulations, and reward-based learning with badges.",
    },
    {
        question: "How does paper trading work on Investory?",
        answer:
            "Paper trading allows you to practice investing with virtual money in real-time market conditions, helping you gain confidence before investing real funds.",
    },
    
    {
        question: "Can I track my progress?",
        answer:
            "Yes! Investory provides a dashboard where you can monitor your learning progress, achievements, and performance in games and simulations.",
    },
    {
        question: "Is there any cost to use Investory?",
        answer:
            "Investory offers free access to basic features, with premium plans available for advanced tools and exclusive content.",
    },
];

export default function FAQS() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <section className="bg-primary text-neutral-200 py-12" id="faq">
            <GlowingStarsBackgroundCard className="relative">
                <div className="absolute flex flex-col items-center justify-center inset-0 rounded-lg z-[999]">
                <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
                    Frequently Asked Questions
                </h2>   
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            layout
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-black rounded-lg p-6 cursor-pointer"
                            onClick={() => toggleFAQ(index)}
                        >
                            <motion.div
                                className="flex justify-between items-center "
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                            >
                                <h3 className="text-lg md:text-xl font-semibold">{faq.question}</h3>
                                <motion.span
                                    className="text-pink-500"
                                    animate={{
                                        rotate: activeIndex === index ? 45 : 0,
                                    }}
                                >
                                    +
                                </motion.span>
                            </motion.div>

                            {activeIndex === index && (
                                <motion.p
                                    key="faq-answer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="mt-4 text-neutral-400"
                                >
                                    {faq.answer}
                                </motion.p>
                            )}
                        </motion.div>
                    ))}
                </div>
                </div>
                </GlowingStarsBackgroundCard>
        </section>
    );
}
