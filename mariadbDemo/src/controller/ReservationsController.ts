import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { logger } from "../middlewares/log";
import { ReservationsService } from "../Service/ReservationsService";
import { DB } from "../app";
require('dotenv').config()

export class ReservationsController extends Contorller {
    protected service: ReservationsService;

    constructor() {
        super();
        this.service = new ReservationsService(); // 修改為正確的服務類
    }

    public async test(Request: Request, Response: Response) {
        try {
            await DB.connection?.query("USE lab_b310;");
            const resp = await DB.connection?.query("SELECT * FROM Reservations;");
            Response.send(resp);
        } catch (error) {
            logger.error(`測試預約查詢失敗: ${error}`);
            Response.status(500).json({
                message: '查詢失敗',
                error: error instanceof Error ? error.message : '未知錯誤'
            });
        }
    }

    /**
     * 獲取預約列表
     * 支援基本查詢、排序和分頁功能
     */
    public async list(req: Request, res: Response) {
        try {
            // 獲取查詢參數
            const studentId = req.query.studentId as string;
            const seatId = req.query.seatId ? Number(req.query.seatId) : undefined;
            const timeslotId = req.query.timeslotId ? Number(req.query.timeslotId) : undefined;
            
            let result;
            
            // 根據查詢條件選擇適當的查詢方法
            if (studentId) {
                // 如果指定了學生ID，查詢該學生的所有預約
                result = await this.service.getStudentReservations(studentId);
            } else if (seatId && timeslotId) {
                // 如果同時指定了座位和時段，檢查座位可用性並返回相應的預約記錄
                const isAvailable = await this.service.checkSeatAvailability(seatId, timeslotId);
                if (isAvailable) {
                    result = [];  // 座位可用，沒有預約
                } else {
                    // 查詢該座位和時段的預約
                    await DB.connection?.query("USE lab_b310;");
                    result = await DB.connection?.query(
                        "SELECT * FROM Reservations WHERE seat_id = ? AND timeslot_id = ?;", 
                        [seatId, timeslotId]
                    );
                }
            } else if (seatId) {
                // 如果只指定了座位ID，查詢該座位的所有預約
                await DB.connection?.query("USE lab_b310;");
                result = await DB.connection?.query(
                    "SELECT * FROM Reservations WHERE seat_id = ?;", 
                    [seatId]
                );
            } else if (timeslotId) {
                // 如果只指定了時段ID，查詢該時段的所有預約
                await DB.connection?.query("USE lab_b310;");
                result = await DB.connection?.query(
                    "SELECT * FROM Reservations WHERE timeslot_id = ?;", 
                    [timeslotId]
                );
            } else {
                // 如果沒有指定條件，獲取所有預約
                result = await this.service.getAllReservations();
            }
            
            // 將查詢結果格式化後返回
            res.status(200).json({
                message: '查詢成功',
                data: result, 
                count: Array.isArray(result) ? result.length : 0
            });
        } catch (error) {
            logger.error(`獲取預約列表失敗: ${error}`);
            res.status(500).json({
                message: '獲取預約列表失敗',
                error: error instanceof Error ? error.message : '未知錯誤'
            });
        }
    }
}
