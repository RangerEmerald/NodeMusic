const EventEmitter = require('events')
const Audio = require('./audio')

module.exports = class Queue extends EventEmitter {
  constructor (familyFriendly = true) {
    super()

    this.queue = []
    this.familyFriendly = familyFriendly

    this.on('add', async song => {
      if (familyFriendly && !song.isFamilySafe) console.log('\x1b[31mCurrently in family friendly only mode. Please search and listen for famil friendly songs only.\x1b[0m')
      this.queue.push(new Audio(song))
      console.log(`\x1b[36mSong added: ${song.title}\x1b[0m`)
      this.emit('play')
    })

    this.on('end', async () => {
      await this.queue.shift()
      this.emit('play')
    })

    this.on('play', async () => {
      if (this.queue.length === 1) {
        await this.queue[0].play()
        this.queue[0].on('end', async () => this.emit('end'))
        console.log(`\x1b[36mNow playing: ${this.queue[0].yt.title}\x1b[0m`)
      }
    })
  }
}
