import 'dotenv/config'
import prisma from '../src/lib/prisma'
import XLSX from 'xlsx'

async function main() {
  // Hapus data lama agar tidak bentrok (idempotent)
  await prisma.product.deleteMany()

  // Seed worker default jika belum ada
  const workerCount = await prisma.worker.count()
  if (workerCount === 0) {
    await prisma.worker.createMany({
      data: [
        { name: 'Agus', status: 'FREE' },
        { name: 'Budi', status: 'FREE' },
      ],
    })
    console.log('Inserted: 2 default workers (Agus & Budi)')
  } else {
    console.log(`Workers sudah ada (${workerCount} worker), skip seeding worker.`)
  }

  // baca file excel
  const workbook = XLSX.readFile(
    './prisma/data/product.xlsx'
  )

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  // ubah excel menjadi json (tanpa range: 1 agar baris pertama dibaca sebagai header)
  const rows: any[] = XLSX.utils.sheet_to_json(sheet)

  console.log(`Total data: ${rows.length}`)

  for (const row of rows) {
    // skip jika kosong
    if (!row['Merek/Produk']) continue

    // ambil harga dan ubah menjadi number
    const harga = Number(
      String(row['Harga'])
        .replace(/Rp/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '')
        .trim()
    ) || 0

    await prisma.product.create({
      data: {
        nama_product: row['Merek/Produk'] || '',
        jenis_oli: row['Oli Gardan/Mesin'] || '',
        peruntukan: row['Untuk Jenis Motor'] || '',
        cc_motor: row['CC Motor'] || '',
        kekentalan_oli: row['Jenis Oli (SAE)'] || '',
        harga,
        stok: 0,
        deskripsi: row['Deskripsi'] || '',
        image_url: row['Image url'] || '',
      },
    })

    console.log(`Inserted: ${row['Merek/Produk']}`)
  }

  console.log('Seeder selesai')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })