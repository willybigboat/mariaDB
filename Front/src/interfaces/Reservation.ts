export interface Reservation {
  reservation_id: number;
  student_id: string;
  seat_id: number;
  timeslot_id: number;
  create_time: Date;
}

export interface ReservationQueryParams {
  studentId?: string;
  seatId?: number;
  timeslotId?: number;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// 用於前端顯示的擴展預約資訊
export interface ReservationDisplay extends Reservation {
  // 這些欄位可以在將來從後端取得，目前先定義它們
  student_name?: string;
  seat_label?: string; // 例如："A5" (行號+座號)
  timeSlot_display?: string; // 例如："09:00-10:00"
}

// 前端狀態管理相關介面
export interface ReservationState {
  reservations: ReservationDisplay[];
  loading: boolean;
  error: string | null;
  filters: ReservationQueryParams;
  connectionStatus: 'none' | 'connecting' | 'connected' | 'failed';
}