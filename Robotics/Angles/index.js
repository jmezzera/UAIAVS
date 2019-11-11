const app = require('express')();
const bodyParser = require('body-parser');

const servoUtils = require('./servoUtils');


const servos = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/servos', (req, res) => {
    res.status(200).send(servos.map(servo => {
        const {name, pin, angle, zero} = servo;
        return {name, pin, angle, zero};
    }));
});

app.post('/servos', (req, res) => {
    console.log("POST /servos");
    const {name, pin} = req.body;
    const zero = req.body.zero || 0;
    const newServo = {name, pin, zero}
    newServo.angle = 0
    newServo.hardwarePin = servoUtils.createPin(pin)
    try{
        servoUtils.writeAngle(newServo.hardwarePin, newServo.zero);
        servos.push(newServo);
        res.status(201).send({name, pin, zero});
    } catch (error){
        res.status(400).send({error});
    }
});

app.post('/servos/:servo', (req, res) => {
    console.log("POST /servos/:servo");
    const name = req.params.servo;
    const angle = req.body.angle;
    const servo = servos.filter(servo => servo.name === name)[0];
    if (!servo){
        res.sendStatus(404);
        return;
    }
    try{
        servoUtils.writeAngle(servo.hardwarePin, angle + servo.zero);
        servo.angle = angle;
        res.sendStatus(200);
    } catch (error){
        res.status(400).send({error});
    }
});

app.patch('/servos/:servo', (req, res) => {
    console.log("PATCH /servos/:servo");
    const name = req.params.servo;
    const angleDelta = req.body.angle;

    const servo = servos.filter(servo => servo.name === name)[0];
    if (!servo){
        res.sendStatus(404);
        return;
    }
    try{
        servoUtils.writeAngle(servo.hardwarePin, servo.angle + angleDelta + servo.zero);
        servo.angle = servo.angle + angleDelta;
        res.sendStatus(200);
    }
    catch (error){
        res.status(400).send({error});
    }
})

app.listen(8080, () => console.log("API listening on port 8080"));