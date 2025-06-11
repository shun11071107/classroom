
export interface StudentDetails {
  grade: string;
  className: string; // 'className' to avoid conflict with 'class' keyword in JS/TS
  studentNumber: string;
}

export interface Seat {
  id: string;
  rowChar: string;
  seatNumInRow: number;
  status: 'available' | 'occupied';
  student?: StudentDetails | null; // Details of the student occupying the seat (not for public display on grid)
  lastChanged?: string; // Timestamp of last status change (ISO string)
}

export type ModalType = 'check-in' | 'check-out' | null;