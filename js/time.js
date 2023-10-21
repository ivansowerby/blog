const getTime = (timestamp, delimiter = ":") => {
    const date = new Date(timestamp * 1000);
    return [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ].join(delimiter);
}

const getDate = (timestamp, delimiter = "/") => {
    const date = new Date(timestamp * 1000);
    return [
        date.getDate(),
        date.getMonth(),
        date.getFullYear()
    ].join(delimiter);
}