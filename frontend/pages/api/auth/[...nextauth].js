import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "src/config/firebaseConfig";
import toast from "react-hot-toast"; 

export const authOptions = {
    pages: {
        signIn: '/signIn',
        error: '/auth/error',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth, 
                        credentials.email, 
                        credentials.password
                    );
                    
                    if (userCredential.user) {
                        if (!userCredential.user.emailVerified) {
                            toast.error('Please verify your email address');
                            return null;
                        }
                        return userCredential.user;
                    }
                    return null;
                } catch (error) {
                    console.error("Error signing in:", error);
                    throw new Error(error.message || 'Authentication failed');
                }
            }
        }),
        
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider === "google") {
                const credential = GoogleAuthProvider.credential(account.id_token);
                try {
                    const result = await signInWithCredential(auth, credential);
                    console.log("User signed in to Firebase:", result.user);
                    return true;
                } catch (error) {
                    console.error("Error signing in to Firebase:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id || user.uid;
                token.provider = account?.provider;
            }
            if (account?.provider === "google") {
                token.firebaseToken = account.id_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.provider = token.provider;
                session.firebaseToken = token.firebaseToken;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    }
};

export default NextAuth(authOptions);