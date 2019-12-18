import config from '../config';

export default (power: number) => {
    const url = config.serverUrl + '/position/admin/motorsPower';
    fetch(url, {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            power: power.toString()
        })
    })
    .then()
    .catch(console.error)
}