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
Copy-Item -Path ./leadme_config.json -Force -Destination ./dist/leadme_config.json
Rename-Item -Path "./dist/nw.exe" -NewName "leadme-webxr-viewer.exe"
(Get-Content ./app/package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "version" | Out-File -Encoding utf8 ./dist/version.txt
(Get-Content ./app/package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "version" | Out-File -Encoding utf8 version.txt
if (Test-Path ./dist.zip)
{
    Remove-Item ./dist.zip -Force
}
Compress-Archive -Path "./dist" -DestinationPath "./dist.zip"