import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
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
                        return {
                            id: userCredential.user.uid,
                            email: userCredential.user.email,
                            name: userCredential.user.displayName,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Error signing in:", error);
                    throw new Error(error.message || 'Authentication failed');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        }
    }
};

export default NextAuth(authOptions);