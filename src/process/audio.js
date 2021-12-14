const EventEmitter = require('events')
const ytdl = require('ytdl-core')
const FFmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream')
const decoder = require('lame').Decoder
const Speaker = require('speaker')

module.exports = class Audio extends EventEmitter {
  constructor (yt) {
    Audio.opt = {
      filter: 'audioonly',
      quality: 'highestaudio',
      audioFormat: 'mp3',
      highWaterMark: 1
    }

    if (typeof yt !== 'object') throw new Error('Yt must be an object.')

    super()
    try {
      this.song = ytdl(yt.videoId, Audio.opt)
      this.yt = yt
      this.ffmpeg = FFmpeg(this.song)
    } catch {
      console.log('\x1b[31mError in play track.\x1b[0m')
    }

    this.song.on('finish', () => this.emit('end'))
  }

  play () {
    try {
      process.nextTick(() => {
        this.output = this.ffmpeg.format(Audio.opt.audioFormat).pipe(new PassThrough()).pipe(decoder()).pipe(new Speaker())
      })
    } catch {
      console.log('\x1b[31mError in play track.\x1b[0m')
    }
  }
}
