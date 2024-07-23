const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const placeCategories = [
  "โรงพยาบาลสัตว์",
  "โรงเเรมสัตว์เลี้ยงพักได้",
  "คาเฟ่-ร้านอาหาร",
  "อาบน้ำตัดขน",
  "โรงเเรมรับฝากสัตว์เลี้ยง",
  "ร้านค้าสำหรับสัตว์เลี้ยง",
  "สวนสาธารณะ",
  "คอมมูนิตี้มอลล์",
  "สนามวิ่งเล่น",
  "ศูนย์ฝึกสัตว์เลี้ยง",
  "สระว่ายน้ำ",
  "ร้านอุปกรณ์สัตว์เลี้ยง",
  "ร้านอาหารสัตว์",
  "คลินิกสัตว์"
];

const provinces = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี"];

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const API_URL = 'https://places.googleapis.com/v1/places:searchText';

async function fetchPlaces(placeCategory, province, pageToken = null) {
  const queryString = `${placeCategory} in ${province}`;
  const url = pageToken ? `${API_URL}?pageToken=${pageToken}` : API_URL;

  try {
    const response = await axios.post(url, {
      textQuery: queryString
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryType,places.currentOpeningHours.weekdayDescriptions,places.websiteUri,places.nationalPhoneNumber,places.businessStatus,places.rating,places.userRatingCount'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${queryString}:`, error.message);
    return null;
  }
}

async function fetchAllPlaces() {
  const results = {};

  for (const province of provinces) {
    results[province] = {};

    for (const category of placeCategories) {
      let allPlaces = [];
      let nextPageToken = null;

      do {
        const data = await fetchPlaces(category, province, nextPageToken);
        if (data && data.places) {
          allPlaces = allPlaces.concat(data.places);
          nextPageToken = data.nextPageToken;
        } else {
          nextPageToken = null;
        }
      } while (nextPageToken);

      results[province][category] = allPlaces;
    }
  }

  return results;
}

app.get('/fetch-places', async (req, res) => {
  try {
    const results = await fetchAllPlaces();
    await fs.writeFile('places_data.json', JSON.stringify(results, null, 2));
    res.json({ message: 'Data fetched and stored successfully', data: results });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching and storing data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});