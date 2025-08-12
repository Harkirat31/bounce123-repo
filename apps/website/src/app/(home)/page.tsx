import Image from "next/image"
import { FaArrowRight, FaMapMarkedAlt, FaRoute, FaRocket, FaMobileAlt, FaCheckCircle } from "react-icons/fa"
import FeatureBox from "../components/home/feature_box"
import FeatureBoxDetailed from "../components/home/feature_box_detailed"
import { map_view_list, mobile_app_list, route_drawing_list } from "../constants/home_constants"

const Home = () => {
    return (    
        <div className="space-y-8 sm:space-y-12 px-2 sm:px-4 lg:px-8">
            {/* Hero Section */}
            <section className="pt-8 sm:pt-12 pb-4 sm:pb-6 relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float shadow-elegant"></div>
                    <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-200 rounded-full opacity-20 animate-float-delayed shadow-elegant"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent-200 rounded-full opacity-20 animate-float-more-delayed shadow-elegant"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                    {/* Hero Content */}
                    <div className="space-y-6 sm:space-y-8">
                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
                                    Manage Your Deliveries
                                </span>
                                <br />
                                <span className="text-slate-800">with Confidence</span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl">
                                Streamline your delivery operations with smart route optimization, 
                                real-time tracking, and comprehensive logistics management.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <a 
                                target="_blank" 
                                href="https://delivery.easeyourtasks.com"
                                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-button-hover hover:scale-105 transition-all duration-200 shadow-button text-sm sm:text-base"
                            >
                                Get Started
                                <FaArrowRight className="ml-2" />
                            </a>
                            <a 
                                href="#usage"
                                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white hover:shadow-button transition-all duration-200 text-sm sm:text-base"
                            >
                                Learn More
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-3 sm:pt-4">
                            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-card">
                                <FaCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm text-slate-600 font-medium">Smart Routing</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-card">
                                <FaCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm text-slate-600 font-medium">Real-time</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-card">
                                <FaCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm text-slate-600 font-medium">Secure</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Video */}
                    <div className="relative">
                        <div className="relative w-full max-w-4xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                            <div className="relative bg-white rounded-3xl shadow-image overflow-hidden">
                                <video 
                                    poster="/home/thumbnail.png" 
                                    muted 
                                    playsInline 
                                    controls 
                                    preload="none" 
                                    className="w-full h-auto rounded-3xl"
                                >
                                    <source src="/home/demo_route_generations.mp4" type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section id="usage" className="py-8 sm:py-10">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
                        Powerful Features for Modern Logistics
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                        Everything you need to optimize your delivery operations and boost efficiency
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    <FeatureBox
                        icon={<FaMapMarkedAlt className="w-8 h-8" />}
                        heading="Map View"
                        summary="Populate deliveries over the map to get the visual representation of delivery orders at a glance"
                    />

                    <FeatureBox
                        icon={<FaRoute className="w-8 h-8" />}
                        heading="Draw Routes"
                        summary="Draw paths or routes over the map to segregate different delivery areas for drivers"
                    />

                    <FeatureBox
                        icon={<FaRocket className="w-8 h-8" />}
                        heading="Optimize Deliveries"
                        summary="Generate optimized routes for drivers with smart algorithms"
                    />

                    <FeatureBox
                        icon={<FaMobileAlt className="w-8 h-8" />}
                        heading="Drivers App"
                        summary="Mobile application for drivers to see and plan their schedule for deliveries"
                    />
                </div>
            </section>

            {/* Detailed Features Section */}
            <section className="py-8 sm:py-10">
                <FeatureBoxDetailed
                    heading="Map View, Draw Routes, Optimize deliveries for better route planning"
                    image="/home/3.png"
                    list={map_view_list}
                />
            </section>

            {/* Mobile App Section */}
            <section id="mobile-app" className="py-8 sm:py-10">
                <FeatureBoxDetailed
                    heading="Mobile Application For Drivers"
                    image="/home/mobile_app.png"
                    list={mobile_app_list}
                    flip={true}
                    isAppBox={true}
                />
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="py-8 sm:py-10">
                <div className="bg-white rounded-3xl shadow-section p-6 sm:p-8 lg:p-12 border border-slate-100">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                            Have questions about our delivery management platform? Feel free to reach out to us.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* Location */}
                        <div className="flex items-start space-x-3 sm:space-x-4 group">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0 shadow-card group-hover:shadow-card-hover transition-all duration-300">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl shadow-card flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">Our Location</h3>
                                <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
                                    83 Galaxy Blvd Unit 40<br />
                                    Etobicoke, ON<br />
                                    M9W 5X6
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-3 sm:space-x-4 group">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0 shadow-card group-hover:shadow-card-hover transition-all duration-300">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl shadow-card flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">Email Us</h3>
                                <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 font-medium">
                                    For any inquiries or questions, please email us at:
                                </p>
                                <a 
                                    href="mailto:info@easeyourtasks.com" 
                                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-button-hover hover:scale-105 transition-all duration-200 shadow-button text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@easeyourtasks.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-8 sm:py-10 text-center">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden shadow-section">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                            Ready to Transform Your Delivery Operations?
                        </h2>
                        <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Ready to transform your logistics operations?
                        </p>
                        <a 
                            target="_blank" 
                            href="https://delivery.easeyourtasks.com"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-button-hover hover:scale-105 transition-all duration-200 shadow-button text-sm sm:text-base"
                        >
                            Start Free Trial
                            <FaArrowRight className="ml-2" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
