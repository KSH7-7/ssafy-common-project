/* eslint-disable @typescript-eslint/no-unused-vars */
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
        setError("");

        try {
            const response = await fetch("/api/login", { // route.js의 POST 요청
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminId: id, adminPassword: password }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/admin"); // ✅ 로그인 성공 시 페이지 이동 (layout.tsx에서 세션 체크 후 admin 페이지 렌더링)
            } else {
                setError("로그인 실패: " + data.message);
            }
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
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