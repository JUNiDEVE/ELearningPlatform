"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ProfileData {
  Name: string;
  Profession: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setProfile(data.user);
      console.log(data.user);
    };

    if (userId) fetchData();
  }, [userId]);

  return (
    <div className="flex flex-row">
      <div className="w-500"></div>

      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-sm mx-auto m-35 w-75">
        <div className="w-24 h-24 mx-auto rounded-full bg-[#0F172A] flex items-center justify-center">
          <img src="/images/logo.png" alt="Profile" className="w-35 h-30" />
        </div>

        {!profile ? (
          <p className="text-gray-400 mt-4">در حال بارگذاری...</p>
        ) : (
          <>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              {profile.Name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">{profile.Profession}</p>
            <p className="text-green-600 text-sm mt-1">AmjadLearn</p>
          </>
        )}
      </div>
    </div>
  );
}
