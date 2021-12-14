const youtubeApi = require('./youtubeApi')

let songs = []

function formatList (song, pos) {
  console.log(`${pos}. -------------------`)
  console.log(`\x1b[32mTitle: ${song.title}\x1b[0m`)
  console.log(`\x1b[32mArtist: ${song.channel.title}\x1b[0m`)
  console.log(`\x1b[32mPublished: ${(new Date(song.publishedAt)).toLocaleDateString()}\x1b[0m`)
}

module.exports = async (queue) => {
  const stdin = process.openStdin()

  stdin.addListener('data', async d => {
    const command = d.toString().trim().split(' ')
    const arg = command.splice(1).join(' ')

    try {
      d = Number(d)
    } catch {}

    if (typeof d === 'number' && songs.length > 0) {
      queue.emit('add', songs[Number(d) - 1])
      songs = []
    } else {
      switch (command[0]) {
        case 'play':
          if (!arg) console.log('\x1b[31mSong is required\x1b[0m')
          else if (arg.startsWith('https://www.youtube.com/watch?v=')) {
            try {
              queue.emit('add', await youtubeApi(arg.slice(arg.indexOf('?v=') + 3)))
            } catch {
              console.log('\x1b[31m[31mError in adding song. Double check to make sure the link is valid.\x1b[0m')
            }
          } else {
            songs = await youtubeApi(arg)
            for (let pos = 0; pos < songs.length; ++pos) formatList(songs[pos], pos + 1)
            console.log('----------------------')
            console.log('\x1b[34mChoose a song number: \x1b[0m')
          }
          break
        case 'quit':
          process.exit(0)
        default:
          console.log('\x1b[31mUnknown command.\x1b[0m')
      }
    }
  })
}
