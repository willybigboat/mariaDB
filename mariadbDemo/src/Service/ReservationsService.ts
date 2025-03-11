import { Service } from "../abstract/Service";
import { DB } from "../app";
import { logger } from "../middlewares/log";

interface Reservation {
    reservation_id: number;
    student_id: string;
    seat_id: number;
    timeslot_id: number;
    create_time: Date;
}

export class ReservationsService extends Service {
    
    /**
     * 測試數據庫連接並獲取所有預約
     */
    public async test() {
        try {
            await DB.connection?.query("USE lab_b310;");
            const reservations = await DB.connection?.query("SELECT * FROM Reservations;");
            return reservations;
        } catch (error) {
            logger.error(`測試預約查詢失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 獲取所有預約記錄
     */
    public async getAllReservations() {
        try {
            await DB.connection?.query("USE lab_b310;");
            return await DB.connection?.query("SELECT * FROM Reservations;");
        } catch (error) {
            logger.error(`獲取所有預約失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 通過ID獲取單個預約
     */
    public async getReservationById(id: number) {
        try {
            await DB.connection?.query("USE lab_b310;");
            const result = await DB.connection?.query("SELECT * FROM Reservations WHERE reservation_id = ?;", [id]);
            if (Array.isArray(result) && result.length > 0) {
                return result[0];
            }
            return null;
        } catch (error) {
            logger.error(`獲取預約ID ${id} 失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 創建新預約
     */
    public async createReservation(reservation: Omit<Reservation, 'reservation_id' | 'create_time'>) {
        try {
            await DB.connection?.query("USE lab_b310;");
            const result = await DB.connection?.query(
                "INSERT INTO Reservations (student_id, seat_id, timeslot_id) VALUES (?, ?, ?);",
                [reservation.student_id, reservation.seat_id, reservation.timeslot_id]
            );
            return result;
        } catch (error) {
            logger.error(`創建預約失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 更新預約
     */
    public async updateReservation(id: number, reservation: Partial<Omit<Reservation, 'reservation_id' | 'create_time'>>) {
        try {
            await DB.connection?.query("USE lab_b310;");
            
            // 動態構建更新語句
            const updateFields = [];
            const values = [];
            
            if (reservation.student_id) {
                updateFields.push("student_id = ?");
                values.push(reservation.student_id);
            }
            
            if (reservation.seat_id) {
                updateFields.push("seat_id = ?");
                values.push(reservation.seat_id);
            }
            
            if (reservation.timeslot_id) {
                updateFields.push("timeslot_id = ?");
                values.push(reservation.timeslot_id);
            }
            
            if (updateFields.length === 0) {
                return { affectedRows: 0 };
            }
            
            // 添加ID到值數組的最後
            values.push(id);
            
            const result = await DB.connection?.query(
                `UPDATE Reservations SET ${updateFields.join(", ")} WHERE reservation_id = ?;`,
                values
            );
            
            return result;
        } catch (error) {
            logger.error(`更新預約ID ${id} 失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 刪除預約
     */
    public async deleteReservation(id: number) {
        try {
            await DB.connection?.query("USE lab_b310;");
            const result = await DB.connection?.query("DELETE FROM Reservations WHERE reservation_id = ?;", [id]);
            return result;
        } catch (error) {
            logger.error(`刪除預約ID ${id} 失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 檢查座位在特定時段是否可用
     */
    public async checkSeatAvailability(seat_id: number, timeslot_id: number) {
        try {
            await DB.connection?.query("USE lab_b310;");
            const result = await DB.connection?.query(
                "SELECT COUNT(*) as count FROM Reservations WHERE seat_id = ? AND timeslot_id = ?;",
                [seat_id, timeslot_id]
            );
            return result[0].count === 0; // 如果count為0，表示座位可用
        } catch (error) {
            logger.error(`檢查座位可用性失敗: ${error}`);
            throw error;
        }
    }

    /**
     * 獲取學生的所有預約
     */
    public async getStudentReservations(student_id: string) {
        try {
            await DB.connection?.query("USE lab_b310;");
            return await DB.connection?.query(
                "SELECT * FROM Reservations WHERE student_id = ?;", 
                [student_id]
            );
        } catch (error) {
            logger.error(`獲取學生 ${student_id} 的預約失敗: ${error}`);
            throw error;
        }
    }
}