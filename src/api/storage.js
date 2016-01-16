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
  const timestamp = Date.now()
  const output = execSync('df')
  const devices = parse(output)
    .filter(onlyDevices)
    .sort(storage => storage.device)
    .reduce(unique, [])

  return {
    timestamp, devices
  }
}

/**
  Remove duplicates of an ordered list of storages
 */
function unique (uniques, storage) {
  const length = uniques.length

  if (length === 0 ||
      uniques[length - 1].device !== storage.device) {
    return [...uniques, storage]
  }

  return uniques
}

function onlyDevices (storage) {
  return storage.device.match(/^\/dev\/.+/)
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
  const columns = line.match(/\S+/g)
  if (!columns) { return }

  return {
    device: columns[0],
    size: columns[1],
    used: columns[2],
    available: columns[3]
  }
}
