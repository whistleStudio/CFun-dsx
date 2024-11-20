import { SerialPort } from "serialport";
import * as vscode from "vscode"

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
    // 搜索框下拉弹出菜单
    const quickPick = vscode.window.createQuickPick()
    console.log("isOpen:", dsx.sp?.isOpen)
    quickPick.placeholder = portList.length>0 ? "👇点击目标串口👇 " : "🔍未检测可用串口🔍"
		quickPick.items = portList.map(v => ({label: v == dsx.com ? v+" ✔️": v, description: v}));
    // 选择时回调
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
          dsx.sp.on("error", err => {
            console.log("error")
            dsx.reset()
            vscode.window.showErrorMessage(`设备检测异常: ${err}`)
          })
          vscode.window.showInformationMessage("设备连接成功")
        } else vscode.window.showInformationMessage("设备已断开")
      } catch (e) {vscode.window.showErrorMessage(`设备检测异常: ${e}`)}
			quickPick.dispose()
		})
		quickPick.onDidHide(() => quickPick.dispose())
		quickPick.show()
  },
  
  /* 2. 上传文件 */
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
          // vscode动态消息提示
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: '',
              cancellable: false,
            },
            async (progress, token) => {
              // 上传开始
              progress.report({increment: 1, message: `上传中...: 0%`})
              dsx.sp?.write(Buffer.from(new Uint8Array([3, 7])))
              await msDelay(3000)
              dsx.sp?.write(Buffer.from(new TextEncoder().encode("#\n"))) // 智能主控需要
              await msDelay(10)
              // 上传过程
              let prog = 0
              for (let v of codeArr) {
                if (dsx.sp) {
                  let lineU8Code = new TextEncoder().encode(v+"\n")
                  dsx.sp.write(Buffer.from(lineU8Code))
                  prog += uploadStep
                  progress.report({increment: uploadStep, message: `上传中...: ${prog}%`})
                  await msDelay(10)
                }  
              }
              // 上传结束
              if (prog + uploadStep >= 100) {
                dsx.sp?.write(Buffer.from(new Uint8Array([170, 102])))
                await msDelay(80)
                progress.report({increment: uploadStep, message: "上传中...: 100%"})
                vscode.window.showInformationMessage("上传完成 🎉")
              } else vscode.window.showInformationMessage("上传失败 ⚠️")
              await msDelay(20)
            }
          ) 
        } catch (e) {vscode.window.showErrorMessage(`设备检测异常: ${e}`)}
      } else vscode.window.showInformationMessage("未检测到串口设备")
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