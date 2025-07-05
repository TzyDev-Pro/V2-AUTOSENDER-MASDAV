function validateNumber(no) {
    return /^628\d{7,13}$/.test(no)
}
module.exports = { validateNumber }
