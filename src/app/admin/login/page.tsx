"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { MdAdminPanelSettings } from "react-icons/md";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      adminId: id, // ✅ NextAuth에 맞게 수정
      adminPassword: password,
    });

    if (result?.error) {
      setError("로그인 실패: ID 또는 비밀번호를 확인하세요.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center">
          <MdAdminPanelSettings size={80} className="text-blue-600" />
        </div>
        <h2 className="text-center text-2xl font-bold mt-4">
          스마트사물함 관리 시스템
        </h2>

        {error && (
          <p className="text-red-500 text-center whitespace-pre-line">
            {error}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              Admin ID
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
