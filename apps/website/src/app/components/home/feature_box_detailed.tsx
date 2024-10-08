import Image from "next/image";

export default function FeatureBoxDetailed({image,heading,list,flip=false}:{image:string,heading:string,list:string[],flip?:boolean}){
    return <>
        <div className="flex flex-row justify-between ">
            {!flip && <div className="relative w-[40%] aspect-[1.2]">
                <Image className="rounded-2xl" fill={true} objectFit="cover" src={image} alt="1"></Image>
            </div>}

            <div className="w-[60%] flex flex-col justify-start items-center">
                <h1 className="text-3xl font-bold items-center">
                    {heading}
                </h1>
                <ul className="mt-10 space-y-8 text-xl text-primaryColor list-disc font-semibold">
                    {list.map((element, index) => {
                        return <li key={index}>{element}</li>
                    })}
                </ul>

            </div>
            {flip && <div className="relative w-[40%] aspect-[1.2]">
                <Image className=" rounded-2xl" fill={true} objectFit="cover" src={image} alt="1"></Image>
            </div>}
        </div>
    </>
}