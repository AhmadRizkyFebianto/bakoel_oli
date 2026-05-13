import prisma  from "@/src/lib/prisma";
import { NextResponse } from "next/server";


/**
 * @openapi
 * /api/produk/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id: (await params).id,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


/**
 * @openapi
 * /api/produk/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       500:
 *         description: Server error
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: (await params).id,
        },
        data: body,
      });

    return NextResponse.json({
      message: "Product berhasil diupdate",
      data: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Gagal update product",
      },
      {
        status: 500,
      }
    );
  }
}


/**
 * @openapi
 * /api/produk/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       500:
 *         description: Server error
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
    return NextResponse.json(
      {
        message: "Gagal delete product",
      },
      {
        status: 500,
      }
    );
  }
}