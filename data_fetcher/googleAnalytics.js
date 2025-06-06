import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
// Initialize the Google Analytics Data API client
const analyticsData = google.analyticsdata('v1beta');

async function getAnalyticsData() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;  // The private key from the environment variable
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;  // The client email from the environment variable
    const ga4PropertyId = process.env.GA4_PROPERTY_ID;  // Your GA4 Property ID from the environment variable

    // Set up Google authentication
    const auth = new GoogleAuth({
      credentials: {
        private_key: privateKey,
        client_email: clientEmail,
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const authClient = await auth.getClient();
    console.log('✅ Authentication successful.');

    // Helper function to fetch data for a date range
    async function fetchActiveUsers(rangeName, startDate, endDate) {
      const response = await analyticsData.properties.runReport({
        auth: authClient,
        property: `properties/${ga4PropertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'newUsers' },
            { name: 'activeUsers' },
            { name: 'averageSessionDuration' },
            { name: 'userEngagementDuration' }
          ],
        },
      });

      return response.data.rows.map(row => ({
        date: row.dimensionValues[0].value,
        newUsers: parseInt(row.metricValues[0].value),
        activeUsers: parseInt(row.metricValues[1].value),
        avgSessionDuration: parseFloat(row.metricValues[2].value),
        userEngagementDuration: parseFloat(row.metricValues[3].value),
        period: rangeName,
      }));
    }

    const periods = [7, 14, 28, 30, 60];
    const results = [];
    const activebydays = ['active7DayUsers', 'active14DayUsers', 'active28DayUsers', 'active30DayUsers', 'active60DayUsers'];

    for (const days of periods) {
      const recentStart = `${days}daysAgo`;
      const precedingStart = `${days * 2}daysAgo`;
      const precedingEnd = `${days}daysAgo`;

      const preceding = await fetchActiveUsers('preceding_period', precedingStart, precedingEnd);
      const recent = await fetchActiveUsers('last_period', recentStart, 'today');

      results.push({
        label: `last_${days}_days`,
        combined: [...preceding, ...recent],
      });
    }

    console.log('✅ All data fetched successfully');
    return results;

  } catch (error) {
    console.error('❌ Error during Google Analytics data fetching:', error);
    return [];
  }
}

export default getAnalyticsData;
