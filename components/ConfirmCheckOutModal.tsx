
import React from 'react';

interface ConfirmCheckOutModalProps {
  seatId: string;
  onClose: () => void;
  onConfirm: (seatId: string) => void;
}

const ConfirmCheckOutModal: React.FC<ConfirmCheckOutModalProps> = ({ seatId, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">座席 {seatId} を退室</h2>
        <p className="text-gray-600 mb-8 text-center">この座席の利用を終了しますか？</p>
        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={() => {
              onConfirm(seatId);
              onClose();
            }}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out"
          >
            はい、退室します
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCheckOutModal;
    