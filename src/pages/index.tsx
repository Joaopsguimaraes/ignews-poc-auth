/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from "next";
  import Head from "next/head";
    import { stripe } from "../services/stripe";
      import { SubscribeButton } from "../components/SubscribeButton";
        import styles from "./home.module.scss";

interface HomeProps {//type para os valors do product
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        {/* Criando title da aplicação por pagina*/}
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> word.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
            {/*Passando o valor do produto buscando da api */}
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="gir coding" />
      </main>
    </>
  );
}
//para utilizar gestStaticProps, precisa ser criada a função da seguinte forma:
export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve("price_1KwE2JKKCfEN7bL4neeDtbx9",{
    expand: ["product"]
      //Buscando a todas informações do produto, passando como segundo parâmetro o expand
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //Atualizando somente a cada 24 hours com SSG(Server Side Generation)
  };
};
