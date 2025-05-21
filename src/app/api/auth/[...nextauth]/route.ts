import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import dbConnect from "@/lib/database/mongoose";
import UserModel from "@/lib/database/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          const user = userCredential.user;
          
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }: { user: any, account: any }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await UserModel.findOne({ uid: user.id });
          
          if (!existingUser) {
            await UserModel.create({
              uid: user.id,
              username: user.name || `user_${user.id.substring(0, 5)}`,
              email: user.email,
              photoURL: user.image
            });
          }
        } catch (error) {
          console.error("Error during user creation:", error);
          return false;
        }
      }
      
      return true;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST }; 