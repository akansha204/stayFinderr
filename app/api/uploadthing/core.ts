import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 10 } })
        .onUploadComplete(async ({ file, metadata }) => {
            // console.log("File uploaded:", file, metadata);
        })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
