import { createContext, useState, useContext } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [scheduleId, setScheduleId] = useState(null);

    return (
        <BookingContext.Provider value={{ scheduleId, setScheduleId }}>
            {children}
        </BookingContext.Provider>
    )
};

export function useBooking() {
    return useContext(BookingContext);
} 