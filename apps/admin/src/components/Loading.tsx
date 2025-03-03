import { useRecoilValue } from "recoil"
import { loadingState } from "../store/atoms/loadingStateAtom"

const Loading = () => {
    const loadingValue = useRecoilValue(loadingState)
    return <>
        <div className="z-[200] fixed flex flex-col  bg-white opacity-80 w-screen h-screen top-0 left-0 ">
            <div className="bg-black flex flex-row justify-center items-center h-screen">
                <p className="text-white ">{loadingValue.value??"Please wait..."}</p>
            </div>
        </div>
    </>
}

export default Loading