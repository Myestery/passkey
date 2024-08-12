import { generateRegistrationOptionsEx, verifyRegistrationResponseEx } from '../../lib/webauthn'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { username, attestation } = body

  try {
    if (attestation) {
      const verification = await verifyRegistrationResponseEx(username, attestation)
      return NextResponse.json({ verified: verification.verified })
    } else {
      const options = await generateRegistrationOptionsEx(username)
      return NextResponse.json(options)
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 })
  }
}