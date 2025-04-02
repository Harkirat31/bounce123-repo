import Image from "next/image";
import Link from "next/link";

export default function FeatureBoxDetailed({ image, heading, list, flip = false, isAppBox = false }: { image: string, heading: string, list: string[], flip?: boolean, isAppBox?: boolean }) {
    return <>
        <div className="flex flex-col lg:flex-row justify-around items-center lg:h-[375px] xl:h-[450px]">
            {!flip && <div className="hidden lg:block h-full">
                <ImageSection image={image}></ImageSection>
            </div>
            }

            <div className={`h-full w-full flex overflow-scroll flex-col  bg-gray-100 px-10 py-4 ${flip ? "lg:mr-10" : "lg:ml-10"}`}>
                <h1 className="text-black text-xl md:text-lg lg:text-2xl xl:text-3xl font-bold ">
                    {heading}
                </h1>
                <div className="mt-4 w-full lg:hidden">
                    <ImageSection image={image}></ImageSection>
                </div>
                <ul className="w-full ml-4 mt-10 space-y-5 xl:space-y-8 text-xs sm:text-sm md:text-base text-black/65 list-disc font-semibold">
                    {list.map((element, index) => {
                        return <li key={index}>{element}</li>
                    })}
                </ul>
                {isAppBox && <div className="flex-1 flex flex-row justify-start items-center mt-5 lg:mt-0">

                    <div className="relative h-20 w-44  ">
                        <Link target="_blank" href={"https://apps.apple.com/us/app/deliveries-for-drivers/id6670413689"}>
                            <Image className="" fill={true} objectFit="contain" src={"/download_badges/app_store.svg"} alt="mobile_app_ios"></Image>
                        </Link>

                    </div>
                    <div className="relative h-20 w-44 ml-10 lg:ml-20 ">
                        <Link target="_blank" href={"https://drive.google.com/drive/folders/1eM2BMhvQkBVBzPxe9uV-GTNooLO0jdP2"}>
                            <Image className="" fill={true} objectFit="contain" src={"/download_badges/play_store.png"} alt="play_store_ios"></Image>
                        </Link>

                    </div>
                </div>}

            </div>
            {flip && <div className="hidden lg:block lg:h-full">
                <ImageSection image={image}></ImageSection>
            </div>
            }
        </div>
    </>
}

const ImageSection = ({ image }: { image: string }) => {
    return <>
        <div className="relative  h-full lg:w-auto aspect-[1.2]">
            <Image className="" fill={true} objectFit="fill" src={image} alt="1"></Image>
        </div>
    </>
}