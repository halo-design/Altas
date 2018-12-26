// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const upcase = require('./utils.js')

console.log(`We are using Node.js${process.versions.node}`)
console.log(`Chromium${process.versions.chrome}`)
console.log(`and Electron${process.versions.electron}`)

const $root = document.getElementById('MOUNT_NODE')
const title = upcase('halo')
const $context = document.createElement('div')

$context.innerHTML = `
  <div class="logo"></div>
  <h1>${title}</h1>
  <div class="empty"></div>
`
$root.appendChild($context)
