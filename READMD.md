# LeadMe WebXR Viewer - built for NW.js SDK 0.82.0

## To get setup:
Download https://dl.nwjs.io/v0.82.0/nwjs-sdk-v0.82.0-win-x64.zip and place in the root directory
Clone .npmrc.example to .npmrc and put in your github token with registry read access

Ensure you have python2.7 installed
Use nvm to checkout to node 17.9.1 (one day we'll dockerize this 🤣)

`cd app && npm install`

`npm install -g nw-gyp`

`cd app/node_modules/robotjs && nw-gyp --python /path/to/python2.7 rebuild --target=0.82.0 --arch=x64`

`cd app && npm rebuild`

## To run
`cd app && npm run run-cospaces`
or
`cd app && npm run run-thinglink`

## To build
`cd app && npm run build`

The build folder will be created at top level and can be distributed