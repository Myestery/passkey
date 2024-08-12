# WebAuthn Passkey System with Ed25519

This project implements a passkey system using the WebAuthn API with Ed25519 key pairs. It allows users to authenticate their Ed25519 key pair without revealing it, demonstrating both registration and authentication processes.

## Features

- WebAuthn-based passkey system
- Ed25519 key pair support
- User registration and authentication
- Next.js for frontend and backend
- Postgres database with Prisma ORM
- Vercel Postgres compatibility

## Prerequisites

- Node.js (v14 or later)
- npm
- A Postgres database (e.g., Vercel Postgres)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/myestery/nillion-passkey.git
   cd nillion-passkey
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Postgres connection string:
   ```
   DATABASE_URL="postgres://your-connection-string-here"
   ```

4. Initialize Prisma and generate the client:
   ```
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project is set up for easy deployment on Vercel:

1. Push your code to a GitHub repository.
2. Create a new project on Vercel and link it to your GitHub repository.
3. In the Vercel project settings, add your `DATABASE_URL` as an environment variable.
4. Deploy the project.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
