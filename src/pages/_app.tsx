import { AppProps } from "next/app";
//tipagem responsável para components and pageProps
import { Header } from "../components/Header";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <NextAuthProvider session={pageProps.session}>
        {/* passando o session para o componente Header com o provider do next */}
        <Header />
        {/* componente que será renderizado no cabeçalho em todas as paginas, por isso importado no _app*/}
        <Component {...pageProps} />
      </NextAuthProvider>
  );
}

export default MyApp;
