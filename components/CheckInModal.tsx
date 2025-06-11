
import React, { useState } from 'react';
import { StudentDetails } from '../types';
import { GRADES, CLASSES } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface CheckInModalProps {
  seatId: string;
  onClose: () => void;
  onCheckIn: (seatId: string, studentDetails: StudentDetails) => Promise<void>;
  // generateNameFunction prop removed
}

const CheckInModal: React.FC<CheckInModalProps> = ({ seatId, onClose, onCheckIn }) => {
  const [grade, setGrade] = useState<string>(GRADES[0]);
  const [className, setClassName] = useState<string>(CLASSES[0]);
  const [studentNumber, setStudentNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Renamed from isLoading for clarity
  const [error, setError] = useState<string>('');
  // generatedName state and related logic removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade || !className || !studentNumber.trim()) {
      setError('すべての項目を入力してください。');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      // Name generation logic removed
      await onCheckIn(seatId, { grade, className, studentNumber: studentNumber.trim() });
      // No timeout needed as name generation is removed
      setIsProcessing(false);
      onClose();
      
    } catch (apiError: any) {
      console.error("CheckInModal handleSubmit error:", apiError);
      setError(`処理中にエラーが発生しました: ${apiError.message || '不明なエラー'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">座席 {seatId} を利用開始</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">学年</label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={isProcessing}
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">クラス</label>
            <select
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={isProcessing}
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">出席番号</label>
            <input
              type="text"
              id="studentNumber"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: 1番、001"
              required
              disabled={isProcessing}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {/* generatedName message removed */}

          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out"
              >
                利用開始
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out"
              >
                キャンセル
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;