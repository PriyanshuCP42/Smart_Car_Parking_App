import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Helper to map backend data layout to frontend expectations if needed
// Backend: { id, userId, vehicleId, gateId, spotNumber, status, entryTime, vehicle: {...} }
// Frontend expects: { id, vehicleId, status, entryTime, spot, entryGate, vehicleId (for display) }

export const parkingService = {
    getActiveTickets: async () => {
        try {
            const response = await axios.get(`${API_URL}/tickets/active`);
            return response.data; // Now returns an array of tickets
        } catch (error) {
            console.error('Error fetching active sessions:', error);
            if (error.response && error.response.status === 404) {
                return []; // Return empty array if none found
            }
            throw error;
        }
    },

    scanQR: async (data) => {
        // data: { vehicleId, gate }
        try {
            const response = await axios.post(`${API_URL}/tickets/create`, {
                vehicleId: data.vehicleId,
                gateId: data.gate
            });
            return {
                success: true,
                message: 'Session created',
                session: response.data
            };
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    },

    completeSession: async () => {
        try {
            const response = await axios.post(`${API_URL}/tickets/complete`);
            return response.data;
        } catch (error) {
            console.error('Error completing session:', error);
            throw error;
        }
    },

    getHistory: async () => {
        try {
            const response = await axios.get(`${API_URL}/tickets/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    },

    requestRetrieval: async (ticketId) => {
        try {
            const response = await axios.post(`${API_URL}/tickets/request-retrieval`, { ticketId });
            return response.data;
        } catch (error) {
            console.error('Error requesting retrieval:', error);
            throw error;
        }
    },

    // Driver API
    getAvailableJobs: async () => {
        try {
            const response = await axios.get(`${API_URL}/driver/jobs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available jobs:', error);
            throw error;
        }
    },

    acceptJob: async (ticketId) => {
        try {
            const response = await axios.post(`${API_URL}/driver/accept`, { ticketId });
            return response.data;
        } catch (error) {
            console.error('Error accepting job:', error);
            throw error;
        }
    },

    getCurrentJob: async () => {
        try {
            const response = await axios.get(`${API_URL}/driver/current`);
            return response.data;
        } catch (error) {
            console.error('Error fetching current job:', error);
            throw error;
        }
    },

    updateJobStatus: async (ticketId, status) => {
        try {
            const response = await axios.post(`${API_URL}/driver/update-status`, { ticketId, status });
            return response.data;
        } catch (error) {
            console.error('Error updating job status:', error);
            throw error;
        }
    },

    getDriverHistory: async () => {
        try {
            const response = await axios.get(`${API_URL}/driver/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching driver history:', error);
            throw error;
        }
    }
};
