import {
  generateAuthenticationOptionsEx,
  verifyAuthenticationResponseEx,
} from "../../lib/webauthn";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, assertion } = body;

  try {
    if (assertion) {
      const verification = await verifyAuthenticationResponseEx(
        username,
        assertion
      );
      return NextResponse.json({ verified: verification.verified });
    } else {
      const options = await generateAuthenticationOptionsEx(username);
      return NextResponse.json(options);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
