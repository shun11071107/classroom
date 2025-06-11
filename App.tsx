
import React, { useState, useEffect, useCallback } from 'react';
import { Seat, StudentDetails, ModalType } from './types';
import { TOTAL_SEATS, NUM_ROWS, SEATS_PER_ROW } from './constants';
import Header from './components/Header';
import SeatGrid from './components/SeatGrid';
import CheckInModal from './components/CheckInModal';
import ConfirmCheckOutModal from './components/ConfirmCheckOutModal';
import LoadingSpinner from './components/LoadingSpinner';

// ★★★★★ 重要: デプロイしたGoogle Apps ScriptのウェブアプリURLに置き換えてください ★★★★★
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzxfXqUaHBph3VoYDQ9uKWRj0YNcE6Hg_ynkcCRLPDdRgmUq_wsx4zSBJutXu0grYK0/exec'; 

const App: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState<boolean>(true);
  const [isUpdatingSeat, setIsUpdatingSeat] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSeatsFromGAS = useCallback(async () => {
    if (GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      setErrorMessage("Google Apps ScriptのURLが設定されていません。App.tsxファイルを確認してください。");
      setIsFetchingInitialData(false);
      // フォールバックとして空の座席データを作成
      const emptySeats: Seat[] = [];
       for (let i = 0; i < NUM_ROWS; i++) {
        const rowChar = String.fromCharCode(65 + i);
        for (let j = 0; j < SEATS_PER_ROW; j++) {
          emptySeats.push({
            id: `${rowChar}${j + 1}`,
            rowChar: rowChar,
            seatNumInRow: j + 1,
            status: 'available',
            student: null,
            lastChanged: new Date().toISOString(),
          });
        }
      }
      setSeats(emptySeats);
      return;
    }

    setIsFetchingInitialData(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getSeats`);
      if (!response.ok) {
        let errorMsg = `Failed to fetch seats: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (e) {
            // If response is not JSON, use the original error
        }
        throw new Error(errorMsg);
      }
      const data: Seat[] | { error: string } = await response.json();
      if ('error' in data) {
        throw new Error(data.error);
      }
      // Ensure lastChanged is always present
      setSeats(data.map(seat => ({...seat, lastChanged: seat.lastChanged || new Date().toISOString() })));
    } catch (error: any) {
      console.error("Error fetching seats from GAS:", error);
      setErrorMessage(`座席データの読み込みに失敗しました: ${error.message}. GASの設定とURL、デプロイ状況を確認してください。`);
      if (seats.length === 0) { // Only set fallback if seats array is still empty
        const fallbackSeats: Seat[] = [];
        for (let i = 0; i < NUM_ROWS; i++) {
            const rowChar = String.fromCharCode(65 + i);
            for (let j = 0; j < SEATS_PER_ROW; j++) {
                fallbackSeats.push({
                    id: `${rowChar}${j+1}`,
                    rowChar,
                    seatNumInRow: j+1,
                    status: 'available', 
                    student: null, 
                    lastChanged: new Date().toISOString()
                });
            }
        }
        setSeats(fallbackSeats);
      }
    } finally {
      setIsFetchingInitialData(false);
    }
  }, [seats.length]); // seats.length removed as a dependency to avoid re-fetching when seats are updated locally, fetch only on mount or explicit call

  useEffect(() => {
    fetchSeatsFromGAS();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSeatsFromGAS]); // Added fetchSeatsFromGAS as dependency

  const handleSeatSelect = (seatId: string) => {
    if (isUpdatingSeat) return; 
    const seat = seats.find(s => s.id === seatId);
    if (seat) {
      setSelectedSeatId(seatId);
      if (seat.status === 'available') {
        setModalType('check-in');
      } else {
        setModalType('check-out');
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedSeatId(null);
    setModalType(null);
  };

  const handleCheckIn = async (seatId: string, studentDetails: StudentDetails) => {
    if (GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
       setErrorMessage("Google Apps ScriptのURLが設定されていません。チェックインできません。");
       handleCloseModal();
       return;
    }
    setIsUpdatingSeat(true);
    setErrorMessage(null);
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'checkIn', seatId, studentDetails }), 
      });
      const data = await response.json();
      if (!response.ok || data.error || !data.success) {
        throw new Error(data.error || 'Failed to check in seat.');
      }
       setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.id === seatId
            ? { 
                ...seat, 
                status: 'occupied', 
                student: studentDetails,
                lastChanged: data.seat?.lastChanged || new Date().toISOString()
              }
            : seat
        )
      );
    } catch (error: any) {
      console.error("Error checking in seat via GAS:", error);
      setErrorMessage(`チェックイン処理に失敗しました: ${error.message}`);
    } finally {
      setIsUpdatingSeat(false);
      handleCloseModal();
    }
  };

  const handleCheckOut = async (seatId: string) => {
     if (GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
       setErrorMessage("Google Apps ScriptのURLが設定されていません。チェックアウトできません。");
       handleCloseModal();
       return;
    }
    setIsUpdatingSeat(true);
    setErrorMessage(null);
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'checkOut', seatId }),
      });
      const data = await response.json();
       if (!response.ok || data.error || !data.success) {
        throw new Error(data.error || 'Failed to check out seat.');
      }
      setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.id === seatId
            ? { ...seat, status: 'available', student: null, lastChanged: data.seat?.lastChanged || new Date().toISOString() }
            : seat
        )
      );
    } catch (error: any) {
      console.error("Error checking out seat via GAS:", error);
      setErrorMessage(`チェックアウト処理に失敗しました: ${error.message}`);
    } finally {
      setIsUpdatingSeat(false);
      handleCloseModal();
    }
  };

  const availableSeatsCount = seats.filter(s => s.status === 'available').length;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Header availableSeats={availableSeatsCount} totalSeats={TOTAL_SEATS} />
      
      <main className="container mx-auto px-4">
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
            <p className="font-bold">エラー</p>
            <p>{errorMessage}</p>
          </div>
        )}
        {isFetchingInitialData ? (
          <div className="flex flex-col items-center justify-center py-10">
            <LoadingSpinner />
            <p className="text-gray-600 mt-2">座席情報を読み込んでいます...</p>
          </div>
        ) : (
          <SeatGrid seats={seats} onSelectSeat={handleSeatSelect} />
        )}
      </main>

      {modalType === 'check-in' && selectedSeatId && (
        <CheckInModal
          seatId={selectedSeatId}
          onClose={handleCloseModal}
          onCheckIn={handleCheckIn}
        />
      )}

      {modalType === 'check-out' && selectedSeatId && (
        <ConfirmCheckOutModal
          seatId={selectedSeatId}
          onClose={handleCloseModal}
          onConfirm={handleCheckOut}
        />
      )}
      
      {(isUpdatingSeat && !modalType) && (
         <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-60">
            <LoadingSpinner />
            <p className="ml-2">座席情報を更新中...</p>
        </div>
      )}

      <footer className="text-center text-sm text-gray-500 mt-12 py-4 border-t border-gray-300">
        <p>&copy; {new Date().getFullYear()} Classroom Seat Management Demo. All rights reserved.</p>
        <p className="mt-1">データはGoogleスプレッドシートに保存されています。これはデモンストレーション用アプリケーションです。</p>
      </footer>
    </div>
  );
};

export default App;
