const Loading = () => {
    return <>
        <div className="fixed flex flex-col z-50  bg-white opacity-70 w-screen h-screen top-0 left-0 ">
            <div className="bg-black flex flex-row justify-center items-center h-screen">
                <p className="text-white ">Please Wait ...</p>
            </div>
        </div>
    </>
}

export default Loading