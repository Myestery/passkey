import * as dotenv from "dotenv";

import {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import {
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";

import prisma from "./prisma";

dotenv.config();
const rpName = "My Passkey App";
const rpID = process.env.RP_ID as string;
const origin = process.env.APP_URL as string;

async function getUser(username: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  return user;
}

async function saveUser(
  username: string,
  challenge: string | null,
  authenticator: any
) {
  return await prisma.user.upsert({
    where: { username },
    update: {
      currentChallenge: challenge,
      registeredAuthenticator: authenticator,
    },
    create: {
      username,
      currentChallenge: challenge,
      registeredAuthenticator: authenticator,
    },
  });
}

export async function generateRegistrationOptionsEx(
  username: string
): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const user = await getUser(username);
  const userId = user ? user.id : Date.now();

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: isoUint8Array.fromUTF8String(userId.toString()),
    userName: username,
    attestationType: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "preferred",
    },
    challenge: "simplewebauthn",
    supportedAlgorithmIDs: [-8, -7], // Ed25519
  });

  await saveUser(username, (await options).challenge, null);
  return options;
}

export async function verifyRegistrationResponseEx(
  username: string,
  response: RegistrationResponseJSON
): Promise<VerifiedRegistrationResponse> {
  const user = await getUser(username);
  if (!user) throw new Error("User not found");

  const verification = await verifyRegistrationResponse({
    response,
    // expectedChallenge: expectedChallenge as string,
    expectedChallenge: isoBase64URL.fromUTF8String("simplewebauthn"),
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });

  if (verification.verified) {
    await saveUser(username, null, verification.registrationInfo);
  }

  return verification;
}

export async function generateAuthenticationOptionsEx(
  username: string
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const user = await getUser(username);
  if (!user) throw new Error("User not found");

  const authenticator =
    user.registeredAuthenticator as unknown as AuthenticatorDevice;

  const options = generateAuthenticationOptions({
    rpID,
    allowCredentials: [
      {
        id: authenticator.credentialID as unknown as string,
      },
    ],
    userVerification: "preferred",
  });

  await saveUser(
    username,
    (
      await options
    ).challenge,
    user.registeredAuthenticator
  );
  return options;
}

export async function verifyAuthenticationResponseEx(
  username: string,
  response: AuthenticationResponseJSON
): Promise<VerifiedAuthenticationResponse> {
  const user = (await getUser(username)) as {
    id: number;
    username: string;
    currentChallenge: string | null;
    registeredAuthenticator: Record<string, any>;
  };
  if (!user) throw new Error("User not found");

  const authenticator = {
    credentialID: user.registeredAuthenticator.credentialID as string,
    credentialPublicKey: new Uint8Array(
      Buffer.from(user.registeredAuthenticator.credentialPublicKey, "base64")
    ),
    counter: user.registeredAuthenticator.counter,
  };

  const expectedChallenge = user.currentChallenge as string;

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
      requireUserVerification: true,
    });
  } catch (error) {
    console.log(error);
    throw new Error("auth failed");
  }

  return verification;
}
