import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const alg = 'HS256';
const iss = 'urn:dechnology:future-xplorer:auth';
const aud = 'urn:dechnology:future-xplorer:api';
const config = useRuntimeConfig();
const secretKey = config.jwtSecretKey;
const secret = new TextEncoder().encode(secretKey);

export const generateToken = async (
  payload: JWTPayload,
  exp?: string | number
) => {
  const token = new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(iss)
    .setAudience(aud);

  if (exp) {
    token.setExpirationTime(exp);
  }

  return await token.sign(secret);
};

export const VerifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret, {
    issuer: iss,
    audience: aud,
  });
  return payload;
};
