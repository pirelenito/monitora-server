import { execSync } from 'child_process'

export default function (req, res) {
  res.writeHead(200, {'Transfer-Encoding': 'chunked', 'Content-Type': 'text/event-stream'})

  const cancel = setupPooling(data => {
    res.write(JSON.stringify(data) + '\n')
  })

  req.on('close', () => cancel())
}

function setupPooling (callback) {
  let running = true

  const queryAndCallback = () => {
    callback(queryStorage())
    if (running) { setTimeout(queryAndCallback, 2000) }
  }

  queryAndCallback()

  return function () {
    running = false
  }
}

function queryStorage () {
  const output = execSync('df')
  return parse(output)
}

function parse (output) {
  return output
    .toString()
    .split('\n')
    .slice(1)
    .map(parseLine)
    .filter(stat => stat)
}

function parseLine (line) {
  const timestamp = Date.now()

  const columns = line.match(/\S+/g)
  if (!columns) { return }

  return {
    timestamp,
    device: columns[0],
    size: columns[1],
    used: columns[2],
    available: columns[3],
    mount: columns[5]
  }
}
