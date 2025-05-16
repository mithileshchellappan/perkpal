# PerkPal

A credit card management and optimization platform.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/perkpal.git
   cd perkpal
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit the `.env.local` file and add your own values for:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Setting up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migration script to create the required tables
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy the contents of the `scripts/supabase-schema.sql` file
   - Paste it into the SQL Editor and run the queries

### Running the application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Credit card analysis and recommendations
- Partner programs tracking
- Card points tracking and optimization
- Statement analysis

## Authentication

The app uses Clerk for authentication. Set up your Clerk environment variables in `.env.local` if you want to enable authentication.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
