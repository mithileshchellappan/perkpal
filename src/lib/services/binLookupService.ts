import axios from 'axios';

export interface BinLookupResponse {
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
    scheme: 'visa' | 'mastercard' | 'unknown';
    brand: string;
  };
  country: {
    name: string;
    alpha2: string;
    numeric: string;
    currency: string;
  };
}

/**
 * Alternative approach using a direct API call to binlist.net
 * This is useful as a fallback if the library approach fails
 */
export async function lookupBinUsingAPI(bin: string): Promise<any> {
  try {
    // Using the free and open binlist.net API
    const response = await axios.get(`https://lookup.binlist.net/${bin}`);
    console.log('BIN lookup successful:', response.data);
    // Mapping to our expected response format
    return {
      bin,
      bank: {
        name: response.data.bank?.name || 'Unknown',
        url: response.data.bank?.url || '',
        phone: response.data.bank?.phone || '',
        city: response.data.bank?.city || '',
      },
      card: {
        type: response.data.type || '',
        category: response.data.category || '',
        scheme: response.data.scheme || '',
        brand: response.data.brand || '',
      },
      country: {
        name: response.data.country?.name || '',
        alpha2: response.data.country?.alpha2 || '',
        numeric: response.data.country?.numeric || '',
        currency: response.data.country?.currency || '',
      },
    };
  } catch (error) {
    console.error('Error looking up BIN via API:', error);
    throw new Error('Failed to look up BIN via API');
  }
}

/**
 * Lookup a BIN, trying multiple methods if necessary
 */
export async function lookupBin(bin: string): Promise<BinLookupResponse> {
  try {
    // First try the library approach
    return await lookupBinUsingAPI(bin);
  } catch (error) {
    throw error;
  }
} 