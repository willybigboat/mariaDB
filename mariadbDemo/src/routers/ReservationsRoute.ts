import { Route } from "../abstract/Route"
import { ReservationsController } from "../controller/ReservationsController";

export class ReservationsRoute extends Route{
    
    protected url: string;
    protected Contorller = new ReservationsController();

    constructor(){
        super()
        this.url = '/Reservations/'
        this.setRoutes()
    }

    protected setRoutes(): void {
        // 測試路由
        this.router.get(`${this.url}test`, (req, res) => {
            this.Contorller.test(req, res);
        });
        
        // 添加列表路由
        this.router.get(`${this.url}list`, (req, res) => {
            this.Contorller.list(req, res);
        });
    }

}