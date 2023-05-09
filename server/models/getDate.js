function getDate() {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    return `${yyyy}-${mm}-${dd}`
}

function getTime() {
    const date = new Date()
    let time = `${date.getHours()}:${date.getMinutes()}`

    return time
}

module.exports = { getDate, getTime }