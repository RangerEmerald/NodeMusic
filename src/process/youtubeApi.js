const youtubeSearch = require('youtube-search-without-api-key')
const ytdl = require('ytdl-core')

module.exports = async (search = '') => {
  if (search === '') throw new Error('Search length less than or equal to zero.')
  try {
    return (await ytdl.getBasicInfo(search)).videoDetails // Searchs for song if it is a youtube song id
  } catch {
    return await youtubeSearch.search(search) // Otherwise just returns an array of songs to chosoe from
      .catch(err => {
        throw new Error(err)
      })
  }
}
