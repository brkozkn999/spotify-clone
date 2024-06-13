import { Loader2 } from "lucide-react";
import Image from "next/image";

export const Loading = () => {
    return (
        <main className="flex flex-col w-full h-full items-center justify-center bg-white">
            <Image
                src={'/logo.svg'}
                alt="app logo"
                width={200}
                height={200}/>
            <Loader2 className="animate-spin mt-4" size={30}/> 
        </main>
    )
}
