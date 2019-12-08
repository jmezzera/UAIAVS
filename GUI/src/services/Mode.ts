import config from '../config';

import IMode from "./IMode";

export default class Mode implements IMode {
    public setMode(mode: boolean): void {
        const url = `${config.serverUrl}/admin/mode`;
        fetch (url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({mode})
        });
    }

}