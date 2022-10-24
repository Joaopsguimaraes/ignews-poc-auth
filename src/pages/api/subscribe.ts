/* eslint-disable import/no-anonymous-default-export */
import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    //verificando se o método da requisição seja post
    const session = await getSession({ req });

    const user = fauna.query<User>( //armazenando dados do usuário dentro de user
      query.Get(
        query.Match(
          query.Index("user_by_email"), //procurando o usuário por email
          query.Casefold(session.user.email)
        )
      )
    );

    let customerId = (await user).data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });
      await fauna.query(
        query.Update(
          query.Ref(query.Collection("users"), (await user).ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            },
          }
        )
      );
      customerId = stripeCustomer.id;
    } //Validando se o user existe no banco do fauna, caso nao existe, vai criar e atribuir valor ao costumerId

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      //criando método de pagamento
      customer: customerId, //id do customer no stripe;
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1KwE2JKKCfEN7bL4neeDtbx9", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    //retornando para o frontend que o metodo que a rota aceita é post
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
