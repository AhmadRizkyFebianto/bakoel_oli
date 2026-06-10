import ImageKit from "imagekit";

// Inisialisasi ImageKit dengan kredensial dari environment variables
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

/**
 * Fungsi untuk mengunggah gambar ke ImageKit.
 * Mendukung input berupa File (dari FormData), Blob, atau string Base64.
 */
export async function uploadToImageKit(
  imageInput: File | Blob | string,
): Promise<string> {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

  if (!publicKey) {
    console.warn(
      "Kredensial ImageKit tidak ditemukan di .env. Melewati proses upload.",
    );
    return "";
  }

  try {
    let fileToUpload: string | Buffer;
    let fileName = `prod-${Date.now()}`; // Nama file default agar unik

    if (typeof imageInput === "string") {
      // Jika input adalah string Base64
      fileToUpload = imageInput;
    } else {
      // Jika input adalah File atau Blob (dari multipart/form-data)
      // Kita perlu mengubahnya menjadi Buffer untuk diproses oleh Node.js environment
      const arrayBuffer = await imageInput.arrayBuffer();
      fileToUpload = Buffer.from(arrayBuffer);

      if (imageInput instanceof File) {
        fileName = imageInput.name.replace(/\s+/g, "-"); // Bersihkan spasi di nama file
      }
    }

    // Eksekusi upload menggunakan SDK
    const response = await imagekit.upload({
      file: fileToUpload,
      fileName: fileName,
      folder: "/products", // Folder opsional di dashboard ImageKit
      useUniqueFileName: true, // Menambahkan suffix unik otomatis jika nama sama
    });

    // Mengembalikan URL permanen hasil upload
    return response.url;
  } catch (error: any) {
    console.error("Error uploading image to ImageKit:", error.message || error);
    throw new Error(
      `Gagal mengupload gambar: ${error.message || "Unknown Error"}`,
    );
  }
}
