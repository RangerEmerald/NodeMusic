const youtubeApi = require('./youtubeApi')
const ytdl = require('ytdl-core')

let songs = []

function formatList (song, pos) { // Outputs the song in a format that is readable
  songs.push(song) // Adds song to an array to choose from
  console.log(`${pos}. -------------------`)
  console.log(`\x1b[32mTitle: ${song.title}\x1b[0m`)
  console.log(`\x1b[32mArtist: ${song.ownerChannelName}\x1b[0m`)
  console.log(`\x1b[32mSong Length: ${song.isLiveContent ? '∞' : song.lengthSeconds < 3600 ? new Date(song.lengthSeconds * 1000).toISOString().substring(14, 5) : new Date(song.lengthSeconds * 1000).toISOString().substring(11, 8)}\x1b[0m`) // Gets the song length. ∞ for live streams
  console.log(`\x1b[32mPublished: ${(new Date(song.uploadDate)).toLocaleDateString()}\x1b[0m`)
}

module.exports = async (queue) => {
  const stdin = process.openStdin()

  stdin.addListener('data', async d => {
    const command = d.toString().trim().split(' ')
    const arg = command.splice(1).join(' ')

    d = isNaN(d) ? d : Number(d) // Tests to see if d is a number

    if (songs.length > 0) {
      if (typeof d !== 'number' || d < 1 || d > 5) console.log('\x1b[31mExiting options. Input must be a number between 1 and 5.\x1b[0m')
      else queue.emit('add', songs[Number(d) - 1])
      songs = []
    } else {
      switch (command[0]) {
        case 'play':
          if (!arg) console.log('\x1b[31mSong is required\x1b[0m')
          else if (arg.startsWith('https://www.youtube.com/watch?v=')) {
            try {
              queue.emit('add', await youtubeApi(arg.slice(arg.indexOf('?v=') + 3))) // Gets song id from link
            } catch {
              console.log('\x1b[31mError in adding song. Double check to make sure the link is valid.\x1b[0m')
            }
          } else {
            const lsongs = (await youtubeApi(arg)).slice(0, 5) // Outputs only a max of 5 songs
            for (let pos = 0; pos < lsongs.length; ++pos) formatList((await ytdl.getBasicInfo(lsongs[pos].id.videoId)).videoDetails, pos + 1)
            console.log('----------------------')
            console.log('\x1b[34mChoose a song number. Type exit to exit:\x1b[0m')
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
