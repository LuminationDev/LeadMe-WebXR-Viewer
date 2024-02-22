if (Test-Path ./nwjs-v0.82.0-win-x64/package.nw)
{
    Remove-Item -Recurse -Force ./nwjs-v0.82.0-win-x64/package.nw
}
Copy-Item -Path ./app -Recurse -Destination ./nwjs-v0.82.0-win-x64/package.nw
Remove-Item ./nwjs-v0.82.0-win-x64/package.nw/package.json
Remove-Item -Recurse -Force ./nwjs-v0.82.0-win-x64/package.nw/node_modules
Rename-Item -Path "./nwjs-v0.82.0-win-x64/package.nw/build.package.json" -NewName "package.json"
Set-Location -Path nwjs-v0.82.0-win-x64/package.nw
npm install
Set-Location -Path ../../
Copy-Item -Path ./app/node_modules/robotjs -Recurse -Force -Destination ./nwjs-v0.82.0-win-x64/package.nw/node_modules
Set-Location -Path app
npm run javascript-obfuscator
Set-Location -Path ../
if (Test-Path ./dist)
{
    Remove-Item -Recurse -Force ./dist
}
Copy-Item -Path ./nwjs-v0.82.0-win-x64 -Recurse -Force -Destination ./dist
Rename-Item -Path "./dist/nw.exe" -NewName "leadme-webxr-viewer.exe"
if (Test-Path ./dist.zip)
{
    Remove-Item ./dist.zip -Force
}
Compress-Archive -Path "./dist" -DestinationPath "./dist.zip"