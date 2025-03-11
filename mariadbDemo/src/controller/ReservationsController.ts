import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { logger } from "../middlewares/log";
import { Service } from "../abstract/Service";
import { PageService } from "../Service/PageService";
import { DB } from "../app";
require('dotenv').config()

export class ReservationsController extends Contorller {
    protected service: Service;

    constructor() {
        super();
        this.service = new PageService();
    }

    public async test(Request: Request, Response: Response) {
        await DB.connection?.query("USE lab_b310;");
        const resp = await DB.connection?.query("SELECT * FROM Reservations;");
        Response.send(resp)
    }
}