const listener = require('./process/listener')
const Queue = require('./process/queue')

const familyFriendly = Boolean(process.argv[2])

const queue = new Queue(familyFriendly)

listener(queue)

console.log('\x1b[32mFinished loading!\x1b[0m')
