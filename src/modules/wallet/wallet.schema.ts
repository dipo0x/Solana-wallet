import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const sendCryptoSchema = z.object({
    sender_private_key: z.string({
        invalid_type_error: "Sender private key must be string.",
    }),
    recipent_public_key: z.string({
      invalid_type_error: "Recipent public key must be string.",
    }),
    amount: z.number({
        invalid_type_error: "Amount must be number.",
      })
});


export type IsendCrypto = z.infer<typeof sendCryptoSchema>;

export const sendCryptoInputSchema = {
    body: zodToJsonSchema(sendCryptoSchema),
    description: "Send crypto to user",
};
