var robot = require('robotjs')

function getCoordinatesOfElement(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

async function automationLoop() {
    let win = nw.Window.get()
    console.log(win)
    if (win) {
        switch (win.window.location.hostname) {
            case "www.thinglink.com":
                thinglinkLoop(win)
                return;
            case "edu.cospaces.io":
                setTimeout(() => {
                    cospacesLoop(win)
                }, 10000)
                return;
            case "immersive-web.github.io":
                webXrSampleLoop(win)
                return;
            default:
                break;
        }
    }
    setTimeout(automationLoop, 2000)
}

function clickOnElement(element) {
    let win = nw.Window.get()
    const coordinates = getCoordinatesOfElement(element)
    const xOffset = win.width - win.window.innerWidth
    const yOffset = win.height - win.window.innerHeight

    robot.moveMouse(coordinates.x + win.x + xOffset, coordinates.y + win.y + yOffset)
    robot.mouseClick()
}

async function thinglinkLoop() {
    let win = nw.Window.get()
    var els = win.window.document.getElementsByClassName("first-continue btn")
    if (els.length >= 1 && els[0].getAttribute("style").indexOf("display") === -1) {
        clickOnElement(els[0])
        maximizeLegacyMirror()
        win.setAlwaysOnTop(false)
        win.minimize()
        win.on('close', () => {
            nw.Window.get().hide()
            closeLegacyMirror()
            nw.Window.get().close(true)
        })
        return
    }
    setTimeout(thinglinkLoop, 2000)
}

var clickedFirstCospacesButton = false;
var clickedSecondCospacesButton = false;
var clickedThirdCospacesButton = false;
async function cospacesLoop() {
    let win = nw.Window.get()
    const xOffset = win.x
    const yOffset = win.y
    if (win.window.innerWidth >= 792) {
        if (!clickedFirstCospacesButton) {
            robot.moveMouse((108 + ((win.window.innerWidth - 792)/2) + 16) + xOffset, (win.window.innerHeight * 0.6) + 52 + yOffset)
            robot.mouseClick()
            clickedFirstCospacesButton = true
            setTimeout(cospacesLoop, 5000)
            return;
        }
        if (!clickedSecondCospacesButton) {
            robot.moveMouse(xOffset + win.window.innerWidth - 16, yOffset + win.window.innerHeight - 16)
            robot.mouseClick()
            clickedSecondCospacesButton = true
            setTimeout(cospacesLoop, 5000)
            return;
        }
        if (!clickedThirdCospacesButton) {
            robot.moveMouse(xOffset + win.window.innerWidth - 58, yOffset + win.window.innerHeight - 32)
            robot.mouseClick()
            clickedThirdCospacesButton = true
            maximizeLegacyMirror()
            win.setAlwaysOnTop(false)
            win.minimize()
            win.on('close', () => {
                nw.Window.get().hide()
                closeLegacyMirror()
                nw.Window.get().close(true)
            })
            return;
        }
    } else {
        if (!clickedFirstCospacesButton) {
            robot.moveMouse(32 + xOffset, (win.window.innerHeight * 0.6) + 52 + yOffset)
            robot.mouseClick()
            clickedSecondCospacesButton = true
            setTimeout(cospacesLoop, 5000)
            return;
        }
        if (!clickedSecondCospacesButton) {
            robot.moveMouse(xOffset + win.window.innerWidth - 16, yOffset + win.window.innerHeight - 16)
            robot.mouseClick()
            clickedFirstCospacesButton = true
            setTimeout(cospacesLoop, 5000)
            return;
        }
        if (!clickedThirdCospacesButton) {
            robot.moveMouse(xOffset + win.window.innerWidth - 58, yOffset + win.window.innerHeight - 32)
            robot.mouseClick()
            clickedThirdCospacesButton = true
            maximizeLegacyMirror()
            win.setAlwaysOnTop(false)
            win.minimize()
            win.on('close', () => {
                nw.Window.get().hide()
                closeLegacyMirror()
                nw.Window.get().close(true)
            })
            return;
        }
    }
}

async function webXrSampleLoop() {
    let win = nw.Window.get()
    var els = win.window.document.getElementsByClassName("webvr-ui-button")
    if (els.length >= 1) {
        clickOnElement(els[0])
        return
    }
    setTimeout(webXrSampleLoop, 1000)
}

function maximizeLegacyMirror() {
    var spawn = require("child_process").spawn,child;
    var open = false
    child = spawn("powershell.exe",["Get-Process | Where {$_.MainWindowTitle -eq \"Legacy Mirror\"}"]);
    child.stdout.on("data",function(data){
        if (data) {
            open = true
            return;
        }
        return;
    });
    child.stderr.on("data",function(data){
    });
    child.on("exit",function(){
        if (!open) {
            return;
        }

        var spawn2 = require("child_process").spawn,child2;
        child2 = spawn2("powershell.exe",[
            "$sig = '[DllImport(\"user32.dll\")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);';" +
            "Add-Type -MemberDefinition $sig -name NativeMethods -namespace Win32;" +
            "$handle = (Get-Process | Where {$_.MainWindowTitle -eq \"Legacy Mirror\"} | Select MainWindowHandle)[0].MainWindowHandle;" +
            "[Win32.NativeMethods]::ShowWindowAsync($handle, 3)"]);
        child2.stdout.on("data",function(data){
        });
        child2.stderr.on("data",function(data){
        });
        child2.on("exit",function(){
        });
        child2.stdin.end(); //end input
    });
    child.stdin.end(); //end input
}

function closeLegacyMirror() {
    var spawn = require("child_process").spawn,child;
    child = spawn("powershell.exe",["Stop-Process -Name \"vrcompositor\""]);
    child.stdin.end();
}

setTimeout(automationLoop, 2000)
let win = nw.Window.get()
win.maximize()
win.setAlwaysOnTop(true)