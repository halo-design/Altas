import log from 'electron-log';
import * as fs from 'fs';
import * as readline from 'readline';

export default (filePath: string, cb: (i: number, s:string) => void, done: () => void) => {
  log.debug(filePath)
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath)
  })
  
  let i = 1
  rl.on('line', line => {
    cb(i, line)
    i ++
  })

  rl.on('close', done)
}
