import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"
import {prisma} from "@repo/db";

const handler  = NextAuth({
  providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
      GitHubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string
  })

  ],
  secret: process.env.NEXTAUTH_SECRET,

  session :{
    strategy:"jwt"
  },
  
    callbacks: {
      jwt: async ({ user, token }: any) => {
        console.log(token);
	      if (user) {
	          token.uid = user.id;
            token.name = user.name;
            token.email = user.email;
            token.role  = user.role
	      }
	      return token;
      },
    session: async ({ session, token, user }: any) => {
        if (session.user && token) {
            session.user.id = token.sub as string;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.role = token.role;
        }
        return session;
    }, 
    signIn: async ({ user }) => {
      try {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              id:user.id,
              name: user.name,
              email: user.email,
            },
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
})


export { handler as GET, handler as POST }