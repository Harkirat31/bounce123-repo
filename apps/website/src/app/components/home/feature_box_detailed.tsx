import Image from "next/image";
import Link from "next/link";

export default function FeatureBoxDetailed({ image, heading, list, flip = false, isAppBox = false }: { image: string, heading: string, list: string[], flip?: boolean, isAppBox?: boolean }) {
    return (
        <div className="bg-white rounded-3xl shadow-section overflow-hidden border border-slate-100">
            <div className={`flex flex-col lg:flex-row ${flip ? 'lg:flex-row-reverse' : ''} items-center`}>
                {/* Image Section */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
                    <div className="relative w-full max-w-md mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl blur-2xl opacity-30"></div>
                        <div className="relative bg-white rounded-3xl shadow-image overflow-hidden border border-slate-100">
                            <Image 
                                className="w-full h-auto object-cover" 
                                width={500} 
                                height={400} 
                                src={image} 
                                alt="Feature demonstration"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="space-y-6 sm:space-y-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                            {heading}
                        </h2>
                        
                        <ul className="space-y-4 sm:space-y-5">
                            {list.map((element, index) => (
                                <li key={index} className="flex items-start space-x-3 sm:space-x-4 group">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2 flex-shrink-0 shadow-card"></div>
                                    <span className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium group-hover:text-slate-800 transition-colors duration-200">
                                        {element}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {isAppBox && (
                            <div className="pt-6 sm:pt-8">
                                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 font-medium">Download the mobile app:</p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <Link 
                                        target="_blank" 
                                        href="https://apps.apple.com/us/app/deliveries-for-drivers/id6670413689"
                                        className="group"
                                    >
                                        <div className="relative h-14 sm:h-16 w-40 sm:w-44 transition-transform duration-200 group-hover:scale-105 shadow-card hover:shadow-card-hover">
                                            <Image 
                                                className="w-full h-full object-contain" 
                                                fill={true} 
                                                src="/download_badges/app_store.svg" 
                                                alt="Download on App Store"
                                            />
                                        </div>
                                    </Link>
                                    
                                    <Link 
                                        target="_blank" 
                                        href="https://drive.google.com/drive/folders/1eM2BMhvQkBVBzPxe9uV-GTNooLO0jdP2"
                                        className="group"
                                    >
                                        <div className="relative h-14 sm:h-16 w-40 sm:w-44 transition-transform duration-200 group-hover:scale-105 shadow-card hover:shadow-card-hover">
                                            <Image 
                                                className="w-full h-full object-contain" 
                                                fill={true} 
                                                src="/download_badges/play_store.png" 
                                                alt="Download on Google Play"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}