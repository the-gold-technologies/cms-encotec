export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_DIMENSION = 2560; // Max width/height for high-res retention
const COMPRESSION_QUALITY = 0.85; // Optimal balance: virtually identical quality, high compression

/**
 * Compresses an image client-side using HTML5 Canvas.
 * Reduces file size significantly without visible degradation.
 */
export async function compressImage(file: File): Promise<File> {
  // Only compress raster images; skip SVGs or GIFs to avoid breaking vectors/animations
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  // If running in an environment without DOM/Canvas, return original
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Resize proportionally if exceeding 2K/4K max dimension
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        // Enable high-quality bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output type (WebP preserves transparency cleanly, JPEG for standard photos)
        const isPng = file.type === "image/png";
        const outputMime = isPng ? "image/webp" : "image/jpeg";

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is missing or larger, use original
              return resolve(file);
            }

            const newExtension = outputMime === "image/webp" ? ".webp" : ".jpg";
            const newName = file.name.replace(/\.[^/.]+$/, "") + newExtension;
            const compressedFile = new File([blob], newName, {
              type: outputMime,
              lastModified: Date.now(),
            });

            console.log(
              `[Image Compression] ${file.name}: ${(file.size / 1024).toFixed(0)}KB -> ${(compressedFile.size / 1024).toFixed(0)}KB`,
            );
            resolve(compressedFile);
          },
          outputMime,
          COMPRESSION_QUALITY,
        );
      } catch (err) {
        console.warn("[Image Compression] Fallback to original file:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Validates file size limits (Images: 10MB, PDFs: 25MB) and uploads files to /api/upload.
 */
export async function uploadFiles(
  files: (File | string | null)[],
): Promise<(string | null)[]> {
  const fileIndices: number[] = [];
  const filesToUpload: File[] = [];

  files.forEach((file, index) => {
    if (file instanceof File) {
      filesToUpload.push(file);
      fileIndices.push(index);
    }
  });

  if (fileIndices.length === 0) {
    // If there are no new files, return existing strings/nulls
    return files.map((f) => (typeof f === "string" ? f : null));
  }

  // 1. Validate size limits
  for (const file of filesToUpload) {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      throw new Error(
        `Image "${file.name}" (${sizeMb} MB) exceeds the 10 MB limit. Please select an image under 10 MB.`,
      );
    }

    if (isPdf && file.size > MAX_PDF_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      throw new Error(
        `PDF "${file.name}" (${sizeMb} MB) exceeds the 25 MB limit. Please select a document under 25 MB.`,
      );
    }
  }

  // 2. Compress images client-side before sending
  const preparedFiles = await Promise.all(
    filesToUpload.map(async (file) => {
      if (file.type.startsWith("image/")) {
        return await compressImage(file);
      }
      return file;
    }),
  );

  try {
    const formData = new FormData();
    preparedFiles.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = `Upload failed (${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error) errorMsg = parsed.error;
      } catch {
        if (response.status === 413) {
          errorMsg =
            "File is too large for the server. Maximum size is 10 MB for images and 25 MB for PDFs.";
        }
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();
    if (!json.success || !json.files) {
      throw new Error(json.error || "Upload failed");
    }

    const uploadedUrls = json.files as string[];

    const result = [...files];
    let uploadIdx = 0;
    files.forEach((file, index) => {
      if (file instanceof File) {
        result[index] = uploadedUrls[uploadIdx++];
      } else if (typeof file === "string") {
        result[index] = file;
      } else {
        result[index] = null;
      }
    });

    return result as (string | null)[];
  } catch (err) {
    console.error("Upload error", err);
    throw err;
  }
}
