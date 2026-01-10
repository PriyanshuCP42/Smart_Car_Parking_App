import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { parkingService } from '../services/parkingService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notification, setNotification] = useState(null);
    const [notifVehicle, setNotifVehicle] = useState(null);
    const prevTicketsRef = useRef([]);
    const isFirstLoadRef = useRef(true);

    const notify = (message, vehicle = null) => {
        console.log('Notification triggered:', message, vehicle);
        setNotification(null);
        setNotifVehicle(null);

        // Use a ref to store the timeout ID to clear it if a new notification comes in
        if (window.notifTimeout) clearTimeout(window.notifTimeout);

        setTimeout(() => {
            setNotification(message);
            setNotifVehicle(vehicle);

            // Auto-clear after 6 seconds
            window.notifTimeout = setTimeout(() => {
                setNotification(null);
                setNotifVehicle(null);
            }, 6000);
        }, 50);
    };

    const clearNotification = () => {
        setNotification(null);
        setNotifVehicle(null);
    };

    // Background Polling for Status Changes
    useEffect(() => {
        if (!user || user.role !== 'USER') return;

        const pollStatus = async () => {
            try {
                const currentTickets = await parkingService.getActiveTickets();
                const ticketsArray = Array.isArray(currentTickets) ? currentTickets : (currentTickets ? [currentTickets] : []);

                if (isFirstLoadRef.current) {
                    prevTicketsRef.current = ticketsArray;
                    isFirstLoadRef.current = false;
                    return;
                }

                // Identify status changes
                ticketsArray.forEach(ticket => {
                    const prevTicket = prevTicketsRef.current.find(t => t.id === ticket.id);

                    if (prevTicket && prevTicket.status !== ticket.status) {
                        const vehicleData = ticket.vehicle;
                        const driverName = ticket.valet?.name || 'A driver';

                        console.log(`Status change for ${ticket.id}: ${prevTicket.status} -> ${ticket.status}`);

                        if (ticket.status === 'VALET_ASSIGNED_FOR_PARKING' && prevTicket.status === 'ACTIVE') {
                            notify(`🚗 Driver ${driverName} has accepted your parking request. They are on their way!`, vehicleData);
                        } else if (ticket.status === 'PARKED' && prevTicket.status !== 'PARKED') {
                            notify(`✅ Car Parked! Your vehicle is safely parked at spot ${ticket.spotNumber || 'assigned spot'}.`, vehicleData);
                        } else if (ticket.status === 'VALET_ASSIGNED_FOR_RETRIEVAL' && prevTicket.status === 'RETRIEVAL_REQUESTED') {
                            notify(`🔄 Driver ${driverName} has accepted your retrieval request and is heading to your car.`, vehicleData);
                        } else if (ticket.status === 'RETRIEVING' && prevTicket.status !== 'RETRIEVING') {
                            notify(`🏎️ Valet is driving your vehicle to the exit point. Please be ready.`, vehicleData);
                        }
                    }
                });

                // Check for disappearing tickets (COMPLETED)
                prevTicketsRef.current.forEach(prevTicket => {
                    const stillExists = ticketsArray.find(t => t.id === prevTicket.id);

                    if (!stillExists) {
                        console.log(`Ticket ${prevTicket.id} disappeared. Previous status: ${prevTicket.status}`);
                        if (['RETRIEVING', 'VALET_ASSIGNED_FOR_RETRIEVAL', 'RETRIEVAL_REQUESTED', 'PARKED'].includes(prevTicket.status)) {
                            notify(`🏁 Car Delivered! Your vehicle is ready at the exit. Thank you for using Smart Car Parking App! 👋`, prevTicket.vehicle);
                        }
                    }
                });

                prevTicketsRef.current = ticketsArray;
            } catch (error) {
                console.error('Notification polling error:', error);
            }
        };

        const interval = setInterval(pollStatus, 15000); // Polling every 15s for more responsiveness
        return () => clearInterval(interval);
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notify, notification, vehicle: notifVehicle, clearNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
