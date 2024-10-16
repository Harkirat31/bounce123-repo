const FeatureBox = ({ heading, summary }: { heading: string, summary: string }) => {
    return <>
        <div className="flex flex-col border-2 border-primaryColor p-3 md:p-6 rounded-lg text-primaryColor w-[95%]">
            <h1 className="text-base sm:text-lg md:text-xl font-bold py-0.5 md:py-1">{heading}</h1>
            <h2 className="text-xs sm:text-sm md:text-lg">{summary}</h2>
        </div>

    </>
}

export default FeatureBox