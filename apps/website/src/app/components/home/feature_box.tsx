const FeatureBox = ({ icon, heading, summary }: { icon?: React.ReactNode, heading: string, summary: string }) => {
    return (
        <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 border border-slate-100 hover:border-primary-200">
            {icon && (
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-card">
                    {icon}
                </div>
            )}
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors duration-300">
                {heading}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {summary}
            </p>
        </div>
    )
}

export default FeatureBox