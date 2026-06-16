"use client";

export default function WhatsAppButton() {
  const phoneNumber = "6288991520696";

  const messageTemplate = `Halo Sobat Bakoel Oli 👋

Jika ingin konsultasi mengenai kondisi motor anda silahkan isi data dibawah.

📝 Data Pelanggan
Nama:
Merek Motor:
Tipe Motor:
Tahun Motor:

🔧 Keluhan Motor
(Jelaskan keluhan yang dialami)

Contoh:

* Mesin sulit dinyalakan
* Oli cepat berkurang
* Suara mesin kasar
* Motor kurang bertenaga
* Rem kurang pakem
* Keluhan lainnya


Terima kasih.`;

  const encodedMessage = encodeURIComponent(messageTemplate);

  const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      aria-label="Hubungi via WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-8 h-8"
      />
    </a>
  );
}
