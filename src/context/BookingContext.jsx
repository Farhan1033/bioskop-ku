import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [scheduleId, setScheduleId] = useState(null);
  const [idBooking, setIdBooking] = useState(null);

  return (
    <BookingContext.Provider value={{ scheduleId, setScheduleId, idBooking, setIdBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
