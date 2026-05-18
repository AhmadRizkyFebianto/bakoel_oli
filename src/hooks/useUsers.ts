"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "total_users_cache";

export function useUsers() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/user");

      console.log("USER API RESPONSE:", res.data);

      /**
       * Response API:
       * {
       *   "jumlahUser": 2
       * }
       */

      const total = res.data?.jumlahUser ?? 0;

      // simpan ke state
      setTotalUsers(total);

      // simpan ke localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(total));
    } catch (error) {
      console.error("Gagal mengambil jumlah user:", error);

      // fallback cache
      const cached = localStorage.getItem(STORAGE_KEY);

      if (cached) {
        setTotalUsers(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ambil cache dulu
    const cached = localStorage.getItem(STORAGE_KEY);

    if (cached) {
      try {
        setTotalUsers(JSON.parse(cached));
      } catch (e) {
        console.error("Cache rusak:", e);
      }
    }

    // sync ulang ke API
    fetchUsers();
  }, []);

  return {
    totalUsers,
    loading,
    refreshUsers: fetchUsers,
  };
}