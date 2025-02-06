"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAdminPanelSettings } from "react-icons/md";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // 에러 메시지 초기화

    try {
      const response = await fetch("http://i12a207.p.ssafy.io:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("로그인 성공:", result);
        router.push("/admin"); // ✅ 로그인 성공 시 메인 페이지 이동
      } else {
        setError("로그인 실패: ID 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("서버 오류 발생!\n서버 관리자에게 문의 바랍니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center">
          <MdAdminPanelSettings size={80} className="text-blue-600" />
        </div>
        <h2 className="text-center text-2xl font-bold mt-4">스마트사물함 관리 시스템</h2>

        {/* ✅ 줄바꿈 (tailwind CSS) */}
        {error && <p className="text-red-500 text-center whitespace-pre-line">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">Admin ID</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
