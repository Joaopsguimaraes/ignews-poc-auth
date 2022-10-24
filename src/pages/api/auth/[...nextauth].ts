import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query } from "faunadb";
//utilizando FQL do fauna;

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user" } },
      //passando o scope para recolher somente informações mais básicas do usuário
    }),
  ],
  callbacks: {
    //utilizando callback do next para pegar informações do user logado e salvar no banco de dados
    async signIn(params: { user; account; profile }) {
      const { email } = params.user;

      try {
        query.If(
          //criando método para validar se o usuário existe
          query.Not(
            query.Exists(
              query.Match(
                query.Index("user_by_email"),
                query.Casefold(params.user.email)
              )
            )
          ),
          query.Create(
            //método para fazer inserção no banco
            query.Collection("users"),
            { data: { email } }
          ),
          query.Get(
            //similar a select dentro do sql
            query.Match(
              query.Index("user_by_email"),
              query.Casefold(params.user.email)
            )
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
