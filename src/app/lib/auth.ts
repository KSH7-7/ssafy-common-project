import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        adminId: { label: "Admin ID", type: "text", placeholder: "admin" },
        adminPassword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { adminId, adminPassword } = credentials as {
          adminId: string;
          adminPassword: string;
        };

        try {
          const response = await fetch("http://i12a207.p.ssafy.io:8080/api/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              adminId,
              adminPassword,
            }),
          });

          const data = await response.json().catch(() => null);

          if (!response.ok || !data) {
            throw new Error(data?.error || "로그인 실패");
          }

          // NextAuth 기본 필드만 반환 (예: id, name, email)
          return {
            id: data.id?.toString() || "unknown",
            name: data.name || "Admin User",
            email: data.email || "", // email 정보가 있다면 포함
          };
        } catch (error) {
          console.error("로그인 오류:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    // 기본적으로 JWT 전략을 사용합니다.
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7일 유지
  },
  // jwt, session 콜백을 제거하면 기본 동작(NextAuth에서 제공하는 사용자 정보만 사용)이 적용됩니다.
  secret: process.env.NEXTAUTH_SECRET,
};
