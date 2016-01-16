# Monitora - simple server stats API

This is just a prototype. Built for fun!

## Usage

```bash
docker run -d \
  -p 3000:3000 \
  --pid='host' \
  pirelenito/monitora-server
```

The `--pid='host'` [allows](https://docs.docker.com/engine/reference/run/#pid-settings-pid) *monitora* to be able to **list processes in the host** from within the container.

To be able **to see any storage** device in the API it must be [mounted as a volume](https://docs.docker.com/engine/reference/run/#volume-shared-filesystems) inside the container (`-v`).

## API end-points

All API endpoints returns a stream of JSON objects.

### /storage

## Development

```bash
docker-compose run dev
```

```bash
docker-compose run test
```
