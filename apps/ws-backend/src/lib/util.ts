import { jwtDecrypt, calculateJwkThumbprint, base64url } from "jose";
import { hkdf } from "@panva/hkdf";

interface JWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
  id?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

export interface JWTDecodeParams {
  salt: string;
  secret: string | string[];
  token?: string;
}

const alg = "dir";
const enc = "A256CBC-HS512";

async function getDerivedEncryptionKey(
  enc: string,
  keyMaterial: string,
  salt: string
) {
  let length = enc === "A256CBC-HS512" ? 64 : 32;
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    length
  );
}

export async function DecodeJWT<Payload = JWT>({
  token,
  secret,
  salt,
}: JWTDecodeParams): Promise<Payload | null> {
  const secrets = Array.isArray(secret) ? secret : [secret];
  if (!token) return null;
  const { payload } = await jwtDecrypt(
    token,
    async ({ kid, enc }) => {
      console.log("\n\nKid:", kid);
      for (const secret of secrets) {
        const encryptionSecret = await getDerivedEncryptionKey(
          enc,
          secret,
          salt
        );

        console.log("\n\nDerived encryption secret:", encryptionSecret);
        const thumbprint = await calculateJwkThumbprint({
          kty: "oct",
          k: base64url.encode(encryptionSecret),
        });
        console.log("\n\nManually derived thumbprint:", thumbprint);

        console.log("\n\nCurrent kid:", kid);
        if (kid === thumbprint) return encryptionSecret;
      }
      throw new Error("\nNo matching decryption secret");
    },
    {
      clockTolerance: 15,
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc, "A256GCM"],
    }
  );
  return payload as Payload;
}
