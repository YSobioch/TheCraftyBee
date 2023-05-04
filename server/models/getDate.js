function getDate() {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    return `${yyyy}-${mm}-${dd}`
}

module.exports = getDate