import { api } from '../enum/api';

// 預約資料介面
export interface Reservation {
  reservation_id: number;
  student_id: string;
  seat_id: number;
  timeslot_id: number;
  create_time: Date;
}

// API 回應結構
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// 查詢參數介面
export interface ReservationQueryParams {
  studentId?: string;
  seatId?: number;
  timeslotId?: number;
}

/**
 * 共用的請求設定
 */
const commonConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
};

/**
 * 獲取預約列表
 * @param params 可選的查詢參數
 * @returns 包含預約列表的回應
 */
export async function getReservationsList(params?: ReservationQueryParams): Promise<ApiResponse<Reservation[]>> {
  try {
    // 構建查詢參數
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.studentId) queryParams.append('studentId', params.studentId);
      if (params.seatId) queryParams.append('seatId', params.seatId.toString());
      if (params.timeslotId) queryParams.append('timeslotId', params.timeslotId.toString());
    }
    
    // 構建完整 URL
    const url = `${api.list}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    // 發送請求
    const response = await fetch(url, {
      ...commonConfig,
      method: 'GET',
    });
    
    // 解析 JSON 回應
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('獲取預約列表失敗:', error);
    return {
      message: '獲取預約列表失敗',
      error: error.message || '未知錯誤',
      data: [],
      count: 0
    };
  }
}

/**
 * 測試連接
 * @returns API 回應
 */
export async function testConnection(): Promise<any> {
  try {
    const response = await fetch(api.test, {
      ...commonConfig,
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('測試連接失敗:', error);
    throw error;
  }
}