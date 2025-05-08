# PerkPal - Credit Card Rewards Optimizer

PerkPal is a powerful credit card rewards optimizer built for the [Perplexity API Hackathon](https://perplexityhackathon.devpost.com/). It helps users maximize their credit card rewards by providing detailed insights into their cards' earning potential, redemption options, and strategic use.

## Features

- **BIN Lookup**: Enter your card's first 6-8 digits to automatically identify your bank and card type.
- **Card Suggestions**: Get a list of card products offered by your bank.
- **Card Analysis**: Get comprehensive insights about your card's rewards structure, redemption options, and transfer partners.
- **Promotions**: Stay updated with the latest promotions and offers to maximize your points value.

## Technologies Used

- **Next.js**: React framework for building the frontend and API endpoints
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Perplexity API**: Powers the card suggestions, analysis, and promotions data
- **BIN Lookup**: Used to identify credit cards based on their BIN

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- NPM or Yarn
- Perplexity API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/perkpal.git
   cd perkpal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Perplexity API key:
   ```
   PERPLEXITY_API_KEY=your_perplexity_api_key
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## API Endpoints

- **POST /api/bin-lookup**: Look up a credit card's BIN to determine the issuing bank and card network.
- **POST /api/card-suggestions**: Retrieve a list of card products offered by a specified bank.
- **POST /api/card-analysis**: Get comprehensive details about a specific credit card.
- **POST /api/promotions**: Retrieve current promotions for a specific credit card or its rewards ecosystem.

## Project Structure

```
perkpal/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── api/       # API routes
│   │   ├── dashboard/ # Dashboard page
│   │   ├── api-docs/  # API documentation
│   │   └── ...        # Other pages
│   ├── lib/           # Utilities and services
│   │   └── services/  # Service modules
│   └── types/         # TypeScript type definitions
└── ...                # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Perplexity API](https://perplexity.ai/) for powering the card data and analysis
- [BIN Lookup](https://binlist.net/) for providing credit card identification
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
