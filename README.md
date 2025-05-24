# PerkPal

A comprehensive credit card rewards optimization platform powered by Perplexity's Sonar AI that helps users maximize the value of their credit card rewards through intelligent analysis and personalized recommendations.

## Features

- Credit card analysis and recommendations
- Partner programs tracking
- Card points tracking and optimization
- Credit Card Statement analysis
- Card details and rewards tracking
- Current Promotions & Offers Tracking
- Card Comparison and Recommendations

## Tech Stack

- AI: Sonar API by Perplexity
- Frontend: Next.js
- UI Framework: Shadcn UI
- Authentication: Clerk
- Database: Supabase
- Hosting: Vercel

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Perplexity API key
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/mithileshchellappan/perkpal.git
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
   - `PERPLEXITY_API_KEY`: Your Perplexity API key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
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

## Authentication

The app uses Clerk for authentication. Set up your Clerk environment variables in `.env.local` if you want to enable authentication.

## Learn More

Visit the Devpost project page for more details: [PerkPal](https://devpost.com/software/perkpal)
