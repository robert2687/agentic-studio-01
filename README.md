# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project requires Firebase configuration. Copy `.env.example` to `.env.local` and fill in your Firebase project credentials:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local` with your Firebase project settings from the [Firebase Console](https://console.firebase.google.com/).

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Deploying to Vercel

When deploying to Vercel, make sure to add all the required environment variables in your Vercel project settings:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add each of the Firebase configuration variables listed above
4. Redeploy your project

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Build

```bash
npm run build
```

