import React from "react"
import {Search, PieChart, Bell, User, CreditCard, ChevronDown} from "lucide-react";

const Navbar = () => {
    return (
        <nav className="bg-[#0D1321] text-white px-6 py-3 flex items-center justify-between h-16 w-full">
            {/* Logo section */}
            <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">Project</div>
            </div>
            {/* Search bar */}
            <div className="flex-grow mx-8">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search stocks, MFs, smallcases & more" 
                        className="w-full bg-[#1A2A3A] text-white px-4 py-2 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                    />
                </div>
            </div>

                    

            <div className="flex items-center space-x-4">
                {/* CHANGE: Added More dropdown and adjusted icons */}
                <button className="flex items-center space-x-1 hover:text-green-500">
                    <PieChart size={20} />
                    <span>Portfolio</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-green-500">
                    <CreditCard size={20} />
                    <span>Credit</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-green-500">
                    <span>More</span>
                    <ChevronDown size={16} />
                </button>
                <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200">
                    Sign Up / Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
