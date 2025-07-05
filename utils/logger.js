const fs = require('fs-extra')

function logSuccess(no) {
    fs.appendFileSync('logs/success.txt', no + '\n')
}

function logFailed(no) {
    fs.appendFileSync('logs/failed.txt', no + '\n')
}

module.exports = { logSuccess, logFailed }
