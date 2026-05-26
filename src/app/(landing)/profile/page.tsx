"use client";
import { useEffect, useMemo, useState } from "react";
import CtaBanner from "../../../components/CtaBanner";
import { useOrders } from "@/src/lib/orders.store";
import axios from "axios";

interface UserProfile {
  username: string;
  email: string;
  jenis_motor?: string | null;
  jenis_mesin?: string | null;
  nomor_hp?: string | null;
  alamat?: string | null;
}

type UpdatePayload = {
  alamat?: string;
  nomor_hp?: string;
  password?: string;
  jenis_motor?: string;
  jenis_mesin?: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    jenis_motor: "",
    jenis_mesin: "",
    nomor_hp: "",
    alamat: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    setProfileError(null);

    try {
      const res = await axios.get("/api/user/update", {
        withCredentials: true,
      });

      // Response: { user: {...} }
      const user = res.data?.user;
      setProfile({
        username: user?.username ?? "Pelanggan",
        email: user?.email ?? "tidakada@email.com",
        jenis_motor: user?.jenis_motor ?? "",
        jenis_mesin: user?.jenis_mesin ?? "",
        nomor_hp: user?.nomor_hp ?? "",
        alamat: user?.alamat ?? "",
      });
    } catch (err: any) {
      setProfileError(
        err?.response?.data?.message || "Gagal memuat data profile",
      );
      // fallback dari localStorage (agar UI tetap tampil)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setProfile({
            username: parsedUser.username || "Pelanggan",
            email: parsedUser.email || "tidakada@email.com",
            jenis_motor: parsedUser.jenis_motor ?? "",
            jenis_mesin: parsedUser.jenis_mesin ?? "",
            nomor_hp: parsedUser.nomor_hp ?? "",
            alamat: parsedUser.alamat ?? "",
          });
        } catch {
          // ignore
        }
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const initialForm = useMemo(
    () => ({
      jenisMotor: profile.jenis_motor ?? "",
      jenisMesin: profile.jenis_mesin ?? "",
      noHp: profile.nomor_hp ?? "",
      alamat: profile.alamat ?? "",
    }),
    [
      profile.jenis_motor,
      profile.jenis_mesin,
      profile.nomor_hp,
      profile.alamat,
    ],
  );

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/FrameBG.png"
          alt="Frame background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative flex flex-col lg:flex-row space-x-20 space-y-20">
        <ProfilePhoto profile={profile} />
        <EditHistory
          key={`${profile.jenis_motor ?? ""}-${profile.jenis_mesin ?? ""}-${profile.nomor_hp ?? ""}-${profile.alamat ?? ""}`}
          initialJenisMotor={initialForm.jenisMotor}
          initialJenisMesin={initialForm.jenisMesin}
          initialNoHp={initialForm.noHp}
          initialAlamat={initialForm.alamat}
          onUpdated={fetchProfile}
        />
      </div>

      <div className="mt-20">
        <CtaBanner />
      </div>

      {loadingProfile ? null : profileError ? (
        <div className="mt-6 text-center text-sm text-red-600 font-semibold">
          {profileError}
        </div>
      ) : null}
    </section>
  );
}

function ProfilePhoto({ profile }: { profile: UserProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-white p-8 shadow-lg w-full max-w-md h-[270px]">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/profile.png"
            alt="Oil"
            className="h-32 object-contain"
          />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-medium">{profile.username}</h3>
          <h4 className="text-lg">{profile.email}</h4>
        </div>
      </div>
    </>
  );
}

