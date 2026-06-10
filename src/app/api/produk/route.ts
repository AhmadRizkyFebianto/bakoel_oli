import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { uploadToImageKit } from "@/src/lib/upload";

/**
 * @openapi
 * /api/produk:
 * get:
 * summary: Mendapatkan semua produk aktif
 * tags: [Products]
 * responses:
 * 200:
 * description: Daftar produk berhasil diambil
 * 500:
 * description: Kesalahan server
 */
export async function GET() {
  try {
    const produk = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ produk }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Gagal mengambil produk" },
      { status: 500 },
    );
  }
}

/**
 * @openapi
 * /api/produk:
 * post:
 * summary: Membuat produk baru
 * tags: [Products]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nama_product: { type: string }
 * jenis_oli: { type: string }
 * peruntukan: { type: string }
 * cc_motor: { type: string }
 * kekentalan_oli: { type: string }
 * harga: { type: number }
 * stok: { type: number }
 * deskripsi: { type: string }
 * image: { type: string, description: "Base64 string" }
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * image: { type: string, format: binary }
 * # ... properti lainnya
 * responses:
 * 201:
 * description: Produk berhasil dibuat
 * 400:
 * description: Input tidak valid atau nama produk sudah ada
 * 500:
 * description: Kesalahan server
 */
export async function POST(req: Request) {
  try {
    let nama_product = "";
    let jenis_oli = "";
    let peruntukan = "";
    let cc_motor = "";
    let kekentalan_oli = "";
    let harga = 0;
    let stok = 0;
    let deskripsi = "";
    let imageInput: any = null;
    let image_url = "";

    const contentType = req.headers.get("content-type") || "";

    // 1. Parsing Data berdasarkan Content-Type
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      nama_product = (formData.get("nama_product") as string) || "";
      jenis_oli = (formData.get("jenis_oli") as string) || "";
      peruntukan = (formData.get("peruntukan") as string) || "";
      cc_motor = (formData.get("cc_motor") as string) || "";
      kekentalan_oli = (formData.get("kekentalan_oli") as string) || "";
      harga = Number(formData.get("harga")) || 0;
      stok = Number(formData.get("stok")) || 0;
      deskripsi = (formData.get("deskripsi") as string) || "";

      const file = formData.get("image");
      if (file instanceof File && file.size > 0) {
        imageInput = file;
      }
    } else {
      const body = await req.json();
      nama_product = body.nama_product || "";
      jenis_oli = body.jenis_oli || "";
      peruntukan = body.peruntukan || "";
      cc_motor = body.cc_motor || "";
      kekentalan_oli = body.kekentalan_oli || "";
      harga = Number(body.harga) || 0;
      stok = Number(body.stok) || 0;
      deskripsi = body.deskripsi || "";

      if (body.image) {
        imageInput = body.image;
      }
    }

    // 2. Validasi Field Wajib
    if (
      !nama_product ||
      !jenis_oli ||
      !peruntukan ||
      !cc_motor ||
      !kekentalan_oli ||
      harga <= 0
    ) {
      return NextResponse.json(
        { message: "Data tidak valid atau tidak lengkap" },
        { status: 400 },
      );
    }

    // 3. Cek Keunikan Nama Produk
    const existingNama = await prisma.product.findUnique({
      where: { nama_product },
    });

    if (existingNama) {
      return NextResponse.json(
        { message: "Nama produk sudah terdaftar" },
        { status: 400 },
      );
    }

    // 4. Upload ke ImageKit jika ada input gambar
    if (imageInput) {
      try {
        // Memanggil fungsi yang sudah diupdate di upload.ts
        const uploadedUrl = await uploadToImageKit(imageInput);
        if (uploadedUrl) {
          image_url = uploadedUrl;
        }
      } catch (uploadError: any) {
        console.error("Gagal mengupload ke ImageKit:", uploadError);
        return NextResponse.json(
          {
            message: "Gagal memproses gambar",
            error: uploadError.message,
          },
          { status: 500 },
        );
      }
    }

    // 5. Simpan ke Database
    const produk = await prisma.product.create({
      data: {
        nama_product,
        jenis_oli,
        peruntukan,
        cc_motor,
        kekentalan_oli,
        harga: Math.round(harga),
        stok: Math.round(stok),
        deskripsi,
        image_url: image_url || null,
      },
    });

    return NextResponse.json(
      {
        message: "Produk berhasil ditambahkan",
        produk,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan produk ke database" },
      { status: 500 },
    );
  }
}
