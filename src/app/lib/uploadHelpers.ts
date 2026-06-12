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
    // If there are no new files, just return the strings/nulls that already exist
    return files.map((f) => (typeof f === "string" ? f : null));
  }

  try {
    const formData = new FormData();
    filesToUpload.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
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
