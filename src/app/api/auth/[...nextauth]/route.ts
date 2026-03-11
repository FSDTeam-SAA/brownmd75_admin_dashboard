// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// ==================
// Extend NextAuth types
// ==================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
      image?: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    accessToken: string;
    refreshToken: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          console.log("Attempting login for:", credentials.email);

          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const result = await res.json();
          console.log("API Response:", result);

          // Check for success (your API uses "success" not "status")
          if (!res.ok || !result.success) {
            console.error("Login failed:", result.message);
            throw new Error(result.message || "Login failed");
          }

          // Extract data from the nested structure
          const { accessToken, refreshToken, user } = result.data;

          console.log("User data extracted:", user);

          // Return the user object with correct field names
          return {
            id: user.id, // API uses "id" not "_id"
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image || "", // Handle empty image object
            accessToken,
            refreshToken,
          };
        } catch (error) {
          console.error("Authorize Error Details:", error);
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as string,
        firstName: token.firstName,
        lastName: token.lastName,
        image: token.image,
      };

      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
