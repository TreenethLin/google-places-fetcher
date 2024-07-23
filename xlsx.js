const fs = require('fs').promises;
const XLSX = require('xlsx');

const filePath = './places_data.json';
const outputFilePath = './places_data.xlsx';

function processPlace(place, province, category) {
    return {
        "province": province,
        "category": category,
        "id": place.id || "",
        "displayName.text": place.displayName?.text || "",
        "formattedAddress": place.formattedAddress || "",
        "location.latitude": place.location?.latitude || "",
        "location.longitude": place.location?.longitude || "",
        "googleMapsUri": place.googleMapsUri || "",
        "primaryType": place.primaryType || "",
        "currentOpeningHours.weekdayDescriptions": (place.currentOpeningHours?.weekdayDescriptions || []).join(", "),
        "websiteUri": place.websiteUri || "",
        "nationalPhoneNumber": place.nationalPhoneNumber || "",
        "businessStatus": place.businessStatus || "",
        "rating": place.rating || "",
        "userRatingCount": place.userRatingCount || ""
    };
}

async function processJsonToExcel() {
    try {
        // Read and parse the JSON file
        const jsonData = JSON.parse(await fs.readFile(filePath, 'utf-8'));

        // Process each place entry in the JSON data
        const processedData = Object.entries(jsonData).flatMap(([province, categories]) => 
            Object.entries(categories).flatMap(([category, places]) => 
                places.map(place => processPlace(place, province, category))
            )
        );

        // Define the column order
        const columnOrder = [
            "province", "category", "id", "displayName.text", "formattedAddress", 
            "location.latitude", "location.longitude", "googleMapsUri", 
            "primaryType", "currentOpeningHours.weekdayDescriptions", 
            "websiteUri", "nationalPhoneNumber", "businessStatus", 
            "rating", "userRatingCount"
        ];

        // Create a new workbook and add a worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData, { header: columnOrder });

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Places Data");

        // Write the workbook to a file
        XLSX.writeFile(workbook, outputFilePath);

        console.log(`Excel file saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing JSON to Excel:', error);
    }
}

processJsonToExcel();