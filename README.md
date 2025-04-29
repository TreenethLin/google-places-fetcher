# Pet-Friendly Places Finder API

A Node.js Express server that fetches pet-friendly locations across Thailand using the Google Places API.

## Overview

This application searches for various pet-friendly locations across major Thai provinces and categorizes them by type. It uses Google Places API to fetch comprehensive location data and stores the results in a JSON file.

## Features

- Fetches 14 different categories of pet-friendly places
- Covers 3 major Thai provinces (Bangkok, Nonthaburi, Pathum Thani)
- Handles pagination for large result sets
- Stores comprehensive location details including:
  - Name and address
  - Geographic coordinates
  - Google Maps link
  - Business hours
  - Website and phone number
  - Ratings and review counts
  - Business status

## Categories

The API searches for the following pet-friendly place categories:
- Animal hospitals
- Pet-friendly hotels
- Cafes and restaurants
- Pet grooming services
- Pet boarding facilities
- Pet shops
- Parks
- Community malls
- Dog runs/playgrounds
- Pet training centers
- Swimming pools for pets
- Pet supply stores
- Pet food stores
- Animal clinics

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install express axios dotenv
   ```
3. Create a `.env` file in the root directory with your Google Places API key:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the server:
   ```
   node app.js
   ```

## API Endpoints

### GET /fetch-places
Fetches all pet-friendly places from all categories across all configured provinces.

**Response:**
- Success: Returns a message and the fetched data
- Failure: Returns a 500 status code with an error message

The data is also stored in a `places_data.json` file in the root directory.
