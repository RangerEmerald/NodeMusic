require('dotenv').config()
const YoutubeApi = require('simple-youtube-api')

const Youtube = new YoutubeApi(process.env.API_TOKEN)

module.exports = async (search = '') => {
  if (search === '') throw new Error('Search length less than or equal to zero.')
  try {
    return await Youtube.getVideoByID(search)
  } catch {
    return await Youtube.search(search)
      .catch(err => {
        throw new Error(err)
      })
  }
}
