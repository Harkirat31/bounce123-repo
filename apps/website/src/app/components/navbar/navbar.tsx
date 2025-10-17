"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => {
        console.log('Mobile menu toggled:', !isMenuOpen)
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className={`py-3 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-section border-b border-slate-100' : ''}`}>
            <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 group">
                        <Image 
                            className="rounded-xl shadow-card transition-transform duration-300 group-hover:scale-110" 
                            fill={true} 
                            objectFit="cover" 
                            src="/logo.png" 
                            alt="Ease Your Tasks Logo"
                        />
                    </div>
                    <div className="block sm:block">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600">
                            Ease Your Tasks
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">Easing Logistics</p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <a 
                        href="/" 
                        className="text-slate-700 hover:text-primary-600 font-bold transition-all duration-200 hover:scale-105 relative group"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a 
                        href="#usage" 
                        className="text-slate-700 hover:text-primary-600 font-bold transition-all duration-200 hover:scale-105 relative group"
                    >
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a 
                        href="#mobile-app" 
                        className="text-slate-700 hover:text-primary-600 font-bold transition-all duration-200 hover:scale-105 relative group"
                    >
                        Mobile App
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a 
                        href="#contact" 
                        className="text-slate-700 hover:text-primary-600 font-bold transition-all duration-200 hover:scale-105 relative group"
                    >
                        Contact Us
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    
                    <a 
                        target="_blank" 
                        href="https://delivery.easeyourtasks.com" 
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-button-hover hover:scale-105 transition-all duration-200 shadow-button"
                    >
                        Launch App
                    </a>
                </div>

                {/* Mobile Menu Button - Always visible on mobile */}
                <div className="block md:hidden">
                    <button
                        className="p-3 rounded-lg hover:bg-slate-100 transition-colors bg-white shadow-lg border-2 border-slate-300 hover:border-primary-400 min-w-[48px] min-h-[48px] flex items-center justify-center"
                        onClick={toggleMenu}
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMenuOpen}
                        type="button"
                    >
                        {isMenuOpen ? (
                            <FaTimes className="w-6 h-6 text-slate-700" />
                        ) : (
                            <FaBars className="w-6 h-6 text-slate-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Improved visibility and animation */}
            {isMenuOpen && (
                <div className="block md:hidden mt-4 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="py-4 space-y-2">
                        <a 
                            href="/" 
                            className="block text-slate-700 hover:text-primary-600 font-bold transition-colors py-3 px-4 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </a>
                        <a 
                            href="#usage" 
                            className="block text-slate-700 hover:text-primary-600 font-bold transition-colors py-3 px-4 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Features
                        </a>
                        <a 
                            href="#mobile-app" 
                            className="block text-slate-700 hover:text-primary-600 font-bold transition-colors py-3 px-4 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Mobile App
                        </a>
                        <a 
                            href="#contact" 
                            className="block text-slate-700 hover:text-primary-600 font-bold transition-colors py-3 px-4 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact Us
                        </a>
                        <div className="px-4 py-3">
                            <a 
                                target="_blank" 
                                href="https://delivery.easeyourtasks.com" 
                                className="block w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-button-hover transition-all duration-200 shadow-button"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Launch App
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
