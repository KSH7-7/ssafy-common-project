import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth"; // 경로는 프로젝트 구조에 맞게 수정

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
