import axios from 'axios';

const BASE_URL =
    import.meta.env.VITE_API_BACKEND_SERVER_URL ||
    import.meta.env.VITE_API_BACKEND_LOCAL_URL;

const API_URL = `${BASE_URL}/api/vehicles`;

export const vehicleService = {
    getAll: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            throw error;
        }
    },

    add: async (vehicleData) => {
        try {
            const response = await axios.post(`${API_URL}/add`, vehicleData);
            return response.data;
        } catch (error) {
            console.error("Error adding vehicle:", error);
            throw error;
        }
    },

    getOne: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching vehicle:", error);
            throw error;
        }
    }
};
