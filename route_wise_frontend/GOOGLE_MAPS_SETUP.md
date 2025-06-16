# Google Maps Integration Setup

## Overview
The RouteWise TMS system includes Google Maps integration to display pickup and destination addresses for orders on an interactive map.

## Setup Instructions

1. **Get Google Maps API Key**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API" and "Geocoding API"
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Configure Environment Variable**
   - Create a `.env.local` file in the `route_wise_frontend` directory
   - Add the following line:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
   - **Note**: `.env.local` is automatically gitignored and won't be committed to version control

3. **Features**
   - **Order Maps Component**: Shows pickup (green) and destination (red) markers
   - **Interactive Info Windows**: Click markers to see order details
   - **Company-Specific Filtering**: Only shows orders for the user's company
   - **Auto-Fit Bounds**: Map automatically adjusts to show all markers

## Usage
- Navigate to Order Routes page (under Orders dropdown in sidebar)
- Click "View on Map" button for any specific order
- Map opens showing two markers:
  - Green marker with "P" for pickup location
  - Red marker with "D" for destination location
- Click on markers to see detailed order information
- Map automatically adjusts to show both locations optimally

## Fallback
If no API key is provided, the system will show a message indicating that the Google Maps API key is required for map functionality. 