# About
This is an application to visualize Pokemon data is a simple way for the purpose of generating user logs so that we mine and visual said logs to understand how people use visualizations with multiple views.

# Requirements
### Redis
  - Windows https://github.com/rgl/redis/downloads
  - Linux/OSX http://redis.io/topics/quickstart

### Node
  - Windows https://github.com/coreybutler/nvm-windows
  - Linux/OSX https://github.com/creationix/nvm

# Usage
### Starting up
1. `npm i`
2. `npm run redis`
3. `npm run server`
4. `npm start`

### Pulling Results
The command `npm run dump` will output logs into `logs/data.json`

### Cleaning DB
To clean the DB you need to restart the logging server that was ran using `npm run server` then you need flush redis which you can do using `npm run flush`