function EditHistory({
  initialJenisMotor,
  initialJenisMesin,
  initialNoHp,
  initialAlamat,
  onUpdated,
}: {
  initialJenisMotor: string;
  initialJenisMesin: string;
  initialNoHp: string;
  initialAlamat: string;
  onUpdated: () => Promise<void>;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [noHp, setNoHp] = useState(initialNoHp ?? "");
  const [alamat, setAlamat] = useState(initialAlamat ?? "");

  useEffect(() => {
    setNoHp(initialNoHp ?? "");
    setAlamat(initialAlamat ?? "");
  }, [initialNoHp, initialAlamat]);

  const [password, setPassword] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [jenisMotor, setJenisMotor] = useState(initialJenisMotor);
  const [jenisMesin, setJenisMesin] = useState(initialJenisMesin);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    setJenisMotor(initialJenisMotor);
    setJenisMesin(initialJenisMesin);
  }, [initialJenisMotor, initialJenisMesin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const payload: UpdatePayload = {
        password: passwordBaru ? passwordBaru : "",
        jenis_motor: jenisMotor ? jenisMotor : undefined,
        jenis_mesin: jenisMesin ? jenisMesin : undefined,
        nomor_hp: noHp ? noHp : undefined,
        alamat: alamat ? alamat : undefined,
      };

      // Jika user tidak mengisi password baru, maka backend tidak akan mengubah password (tetap password lama)
      if (passwordBaru) {
        if (!password) {
          throw new Error("Masukan password lama untuk konfirmasi");
        }
        if (passwordBaru !== password) {
          throw new Error("Konfirmasi password tidak sesuai");
        }
      }

      await axios.put("/api/user/update", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setSaveSuccess("Data berhasil diperbarui");
      setPassword("");
      setPasswordBaru("");
      await onUpdated();
    } catch (err: any) {
      setSaveError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memperbarui data",
      );
    } finally {
      setSaving(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Gagal mengambil history pesanan", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchOrders();
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "settlement":
      case "success":
        return "bg-green-100 text-green-700";
      case "expire":
      case "cancel":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex text-sm font-medium text-center">
          <li className="me-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`inline-block p-4 border-b-2 ${
                activeTab === "profile" ? "border-black" : "border-transparent"
              }`}
            >
              Ubah Data
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("history")}
              className={`inline-block p-4 border-b-2 ${
                activeTab === "history" ? "border-black" : "border-transparent"
              }`}
            >
              History
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-8 shadow-lg w-full">
        {activeTab === "profile" && (
          <div className="">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  No. Handphone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukan No. Handphone......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Alamat
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukan Alamat......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukan Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute mt-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none select-none"
                  >
                    {showPassword ? (
                      // Ikon Mata Terbuka (Mengintip)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      // Ikon Mata Tertutup (Sembunyi)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswordBaru ? "text" : "password"}
                    placeholder="Konfirmasi Password Baru......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                    className="absolute mt-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none select-none"
                  >
                    {showPasswordBaru ? (
                      // Ikon Mata Terbuka (Mengintip)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      // Ikon Mata Tertutup (Sembunyi)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {saveError ? (
                <div className="text-sm text-red-600 font-semibold">
                  {saveError}
                </div>
              ) : null}
              {saveSuccess ? (
                <div className="text-sm text-green-600 font-semibold">
                  {saveSuccess}
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Jenis Motor
                </label>
                <select
                  value={jenisMotor}
                  onChange={(e) => setJenisMotor(e.target.value)}
                  className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Pilih Jenis Motor
                  </option>
                  <option value="motor matic">Motor Matic</option>
                  <option value="motor matic premium">
                    Motor Matic Premium
                  </option>
                  <option value="motor sport">Motor Sport</option>
                  <option value="motor sport premium">
                    Motor Sport Premium
                  </option>
                  <option value="motor bebek">Motor Bebek</option>
                  <option value="motor bebek lama">Motor Bebek Lama</option>
                  <option value="motor 2 tak">Motor 2 Tak</option>
                  <option value="motor harian">Motor Harian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Merk Motor
                </label>
                <select
                  value={jenisMesin}
                  onChange={(e) => setJenisMesin(e.target.value)}
                  className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Pilih Merk Motor
                  </option>
                  <option value="honda">Honda</option>
                  <option value="yamaha">Yamaha</option>
                  <option value="suzuki">Suzuki</option>
                  <option value="kawasaki">Kawasaki</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-yellow text-brand-dark py-1.5 rounded-xl font-bold text-lg hover:brightness-105 transition-all shadow-lg mt-4 active:scale-[0.98]"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="text-center py-10">Memuat riwayat...</div>
            ) : orders.length > 0 ? (
              orders.map((order) => {
                const firstItem = order.items[0];
                return (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* Image Perwakilan */}
                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                      <img
                        src={
                          firstItem?.product?.image_url ||
                          "/assets/placeholder-oil.png"
                        }
                        alt="Product"
                        className="h-full object-contain"
                      />
                    </div>

                    {/* Order Info */}
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </h4>
                        <span
                          className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full w-fit mx-auto md:mx-0 ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {firstItem?.product?.nama_product}
                        {order.items.length > 1 &&
                          ` +${order.items.length - 1} produk lainnya`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Total & Detail Button */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Total Bayar
                        </p>
                        <p className="text-xl font-black text-brand-blue">
                          Rp. {order.total.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          (window.location.href = `/detail-history/${order.id}`)
                        }
                        className="bg-brand-yellow text-brand-dark px-5 py-2 rounded-lg font-bold text-xs hover:brightness-105 transition-all shadow-sm"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-gray-400">
                Belum ada riwayat pesanan.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
