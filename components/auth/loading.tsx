import { Loader2 } from "lucide-react";
import Image from "next/image";

export const Loading = () => {
    return (
        <main className="flex flex-col w-full h-full items-center justify-center bg-[#2180de]">
            <Image
                src={'/logo-transparent.png'}
                alt="app logo"
                width={200}
                height={200}/>
            <Loader2 className="animate-spin mt-4 text-white" size={30}/> 
        </main>
    )
}
