import axios from 'axios';

export const hotelMicroserviceApi = axios.create({
    baseURL: 'https://travelhotelcdn.seindo.dev/api/v2026',
    headers: {
        AccessPermissionToken: 'master-access-token',
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
