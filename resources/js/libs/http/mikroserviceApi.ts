import axios from 'axios';

export const hotelMicroserviceApi = axios.create({
    baseURL: import.meta.env.VITE_HOTEL_MICROSERVICE_API_URL ?? "https://travelhotelcdn.seindo.dev/api/v2026",
    headers: {
        AccessPermissionToken: import.meta.env.HOTEL_MICROSERVICE_API_ACCESS_PERMISSION_TOKEN ?? "master-access-token",
        Accept: 'application/json',
    },
});

// travelApi.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.error("Travel API Error:", error.response?.data || error.message);
//         return Promise.reject(error);
//     }
// );
