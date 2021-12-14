const listener = require('./process/listener')
const Queue = require('./process/queue')

const queue = new Queue()

listener(queue)

console.log('\x1b[32mFinished loading!\x1b[0m')
