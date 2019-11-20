import * as express from 'express';


export default class Admin {
    private _router: express.Router;

    private setMode: (boolean) => void;

    constructor(setMode: (boolean) => void){
        this._router = express.Router();
        this.setMode = setMode;
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this._router.patch('/mode', (req: express.Request, res: express.Response) => {
            let mode = req.body.mode;
            this.setMode(mode);
            res.sendStatus(200);
        });
    }

    public get router(): express.Router{
        return this._router;
    }
}