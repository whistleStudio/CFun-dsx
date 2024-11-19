import { SerialPort } from "serialport";
import * as vscode from "vscode"
import * as fs from "fs"
import { error } from "console";

interface DSX {
  com: string,
  sp?: SerialPort,
  BAUDRATE: number,
  detectTim?: NodeJS.Timeout
  reset: () => void
}

let dsx: DSX = {
  com: "",
  sp: undefined,
  BAUDRATE: 115200,
  detectTim: undefined,
  reset () {
    this.com = "",
    this.sp = undefined
    clearInterval(this.detectTim)
    this.detectTim = undefined
  }
}

export default {
  /* 1. 串口选择 */
  selectSp: async () => {
    let portInfo = await SerialPort.list();
    // 除去serialNumber: undefined
    portInfo = portInfo.filter(v => v.serialNumber)
    console.log(portInfo)
    let portList = portInfo.map(v => v.path)
    const quickPick = vscode.window.createQuickPick()
    console.log("isOpen:", dsx.sp?.isOpen)
    quickPick.placeholder = portList.length>0 ? "👇点击目标串口👇 " : "🔍未检测可用串口🔍"
		quickPick.items = portList.map(v => ({label: v == dsx.com ? v+" ✔️": v, description: v}));
		quickPick.onDidChangeSelection(e => {
			console.log("onDidChangeSelection", e)
      let isNewConnect = false
      if (e[0].label == e[0].description) {isNewConnect = true}
      if (dsx.sp) {dsx.sp.close(); dsx.reset()} // 只要有连接就断开，仅断开现有或者断了再连别的
      try {
        if (isNewConnect) {
			    dsx.com = e[0].description as string
          dsx.sp = new SerialPort({path: dsx.com, baudRate: dsx.BAUDRATE})
          // 自定义监听：断开
          dsx.detectTim = setInterval(async () => {
            SerialPort.list().then(curPortInfo => {
              const curPortList = curPortInfo
              .filter(v => v.serialNumber)
              .map(v => v.path)
              if (curPortList.indexOf(dsx.com) < 0) {
                dsx.reset()
                vscode.window.showInformationMessage("设备已断开")
              }
            })
          }, 100)
          // 监听：异常
          dsx.sp.on("error", () => {
            console.log("error")
            dsx.reset()
            vscode.window.showInformationMessage("设备已断开")
          })
          vscode.window.showInformationMessage("设备连接成功")
        } else vscode.window.showInformationMessage("设备已断开")
      } catch (e) {console.log("connect err:", e)}
			quickPick.dispose()
		})
		quickPick.onDidHide(() => quickPick.dispose())
		quickPick.show()
  },
  
  /* 2. 在线模式repl */
  enterRepl: async () => {
    const portInfo = await SerialPort.list();
    let portList = portInfo.filter(v => v.serialNumber).map(v => v.path)
    if (dsx.com) {
			if (portList.indexOf(dsx.com) >= 0) {
        vscode.window.showInformationMessage("Repl模式开启")
        const terList = vscode.window.terminals
        // 是否已开启过串口终端
        let isOpen = false
        let ter: vscode.Terminal | undefined
        terList.forEach(t => {
          if (t.name == dsx.com) {
            isOpen = true
            ter = t
          }
        })
        if (!isOpen)  ter = vscode.window.createTerminal(dsx.com)
        else {ter?.sendText(`\x1d`);ter?.sendText(`cls`)} // 未退出repl情况下再次开启
        if (ter) {
          ter.show(true)
          ter.sendText(`terminal-s -p ${dsx.com} -b ${dsx.BAUDRATE}`)
          setTimeout(()=>{
            ter?.sendText(`\x03`)
          }, 2200)
        }            
			} else {vscode.window.showErrorMessage("设备已断开")}
		} else {vscode.window.showErrorMessage("请先连接串口")}
  },

  /* 3. 设备重启 */
  reboot: () => {
    const sp = new SerialPort(
      {path: dsx.com, baudRate: dsx.BAUDRATE, dataBits: 8, stopBits: 1, parity: "none"},
      err => {
        if (!err) {
          setTimeout(() => {
            sp.write(Buffer.from([0x03, 0x04, 0x1d]), err => {
              sp.close()
            })
          }, 500)          
        } else vscode.window.showErrorMessage("程序加载异常: 串口占用(需退出Repl模式)")
      }
    )
  },

  /* 上传文件 */
  uploadFile: async (fileUri: string) => {
    console.log("pass parm", fileUri)
    let editor = vscode.window.activeTextEditor
    if (editor) {
      let activeText = editor.document.getText()
      console.log(editor.document.getText())
      if (dsx.sp) {
        try {
          let codeArr = activeText.split("\n")
          const uploadStep = 100 / codeArr.length
          console.log("#Upload start")

          await dsx.sp.write(new Uint8Array([3, 7]).buffer)
          await msDelay(3000)
          await dsx.sp.write(new TextEncoder().encode("#\n")) // 智能主控需要
          await msDelay(10)
          for (let v of codeArr) {
            let lineU8Code = new TextEncoder().encode(v+"\n")
            await dsx.sp.write(lineU8Code.buffer)
            await msDelay(10)
            // this.curPercent = parseInt(this.curPercent + uploadStep)
            // updatePercent(this.curPercent)
          }
          await dsx.sp.write(new Uint8Array([170, 102]).buffer)
          await msDelay(80)
          console.log("#Upload over")  
        } catch (e) {console.log("upload err:", e)}
      }
    } 
  },

  get_CF_COM: () => dsx.com
}

/* -------------------------- */
/* 延时 */
function msDelay (t: number) {
  return new Promise ((rsv: (v: unknown)=>void, rej) => {
    setTimeout (() => rsv(1), t)
  })
}