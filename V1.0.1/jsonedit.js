const fs = require("fs")

module.exports = {
  load: (path) => {
    try {
      var data = fs.readFileSync(path, 'utf8')
      data = JSON.parse(data)
      return data
    } catch(err) {
      console.error(err)
      return false
    }
  },
  save: (path, data) => {
    try {
      fs.writeFileSync(path, JSON.stringify(data))
    } catch(err) {
      console.error(err)
    }
  }
}