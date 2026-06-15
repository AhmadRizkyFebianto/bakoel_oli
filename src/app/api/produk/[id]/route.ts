import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { uploadToImageKit } from "@/src/lib/upload"; // Diperbarui dari ImgBB ke ImageKit

/**
 * @openapi
 * /api/produk/{id}:
 * get:
 * summary: Get a product by ID
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Product detail
 * 404:
 * description: Product not found
 * 500:
 * description: Server error
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: (await params).id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * @openapi
 * /api/produk/{id}:
 * put:
 * summary: Update a product by ID
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nama_product:
 * type: string
 * jenis_oli:
 * type: string
 * peruntukan:
 * type: string
 * cc_motor:
 * type: string
 * kekentalan_oli:
 * type: string
 * harga:
 * type: number
 * stok:
 * type: number
 * deskripsi:
 * type: string
 * image:
 * type: string
 * description: Base64 string of the image to be uploaded to ImageKit
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * nama_product:
 * type: string
 * jenis_oli:
 * type: string
 * peruntukan:
 * type: string
 * cc_motor:
 * type: string
 * kekentalan_oli:
 * type: string
 * harga:
 * type: number
 * stok:
 * type: number
 * deskripsi:
 * type: string
 * image:
 * type: string
 * format: binary
 * description: Image file to be uploaded to ImageKit
 * responses:
 * 200:
 * description: Product updated
 * 400:
 * description: Invalid input or product name already exists
 * 404:
 * description: Product not found
 * 500:
 * description: Server error
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const productId = (await params).id;

    // Pastikan produk tersebut ada terlebih dahulu
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product tidak ditemukan" },
        { status: 404 },
      );
    }

    let nama_product: string | undefined = undefined;
    let jenis_oli: string | undefined = undefined;
    let peruntukan: string | undefined = undefined;
    let cc_motor: string | undefined = undefined;
    let kekentalan_oli: string | undefined = undefined;
    let harga: number | undefined = undefined;
    let stok: number | undefined = undefined;
    let deskripsi: string | undefined = undefined;
    let imageInput: any = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      if (formData.has("nama_product"))
        nama_product = formData.get("nama_product") as string;
      if (formData.has("jenis_oli"))
        jenis_oli = formData.get("jenis_oli") as string;
      if (formData.has("peruntukan"))
        peruntukan = formData.get("peruntukan") as string;
      if (formData.has("cc_motor"))
        cc_motor = formData.get("cc_motor") as string;
      if (formData.has("kekentalan_oli"))
        kekentalan_oli = formData.get("kekentalan_oli") as string;
      if (formData.has("harga")) harga = Number(formData.get("harga"));
      if (formData.has("stok")) stok = Number(formData.get("stok"));
      if (formData.has("deskripsi"))
        deskripsi = formData.get("deskripsi") as string;

      const file = formData.get("image");
      if (file instanceof File && file.size > 0) {
        imageInput = file;
      }
    } else {
      const body = await req.json();
      if (body.nama_product !== undefined) nama_product = body.nama_product;
      if (body.jenis_oli !== undefined) jenis_oli = body.jenis_oli;
      if (body.peruntukan !== undefined) peruntukan = body.peruntukan;
      if (body.cc_motor !== undefined) cc_motor = body.cc_motor;
      if (body.kekentalan_oli !== undefined)
        kekentalan_oli = body.kekentalan_oli;
      if (body.harga !== undefined) harga = Number(body.harga);
      if (body.stok !== undefined) stok = Number(body.stok);
      if (body.deskripsi !== undefined) deskripsi = body.deskripsi;

      if (body.image) {
        imageInput = body.image;
      }
    }

    // Cek keunikan nama produk jika ada perubahan nama_product
    if (nama_product && nama_product !== existingProduct.nama_product) {
      const duplicateName = await prisma.product.findFirst({
        where: {
          nama_product,
          NOT: { id: productId },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          { message: "Nama produk sudah digunakan oleh produk lain" },
          { status: 400 },
        );
      }
    }

    const dataToUpdate: any = {};
    if (nama_product !== undefined) dataToUpdate.nama_product = nama_product;
    if (jenis_oli !== undefined) dataToUpdate.jenis_oli = jenis_oli;
    if (peruntukan !== undefined) dataToUpdate.peruntukan = peruntukan;
    if (cc_motor !== undefined) dataToUpdate.cc_motor = cc_motor;
    if (kekentalan_oli !== undefined)
      dataToUpdate.kekentalan_oli = kekentalan_oli;
    if (harga !== undefined && !isNaN(harga))
      dataToUpdate.harga = Math.round(harga);
    if (stok !== undefined && !isNaN(stok))
      dataToUpdate.stok = Math.round(stok);
    if (deskripsi !== undefined) dataToUpdate.deskripsi = deskripsi;

    // Proses upload ke ImageKit jika ada file/base64 gambar baru yang diunggah
    if (imageInput) {
      try {
        const uploadedUrl = await uploadToImageKit(imageInput);
        if (uploadedUrl) {
          dataToUpdate.image_url = uploadedUrl;
        }
      } catch (uploadError: any) {
        console.error("Gagal mengupload gambar ke ImageKit:", uploadError);
        return NextResponse.json(
          {
            message: "Gagal mengupload gambar ke ImageKit",
            error: uploadError.message,
          },
          { status: 500 },
        );
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Product berhasil diupdate",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal update product" },
      { status: 500 },
    );
  }
}

/**
 * @openapi
 * /api/produk/{id}:
 * delete:
 * summary: Delete a product by ID
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Product deleted
 * 500:
 * description: Server error
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await prisma.product.delete({
      where: {
        id: (await params).id,
      },
    });

    return NextResponse.json({
      message: "Product berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal delete product" },
      { status: 500 },
    );
  }
}
