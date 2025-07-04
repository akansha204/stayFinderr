import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 10 } })
        .onUploadComplete(async () => {
            // console.log("File uploaded");
        })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
