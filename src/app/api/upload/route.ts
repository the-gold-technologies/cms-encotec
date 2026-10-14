import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: Record<string, any>,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const uploadedFiles: string[] = [];

    for (const [, value] of formData.entries()) {
      const file = value as File;
      if (file && typeof file === "object" && file.name) {
        const isPdf =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");
        const isImage = file.type.startsWith("image/");

        // Server-side size validation
        if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
          const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
          return NextResponse.json(
            {
              success: false,
              error: `Image "${file.name}" (${sizeMb} MB) exceeds the 10 MB limit.`,
            },
            { status: 400 },
          );
        }

        if (isPdf && file.size > MAX_PDF_SIZE_BYTES) {
          const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
          return NextResponse.json(
            {
              success: false,
              error: `PDF "${file.name}" (${sizeMb} MB) exceeds the 25 MB limit.`,
            },
            { status: 400 },
          );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await uploadBufferToCloudinary(buffer, {
          folder: "encotec-Assets",
          resource_type: "auto",
        });

        if (uploadResponse?.secure_url) {
          uploadedFiles.push(uploadResponse.secure_url);
        } else {
          throw new Error("Failed to receive secure_url from Cloudinary");
        }
      }
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Critical Upload Error:", error);
    return NextResponse.json(
      { success: false, error: `Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
