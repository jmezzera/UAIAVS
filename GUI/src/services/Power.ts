export default (power: number) => {
    const url = '192.168.43.251:8080/admin/motorsPower' 
    fetch(url, {
        method: "PATCH",
        body: JSON.stringify({
            power: power.toString()
        })
    })
    .then()
    .catch(console.error)
}