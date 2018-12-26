const React = require('react')
const ReactDOM = require('react-dom')

const App = () => {
  return (
    <div className='App'>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}

console.log(`We are using Node.js${process.versions.node}`)
console.log(`Chromium${process.versions.chrome}`)
console.log(`and Electron${process.versions.electron}`)

const rootElement = document.getElementById('MOUNT_NODE')
ReactDOM.render(<App />, rootElement)
