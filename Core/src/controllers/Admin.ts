import * as express from 'express';
import IAngles from '../interfaces/IAngles';
import IPositioning from '../interfaces/IPositioning';


export default class Admin {
    private _router: express.Router;
    private _positioning: IPositioning;
    private _angles: IAngles;

    private setMode: (boolean) => void;
    private getMode: () => boolean;


    constructor(setMode: (boolean) => void, getMode: () => boolean, positioning: IPositioning, angles: IAngles){
        this._router = express.Router();
        this.setMode = setMode;
        this.getMode = getMode;
        this._positioning = positioning;
        this._angles = angles;

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this._router.patch('/mode', (req: express.Request, res: express.Response) => {
            let mode = req.body.mode;
            this.setMode(mode);
            if (mode){
                this._positioning.moveToPoint(-10, -10, 40, 2);
                this._angles.moveToTheta(0);
                this._angles.moveToPhi(0);
            }

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