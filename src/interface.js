const listener = require('./process/listener')
const Queue = require('./process/queue')

const familyFriendly = Boolean(process.argv[2]) // Input arguments of whether or not you want family-friendly mode. Boolean

const queue = new Queue(familyFriendly) // The queue for the app

listener(queue) // Function that listens for command line inputs

console.log('\x1b[32mFinished loading!\x1b[0m')
