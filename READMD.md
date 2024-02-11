# LeadMe WebXR Viewer - built for NW.js SDK 0.82.0

## To get setup:
### Instructions for Windows

Download https://dl.nwjs.io/v0.82.0/nwjs-sdk-v0.82.0-win-x64.zip and place in directory above this project. Extract it.
Clone .npmrc.example to app/.npmrc and put in your github token with registry read access

Ensure you have python2.7 installed
Download and install https://aka.ms/vs/17/release/VC_redist.x64.exe

Download and install https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools 
- Select desktop development for C++ and node.js build tools

Restart your PC

Use nvm to checkout to node 17.9.1 (one day we'll dockerize this 🤣)

`cd app && npm install`

`npm install -g nw-gyp`

Navigate to `C:\Users\{username}\.nw-gyp\0.82.0\common.gypi` and place brackets around the print statement in v8_host_byteorder

`cd app/node_modules/robotjs && nw-gyp --python=C:\Python27\python.exe rebuild --target=0.82.0 --arch=x64`

### Instructions for Mac
No

## To run
`cd app && npm run run-cospaces`
or
`cd app && npm run run-thinglink`

## To build
`cd app && npm run build`

The build folder will be created at top level and can be distributed