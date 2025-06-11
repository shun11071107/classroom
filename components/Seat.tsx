
import React from 'react';
import { Seat as SeatType } from '../types';

interface SeatProps {
  seat: SeatType;
  onSelectSeat: (seatId: string) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, onSelectSeat }) => {
  const seatColor = seat.status === 'available' 
    ? 'bg-green-500 hover:bg-green-600' 
    : 'bg-red-500 hover:bg-red-600';
  
  const textColor = 'text-white';

  return (
    <button
      onClick={() => onSelectSeat(seat.id)}
      className={`p-2 w-20 h-20 m-1 rounded-lg shadow-md flex flex-col justify-center items-center transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${seatColor} ${textColor}`}
      aria-label={`Seat ${seat.id}, status ${seat.status}`}
    >
      <span className="font-bold text-lg">{seat.id}</span>
      <span className="text-xs mt-1">{seat.status === 'available' ? '空席' : '利用中'}</span>
    </button>
  );
};

export default Seat;
    