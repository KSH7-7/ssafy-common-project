import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        adminId: { label: "Admin ID", type: "text", placeholder: "admin" },
        adminPassword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { adminId, adminPassword } = credentials as { adminId: string; adminPassword: string };

        try {
          const response = await fetch("http://i12a207.p.ssafy.io:8080/api/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              adminId: adminId,
              adminPassword: adminPassword,
            }),
          });

          const data = await response.json().catch(() => null);

          if (!response.ok || !data) {
            throw new Error(data?.error || "로그인 실패");
          }

          return {
            id: data.id?.toString() || "unknown",
            name: data.name || "Admin User",
            token: data.token || "",
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
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.token = token.token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
