const FeatureBox = ({ heading, summary }: { heading: string, summary: string }) => {
    return <>
        <div className="flex flex-col border-2 border-primaryColor p-6 rounded-lg text-primaryColor w-[300px]">
            <h1 className="text-xl font-bold py-2">{heading}</h1>
            <h2 className="text-lg">{summary}</h2>
        </div>

    </>
}

export default FeatureBox