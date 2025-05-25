import React, { createContext, useContext, useState } from 'react';

const SelectedSeatsContext = createContext();

export const SelectedSeatsProvider = ({ children }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (seatData, maxQuantity) => {
        const seatId = seatData.id.toString();
        setSelectedSeats(prev => {
            const isSelected = prev.find(seat => seat.id === seatId);

            if (isSelected) {
                return prev.filter(seat => seat.id !== seatId);
            } else if (prev.length < maxQuantity) {
                return [...prev, seatData];
            } else {
                return prev;
            }
        });
    };

    const clearSelectedSeats = () => {
        setSelectedSeats([]);
    };

    const isMaximumSelected = (maxQuantity) => {
        return selectedSeats.length >= maxQuantity;
    };

    return (
        <SelectedSeatsContext.Provider value={{
            selectedSeats,
            toggleSeat,
            clearSelectedSeats,
            isMaximumSelected,
        }}>
            {children}
        </SelectedSeatsContext.Provider>
    );
};

export function useSeats() {
    const context = useContext(SelectedSeatsContext);
    if (!context) {
        throw new Error('useSeats must be used within a SelectedSeatsProvider');
    }
    return context;
}
