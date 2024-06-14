"use client";
import { useMutation } from "convex/react";
import { UploadDropzone, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import "@xixixao/uploadstuff/react/styles.css";

export function UploadArea() {
    const [songId, setSongId] = useState<Id<"files"> | null>(null);
    const [title, setTitle] = useState<string>("");

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveSongStorageId = useMutation(api.files.saveSongStorageId);
    const saveSongAfterUpload = async (uploaded: UploadFileResponse[]) => {
        if (title === "") {
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            return;
        };
        const id = await saveSongStorageId({ songStorageId: (uploaded[0].response as any).storageId, title });
        setSongId(id);
        setTitle("");
        toast({
            description: "Your song uploaded successfully!",
        })
    };

    const saveImageStorageId = useMutation(api.files.saveImageStorageId);
    const saveImageAfterUpload = async (uploaded: UploadFileResponse[]) => {
        if (songId === null) return;
        await saveImageStorageId({ imageStorageId: (uploaded[0].response as any).storageId, id: songId });
        setSongId(null);
    }

    return (
        <div className="w-full mx-auto p-6 rounded-lg shadow-md">
            {!songId && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Create New Song</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block font-medium mb-">
                            Song Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter song title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="upload" className="block font-medium mb-2">
                            Upload Audio File
                        </label>
                        <UploadDropzone
                            uploadUrl={generateUploadUrl}
                            fileTypes={{
                                "audio/mpeg": [".mp3", ".wav"]
                            }}
                            onUploadComplete={saveSongAfterUpload}
                            onUploadError={(error) => {
                                alert(`ERROR! ${error}`);
                            }}
                        />
                    </div>
                </div>
            )}
            {songId && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Upload Album Cover</h2>
                    <div className="mb-4">
                        <UploadDropzone
                            uploadUrl={generateUploadUrl}
                            fileTypes={{
                                "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                            }}
                            onUploadComplete={saveImageAfterUpload}
                            onUploadError={(error) => {
                                alert(`ERROR! ${error}`);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}