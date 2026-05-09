"use client";
import { useState } from "react";
import CtaBanner from "../../components/CtaBanner";
import { FEATURED_PRODUCTS } from "@/src/data/products";
import { div } from "motion/react-client";

export default function Profile() {
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
        <ProfilePhoto />
        <EditHistory />
      </div>
      <div className="mt-20">
        <CtaBanner />
      </div>
    </section>
  );
}

function ProfilePhoto() {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-white p-8 shadow-lg w-full max-w-md h-[350px]">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/profile.png"
            alt="Oil"
            className="h-32 object-contain"
          />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-medium">Customer</h3>
          <h4 className="text-lg">customer@gmail.com</h4>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-brand-yellow py-3 rounded-lg font-bold mt-4 hover:brightness-105 transition-all"
        >
          Ubah Profile
        </button>
      </div>
      {isOpen && (
        <div
          className="min-h-screen w-screen fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={closeModal}
        >
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-2xl">
            <div className="flex justify-center mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-sm">Preview</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 mb-6
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-100 file:text-gray-700
                hover:file:bg-gray-200 transition-all cursor-pointer"
            />
            <button className="w-full bg-brand-yellow py-3 rounded-lg font-bold mt-4 hover:brightness-105 transition-all">
              Simpan
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function EditHistory() {
  const [activeTab, setActiveTab] = useState("profile");
  const [password, setPassword] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [jenisMotor, setJenisMotor] = useState("");
  const [jenisMesin, setJenisMesin] = useState("");

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
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Masukan Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                    placeholder="Masukan Password Baru......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Jenis Motor
                </label>
                <div className="relative">
                  <input
                    type="jenismotor"
                    placeholder="Masukan Jenis Motor......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={jenisMotor}
                    onChange={(e) => setJenisMotor(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Jenis Mesin
                </label>
                <select className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer">
                  <option>Pilih Jenis Mesin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-yellow text-brand-dark py-1.5 rounded-xl font-bold text-lg hover:brightness-105 transition-all shadow-lg mt-4 active:scale-[0.98]"
              >
                Simpan
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
