const FeatureBox = ({ icon, heading, summary }: { icon?: React.ReactNode, heading: string, summary: string }) => {
    return (
        <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 border border-slate-100">
            {icon && (
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                {heading}
            </h3>
            <p className="text-slate-600 leading-relaxed">
                {summary}
            </p>
        </div>
    )
}

export default FeatureBox