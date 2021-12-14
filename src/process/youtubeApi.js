const youtubeSearch = require('youtube-search-without-api-key')
const ytdl = require('ytdl-core')

module.exports = async (search = '') => {
  if (search === '') throw new Error('Search length less than or equal to zero.')
  try {
    return (await ytdl.getBasicInfo(search)).videoDetails
  } catch {
    return await youtubeSearch.search(search)
      .catch(err => {
        throw new Error(err)
      })
  }
}
