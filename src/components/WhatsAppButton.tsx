export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6288991520696"
      target="_blank"
      rel="no-referrer"
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
