import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const uploadedFiles: string[] = [];

    for (const [, value] of formData.entries()) {
      const file = value as File;
      if (file && typeof file === "object" && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const base64Image = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64Image}`;

        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
          folder: "encotec-Assets",
        });

        uploadedFiles.push(uploadResponse.secure_url);
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
