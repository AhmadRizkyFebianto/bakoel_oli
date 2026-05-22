import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: "ORDER-" + Date.now(),
        gross_amount: body.total,
      },

      customer_details: {
        first_name: body.name,
        email: body.email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Gagal membuat transaksi",
      },
      {
        status: 500,
      },
    );
  }
}
