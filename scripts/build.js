const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')

fs.readdir('./src/pages/', (err, files) => {
  if (err) throw new Error(err)

  createPublicFolder()
  copyAssets()
  compileTemplates(files)
})

function createPublicFolder () {
  if (!fs.existsSync('./public')) fs.mkdirSync('./public')
}

function copyAssets () {
  fs.copy('./src/assets', './public/assets', err => {
    if (err) console.error(`Assets could not be copied because of the following error: ${err}`)
  })
}

function compileTemplates (files) {
  files.forEach(file => {
    fs.readFile(path.resolve(`./src/pages/${file}`), 'utf8', (err, data) => {
      if (err) console.error(err)

      let template = ejs.compile(data, {
        filename: `./src/pages/${file}`
      })
      let html = template()

      fs.writeFile(`./public/${file.replace('.ejs', '')}.html`, html, err => {
        if (err) console.error(err)
      })
    })
  })
  console.log('Compiled succesfully')
}