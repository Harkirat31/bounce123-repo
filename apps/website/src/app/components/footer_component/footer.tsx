const Footer = () => {
    return (
        <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Brand Section */}
                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                        Ease Your Tasks
                    </h1>
                    <p className="text-slate-600 font-medium">Easing Logistics</p>
                </div>

                {/* Contact Section */}
                <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-lg">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a 
                            href="mailto:info@easeyourtasks.com" 
                            className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            info@easeyourtasks.com
                        </a>
                    </div>
                </div>

                {/* Social Links */}
                <div className="text-center md:text-right">
                    <div className="flex justify-center md:justify-end space-x-4">
                        <a 
                            href="https://delivery.easeyourtasks.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-primary-600 transition-colors"
                        >
                            <span className="sr-only">Web App</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-sm">
                    © 2024 Ease Your Tasks. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer
