import Image from "next/image";

export default function FeatureBoxDetailed({image,heading,list,flip=false}:{image:string,heading:string,list:string[],flip?:boolean}){
    return <>
        <div className="flex flex-col lg:flex-row justify-around items-center ">
            {!flip && <div className="hidden w-full lg:block sm:w-[250px] md:w-[400px] lg:w-[450px] xl:w-[550px]">
                <ImageSection image={image}></ImageSection> 
                </div>
            }

            <div className="w-[85%] sm:w-[75%] lg:w-auto flex flex-col justify-center items-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold items-center">
                    {heading}
                </h1>
                <div className="mt-4 w-full lg:hidden">
                <ImageSection image={image}></ImageSection>
                </div>
                <ul className=" w-full ml-4 mt-10 space-y-8 text-xs sm:text-sm md:text-lg text-primaryColor list-disc font-semibold">
                    {list.map((element, index) => {
                        return <li key={index}>{element}</li>
                    })}     
                </ul>

            </div>
            {flip && <div className="hidden w-full lg:block sm:w-[250px] md:w-[400px] lg:w-[450px] xl:w-[550px]">
                <ImageSection image={image}></ImageSection> 
                </div>
            }
        </div>
    </>
}

const ImageSection = ({image}:{image:string})=>{
    return <>
    <div className="relative w-full aspect-[1.2]">
                <Image className=" rounded-2xl" fill={true} objectFit="cover" src={image} alt="1"></Image>
            </div>
    </>
}