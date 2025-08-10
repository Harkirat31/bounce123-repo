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

    return (
        <nav className={`py-4 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : ''}`}>
            <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 group">
                        <Image 
                            className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110" 
                            fill={true} 
                            objectFit="cover" 
                            src="/logo.png" 
                            alt="Ease Your Tasks Logo"
                        />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Ease Your Tasks
                        </h1>
                        <p className="text-sm text-slate-600 font-medium">Easing Logistics</p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <a 
                        href="/" 
                        className="text-slate-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 relative group"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a 
                        href="#usage" 
                        className="text-slate-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 relative group"
                    >
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a 
                        href="#mobile-app" 
                        className="text-slate-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 relative group"
                    >
                        Mobile App
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a 
                        href="#contact" 
                        className="text-slate-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 relative group"
                    >
                        Contact Us
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    
                    <a 
                        target="_blank" 
                        href="https://delivery.easeyourtasks.com" 
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md hover:shadow-glow"
                    >
                        Launch App
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}>
                <div className="pb-4 border-t border-slate-200 pt-4 space-y-4">
                    <a 
                        href="/" 
                        className="block text-slate-700 hover:text-primary-600 font-medium transition-colors py-2 hover:bg-slate-50 rounded-lg px-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </a>
                    <a 
                        href="#usage" 
                        className="block text-slate-700 hover:text-primary-600 font-medium transition-colors py-2 hover:bg-slate-50 rounded-lg px-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Features
                    </a>
                    <a 
                        href="#mobile-app" 
                        className="block text-slate-700 hover:text-primary-600 font-medium transition-colors py-2 hover:bg-slate-50 rounded-lg px-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Mobile App
                    </a>
                    <a 
                        href="#contact" 
                        className="block text-slate-700 hover:text-primary-600 font-medium transition-colors py-2 hover:bg-slate-50 rounded-lg px-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact Us
                    </a>
                    <a 
                        target="_blank" 
                        href="https://delivery.easeyourtasks.com" 
                        className="block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Launch App
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
