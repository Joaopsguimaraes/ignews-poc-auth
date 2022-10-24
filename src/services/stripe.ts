import Stripe from "stripe";
//SDK Stripe

import { version } from "../../package.json";

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY,//primeiro parâmetro deve ser passado a key
    {
        apiVersion: "2020-08-27",//passado a versão do stripe
        appInfo:{//informações de meta-data
            name: "ignews",
            version
        },
    }
);