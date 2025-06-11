
import React from 'react';
import { Seat as SeatType } from '../types';
import Seat from './Seat';
import { NUM_ROWS, SEATS_PER_ROW } from '../constants';


interface SeatGridProps {
  seats: SeatType[];
  onSelectSeat: (seatId: string) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, onSelectSeat }) => {
  if (!seats.length) {
    return <p className="text-center text-gray-500">座席情報を読み込み中です...</p>;
  }

  const rows: SeatType[][] = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    rows.push(seats.slice(i * SEATS_PER_ROW, (i + 1) * SEATS_PER_ROW));
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">座席表 (クリックして入退室)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(NUM_ROWS)].map((_, rowIndex) => (
          <div key={`row-container-${rowIndex}`} className="mb-2">
             <div className="text-sm font-bold text-gray-600 mb-1 ml-1"> {String.fromCharCode(65 + rowIndex)}列</div>
            <div className="flex flex-wrap justify-center bg-gray-200 p-2 rounded">
              {seats.filter(seat => seat.rowChar === String.fromCharCode(65 + rowIndex)).map((seat) => (
                <Seat key={seat.id} seat={seat} onSelectSeat={onSelectSeat} />
              ))}
            </div>
          </div>
        ))}
      </div>
       <div className="mt-6 p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">凡例</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">空席 (利用可能)</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">利用中</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
    