"use client";

import {
  TrendingUp,
  Award,
  PlayCircle,
  Brain,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const features = [
    {
      icon: PlayCircle,
      title: "Paper Trading",
      description: "Practice with virtual money in real-time market conditions",
    },
    {
      icon: Brain,
      title: "Interactive Learning",
      description: "Learn through engaging games, quizzes, and simulations",
    },
    {
      icon: Award,
      title: "Gamified Experience",
      description:
        "Earn badges and rewards as you master stock market concepts",
    },
    {
      icon: BarChart3,
      title: "Real-time Data",
      description: "Track Indian stocks, mutual funds, and market insights",
    },
  ];

  return (
    <div className="relative mx-auto w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Main heading */}
          <div className="mb-8 flex items-center gap-3">
            <h1 className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
              INVESTORY
            </h1>
          </div>

          {/* Subheading */}
          <h2 className="mb-6 text-2xl font-semibold md:text-3xl lg:text-4xl">
            Master the Stock Market Through
            <span className="block text-orange-400"> Play & Practice</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-3xl text-base text-gray-300 md:text-lg lg:text-xl">
            An interactive platform designed to teach stock market concepts
            through engaging games, paper trading simulations, and reward-based
            learning. Perfect your skills risk-free before investing real funds.
          </p>

          <div className="mb-16 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/play"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/50"
            >
              <PlayCircle className="h-5 w-5" />
              Start Learning
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-gray-800/70"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <div className="rounded-full bg-orange-500/10 p-3 group-hover:bg-orange-500/20">
                      <Icon className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
