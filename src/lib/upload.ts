export async function uploadToImgBB(imageInput: File | Blob | string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    console.warn("IMGBB_API_KEY is not defined in environment variables. Skipping image upload.");
    return "";
  }

  try {
    const body = new FormData();

    if (typeof imageInput === "string") {
      // If it's a base64 string, let's strip the prefix data:image/...;base64, if present
      let base64Data = imageInput;
      if (imageInput.startsWith("data:")) {
        const parts = imageInput.split(",");
        if (parts.length > 1) {
          base64Data = parts[1];
        }
      }
      body.append("image", base64Data);
    } else {
      // It's a File or Blob
      body.append("image", imageInput);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ImgBB upload failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data && data.success && data.data && data.data.url) {
      return data.data.url;
    } else {
      throw new Error(`ImgBB upload failed: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
}
