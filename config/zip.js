const fs = require('fs')
const archiver = require('archiver')
const path = require('path')

const output = fs.createWriteStream(path.join(__dirname, '../app.zip'))
const archive = archiver('zip')

archive.on('error', err => {
  throw err
})

output.on('close', () => {
  console.log(archive.pointer() + ' total bytes')
  console.log('archiver has been finalized and the output file descriptor has closed.')
})

output.on('end', () => {
  console.log('Data has been drained')
})

archive.pipe(output)

archive.directory(path.join(__dirname, '../app'), false)
archive.finalize()
