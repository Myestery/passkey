# WebAuthn Passkey System with Ed25519

This project implements a WebAuthn-based passkey system using Ed25519 key pairs. It demonstrates both registration and authentication processes, allowing users to create and use passkeys on supported devices without revealing their private keys.

## Features

- WebAuthn-based passkey implementation
- Ed25519 key pair support
- User registration and authentication
- Next.js for frontend and backend
- PostgreSQL database with Prisma ORM
- Tailwind CSS for styling

## Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL database
- A WebAuthn-capable browser (e.g., Chrome, Edge, or Firefox)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/myestery/passkey.git
cd passkey
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory and add your PostgreSQL connection string:
    
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
RP_ID="localhost"
APP_URL="http://localhost:3000"
```

4. Initialize Prisma and generate the client:
    
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Registration:
- Enter a username in the "Register" form.
- Click "Register" to initiate the WebAuthn registration process.
- Follow your browser's prompts to create a new passkey.

2. Authentication:
- Enter the same username in the "Authenticate" form.
- Click "Authenticate" to start the WebAuthn authentication process.
- Follow your browser's prompts to use your passkey.

## Trust Model

In this implementation, the trusted parties are:

1. The Authenticator: This is the device or platform (e.g., built-in fingerprint sensor, security key) that securely stores the private key and performs cryptographic operations.

2. The User's Device (Browser): The browser acts as an intermediary between the authenticator and the server, implementing the WebAuthn API.

The server and the application itself are not considered trusted parties. They never have access to the private key, which remains securely stored in the authenticator. The server only stores and verifies the public key data.

Key security aspects:
- The private key never leaves the authenticator.
- The server only receives and stores public key data.
- Cryptographic challenges ensure the authenticity of each authentication attempt.
- The WebAuthn protocol provides protection against phishing and man-in-the-middle attacks.

## How It Works

1. Registration:
- The server generates registration options, including a challenge.
- The client (browser) requests the authenticator to create a new key pair.
- The authenticator generates the key pair and returns the public key and other metadata.
- The server verifies the registration response and stores the public key.

2. Authentication:
- The server generates authentication options, including a challenge.
- The client requests the authenticator to sign the challenge with the private key.
- The authenticator performs the signing operation.
- The server verifies the signature using the stored public key.

Throughout this process, the private key never leaves the authenticator, ensuring its security.

## Project Structure

```bash
passkey/
├── app/
│   ├── api/
│   │   ├── register/
│   │   │   └── route.ts
│   │   └── authenticate/
│   │       └── route.ts
│   ├── components/
│   │   ├── RegisterForm.tsx
│   │   └── AuthenticateForm.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── webauthn.ts
│   ├── layout.tsx
│   └── page.tsx
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Development

To run the project in development mode:
```bash
npm run dev
```

This starts the development server on [http://localhost:3000](http://localhost:3000).

## Production

To build the project for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Testing on Mobile Devices

To test on a mobile device:

1. Ensure your computer and mobile device are on the same network.
2. Find your computer's local IP address.
3. Update the `RP_ID` in `.env` to your local IP address.
4. Start the server with:
```bash
npm run dev -- -H 0.0.0.0
```

5. On your mobile device, visit `http://<YOUR_COMPUTER_IP>:3000`

Note: For production use, always use HTTPS and update the `rpID` and `origin` to your actual domain.

## Browser Support

This implementation uses Ed25519 key pairs, which are supported in:
- Chrome/Chromium-based browsers (version 108+)
- Safari (version 16+)
- Firefox (version 103+)

For broader compatibility, consider supporting both Ed25519 (-8) and ECDSA P-256 (-7) algorithms.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
