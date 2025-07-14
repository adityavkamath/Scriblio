import { jwtDecrypt, calculateJwkThumbprint, base64url } from "jose";
import { hkdf } from "@panva/hkdf";
import WebSocket from "ws";

export interface CustomSocket extends WebSocket {
    token: string;
    userId: string;
}
export interface User {
    userId: string;
    ws: CustomSocket;
    rooms: Set<string>;
}

export interface ParseData {
    type: string,
    roomId: string,
    id?: string,
    message?: string,
}
interface JWT extends Record<string, unknown> {
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string
    iat?: number
    exp?: number
    jti?: string
}
export interface JWTDecodeParams {
    salt: string
    secret: string | string[]
    token?: string
}

const alg = "dir";
const enc = "A256CBC-HS512";

async function getDerivedEncryptionKey(enc: string, keyMaterial: string, salt: string) {
    let length = enc === "A256CBC-HS512" ? 64 : 32;
    return await hkdf(
        "sha256",
        Buffer.from(keyMaterial),
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
            for (const secret of secrets) {
                const encryptionSecret = await getDerivedEncryptionKey(enc, secret, salt);
                if (!kid) return encryptionSecret;
                const thumbprint = await calculateJwkThumbprint(
                    { kty: "oct", k: base64url.encode(encryptionSecret) },
                    `sha${encryptionSecret.byteLength << 3}` as any
                );
                if (kid === thumbprint) return encryptionSecret;
            }
            throw new Error("no matching decryption secret");
        },
        {
            clockTolerance: 15,
            keyManagementAlgorithms: [alg],
            contentEncryptionAlgorithms: [enc, "A256GCM"],
        }
    );
    return payload as Payload;
}
