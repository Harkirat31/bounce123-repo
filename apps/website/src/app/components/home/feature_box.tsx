const FeatureBox = ({ heading, summary }: { heading: string, summary: string }) => {
    return <>
        <div className="flex flex-col border-t-4 border-primaryColor text-primaryColor w-[95%]">
            <h1 className="text-base sm:text-lg mt-1 md:mt-2 lg:mt-4 md:text-xl font-bold py-0.5 md:py-1">{heading}</h1>
            <h2 className="text-xs sm:text-sm md:text-lg mt-2">{summary}</h2>
        </div>

    </>
}

export default FeatureBox