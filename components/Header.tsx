
import React from 'react';

interface HeaderProps {
  availableSeats: number;
  totalSeats: number;
}

const Header: React.FC<HeaderProps> = ({ availableSeats, totalSeats }) => {
  return (
    <header className="bg-white shadow-md p-6 mb-8">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-800">教室座席管理システム</h1>
        </div>
        <div className="text-lg text-gray-700">
          <span className="font-semibold text-green-600">{availableSeats}</span> / {totalSeats} 席 利用可能
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2 container mx-auto">
        注意: このシステムはデモンストレーション用です。データはGoogleスプレッドシートに保存されます。大規模利用やより堅牢なシステムには専用のバックエンドデータベースの導入を推奨します。
      </p>
    </header>
  );
};

export default Header;