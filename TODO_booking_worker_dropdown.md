- [ ] Perbaiki `src/app/dashboard/pesanan/booking-service/page.tsx` agar:
  - [ ] Tambah kolom tabel baru: **Worker**
  - [ ] Kolom berisi dropdown Select dengan opsi: **None** + daftar worker dari `GET /api/workers`
  - [ ] Opsi None mengirim `workerId: null` ke `PUT /api/booking` (sesuaikan dengan perilaku backend)
  - [ ] Opsi nama worker mengirim `workerId` tersebut ke `PUT /api/booking`
  - [ ] Modal detail booking menampilkan data worker (nama atau "None")
  - [ ] Pastikan `activeId` dialog tetap bekerja, dan setelah update booking halaman refresh data
  - [ ] Jalankan typecheck/lint ringan bila memungkinkan

