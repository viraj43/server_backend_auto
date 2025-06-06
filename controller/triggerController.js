// routes.js
import getAnalyticsData from '../data_fetcher/googleAnalytics.js';
import sendToSlack from '../slack_notifier/slack_notifier.js';
import { fetchCountryData } from '../data_fetcher/fetchCountryData.js';
import { generateCountryTableImage } from '../graph_generator/generateCountryTableImage.js';
import { sendCountryReportToSlack } from '../slack_notifier/sendCountryReportToSlack.js';

// Trigger only Google Analytics report
export const triggerGoogleAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    await sendToSlack(analyticsData);
    res.status(200).send('Google Analytics report sent to Slack successfully!');
  } catch (error) {
    console.error('Error in triggerGoogleAnalytics:', error);
    res.status(500).send('Error: ' + error.message);
  }
};

// Trigger only country-level report
export const triggerCountry = async (req, res) => {
  try {
    const countryData = await fetchCountryData();
    const imagePath = await generateCountryTableImage(countryData);
    await sendCountryReportToSlack(countryData, imagePath);
    res.status(200).send('Country report sent to Slack successfully!');
  } catch (error) {
    console.error('Error in triggerCountry:', error);
    res.status(500).send('Error: ' + error.message);
  }
};

// Helper for delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
