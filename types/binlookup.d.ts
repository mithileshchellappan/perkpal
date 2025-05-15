declare module 'binlookup' {
  interface BinLookupResponse {
    bin: string;
    bank: {
      name: string;
      url: string;
      phone: string;
      city: string;
    };
    card: {
      type: string;
      category: string;
      scheme: string;
      brand: string;
    };
    country: {
      name: string;
      alpha2: string;
      numeric: string;
      currency: string;
    };
  }

  function binlookup(bin: string, callback: (err: Error, data: BinLookupResponse) => void): void;
  
  export = binlookup;
} 