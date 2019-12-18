import * as express from 'express';


export default class Admin {
    private _router: express.Router;

    private setMode: (boolean) => void;
    private getMode: () => boolean;


    constructor(setMode: (boolean) => void, getMode: () => boolean){
        this._router = express.Router();
        this.setMode = setMode;
        this.getMode = getMode;
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this._router.patch('/mode', (req: express.Request, res: express.Response) => {
            let mode = req.body.mode;
            this.setMode(mode);
            res.sendStatus(200);
        });
        this._router.get('/mode', (req: express.Request, res: express.Response) => {
            res.status(200).send(this.getMode());
        })
    }

    public get router(): express.Router{
        return this._router;
    }
}