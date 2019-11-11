const request = require('request');
const url = 'http://192.168.43.166:8080/servos';

const delayPromise = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    })
}


const init = () => {
    return new Promise((resolve, reject) => {
        request(url, {
            method: "POST",
            json: {
                name: "1",
                pin: 14
            }
        }, () => {
            request(url, {
                method: "POST",
                json: {
                    name: "2",
                    pin: 15
                }
            }, ()=> {
                resolve();
            })
        })
    })
    
}

const move = (servo, angle) => {
    return new Promise((resolve, reject) => {
        request(url + '/' + servo, {
            method: "POST",
            json: {
                angle
            }
        }, (err, response) => {
            resolve()
        })
    })
}

const test = async ( ) => {
    await init();
    await delayPromise(1000);

    await move(1, 90);
    await delayPromise(500);

    await move(1, 45);
    await delayPromise(500);

    await move(2, 60);
    await delayPromise(1000);

    await move(2, 30);
    await delayPromise(500);

    await move(2, 150);
    await delayPromise(500);

    await moveIteration(10);

}

test();

const moveIteration = async (angle) => {
    await move(1, angle);
    await move(2, 150 - angle);
    await delayPromise(50);

    if (angle < 100){
        await moveIteration(angle + 5)
    }
}


