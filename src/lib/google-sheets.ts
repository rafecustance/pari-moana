import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Parse the private key from environment variable.
 * Handles various formats the key might be stored in.
 */
function parsePrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  
  let parsedKey = key;
  
  // Remove surrounding quotes if present (some env loaders keep them)
  if ((parsedKey.startsWith('"') && parsedKey.endsWith('"')) ||
      (parsedKey.startsWith("'") && parsedKey.endsWith("'"))) {
    parsedKey = parsedKey.slice(1, -1);
  }
  
  // Convert literal \n strings to actual newlines
  parsedKey = parsedKey.replace(/\\n/g, '\n');
  
  return parsedKey;
}

/**
 * Get authenticated Google Sheets client using service account credentials.
 */
function getGoogleSheetsClient() {
  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  
  if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY environment variable is not set');
  }
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is not set');
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

export interface RegistrationData {
  email: string;
  timestamp: string;
  utmCampaign: string | null;
  country: string;
}

/**
 * Append a registration row to the Google Sheet.
 * Row format: [Email, Timestamp, UTM Campaign, Country]
 */
export async function appendRegistration(data: RegistrationData): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID environment variable is not set');
  }

  const values = [[
    data.email,
    data.timestamp,
    data.utmCampaign || '',
    data.country,
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:D',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values,
    },
  });
}
