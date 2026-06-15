export default function WhatsAppButton() {
  // Nomor tujuan WhatsApp
  const phoneNumber = "6288991520696";

  // Template pesan yang ingin ditampilkan otomatis
  const messageTemplate =
    "Halo admin Bakul Oli, saya ingin bertanya terkait layanan service motor.";

  // Mengubah teks menjadi format URL yang valid (mengubah spasi menjadi %20, dll)
  const encodedMessage = encodeURIComponent(messageTemplate);

  // Menggabungkan nomor dan template pesan
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
