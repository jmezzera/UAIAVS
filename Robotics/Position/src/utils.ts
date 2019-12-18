const delayPromise = (time: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    })
}

export {delayPromise};