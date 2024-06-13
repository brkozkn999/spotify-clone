import { Button } from "@/components/ui/button";
import { UploadArea } from "@/components/upload-area";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
}
from "@/components/ui/dialog"

export const AddSongModal = () => {
    return (
        <div className="fixed bottom-15 right-8">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default" className="rounded-full w-[60px] h-[60px] text-4xl text-white hover:scale-110 transition-all">
                        +
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-0">
                    <UploadArea />
                </DialogContent>
            </Dialog>
        </div>
    );
};