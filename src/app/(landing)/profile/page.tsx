"use client";
import { useEffect, useMemo, useState } from "react";
import CtaBanner from "../../../components/CtaBanner";
import { FEATURED_PRODUCTS } from "@/src/data/products";
import axios from "axios";

interface UserProfile {
  username: string;
  email: string;
  jenis_motor?: string | null;
  jenis_mesin?: string | null;
}

type UpdatePayload = {
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
    }),
    [profile.jenis_motor, profile.jenis_mesin],
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
          key={`${profile.jenis_motor ?? ""}-${profile.jenis_mesin ?? ""}`}
          initialJenisMotor={initialForm.jenisMotor}
          initialJenisMesin={initialForm.jenisMesin}
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
  onUpdated,
}: {
  initialJenisMotor: string;
  initialJenisMesin: string;
  onUpdated: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
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
        password: passwordBaru ? passwordBaru : undefined,
        jenis_motor: jenisMotor ? jenisMotor : undefined,
        jenis_mesin: jenisMesin ? jenisMesin : undefined,
      };

      if (passwordBaru && passwordBaru !== password) {
        throw new Error("Konfirmasi password tidak sesuai");
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
              onClick={() => setActiveTab("dashboard")}
              className={`inline-block p-4 border-b-2 ${
                activeTab === "dashboard"
                  ? "border-black"
                  : "border-transparent"
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
                    type="number"
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
                    type="password"
                    placeholder="Masukan Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Masukan Konfirmasi Password Baru......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                  />
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
                  Merk Motor
                </label>
                <select
                  value={jenisMotor}
                  onChange={(e) => setJenisMotor(e.target.value)}
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Jenis Mesin
                </label>
                <select
                  value={jenisMesin}
                  onChange={(e) => setJenisMesin(e.target.value)}
                  className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Pilih Jenis Mesin
                  </option>
                  <option value="matic">Matic</option>
                  <option value="manual">Manual (Kopling/Gigi)</option>
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

        {activeTab === "dashboard" && (
          <div className="">
            {FEATURED_PRODUCTS.map((item) => (
              <div className="mb-2">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="flex-grow space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                  <div className="text-right space-y-4 flex flex-col items-center sm:items-end">
                    <span className="text-xl font-extrabold text-brand-blue">
                      Rp. {item.price.toLocaleString("id-ID")}
                    </span>
                    <div className="flex items-center gap-3">
                      <button className="bg-brand-yellow text-brand-dark px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 transition-all">
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-auto bg-gray-100 my-1.5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
