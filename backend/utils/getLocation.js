const axios = require("axios");

const getLocation = async (lat, lon) => {
    try {
        // Make a request to the Nominatim API
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);

        console.log(response.data)
        return response.data;
    } catch (error) {
        return Error("Unable to fetch location details", 500);
    }
};

module.exports = getLocation;
