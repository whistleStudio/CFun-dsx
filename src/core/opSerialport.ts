import { SerialPort } from "serialport";
import * as vscode from "vscode"

let CF_COM = ""
const CF_BAUDRATE = 115200

export default {
  /* 1. 串口选择 */
  selectSp: async () => {
    let portInfo = await SerialPort.list();
    // 除去serialNumber: undefined
    portInfo = portInfo.filter(v => v.serialNumber)
    console.log(portInfo)
    let portList = portInfo.map(v => v.path)
    const quickPick = vscode.window.createQuickPick()
    quickPick.placeholder = portList.length>0 ? "👇点击目标串口👇 " : "🔍未检测可用串口🔍"
		quickPick.items = portList.map(v => ({label: v}));
		quickPick.onDidChangeSelection(e => {
			console.log("onDidChangeSelection", e); 
			CF_COM = e[0].label
      vscode.window.showInformationMessage("设备连接成功")
			quickPick.dispose()
		})
		quickPick.onDidHide(() => quickPick.dispose())
		quickPick.show()
  },
  
  /* 2. 在线模式repl */
  enterRepl: async () => {
    const portInfo = await SerialPort.list();
    let portList = portInfo.filter(v => v.serialNumber).map(v => v.path)
    if (CF_COM) {
			if (portList.indexOf(CF_COM) >= 0) {
        vscode.window.showInformationMessage("Repl模式开启")
        const terList = vscode.window.terminals
        // 是否已开启过串口终端
        let isOpen = false
        let ter: vscode.Terminal | undefined
        terList.forEach(t => {
          if (t.name == CF_COM) {
            isOpen = true
            ter = t
          }
        })
        if (!isOpen)  ter = vscode.window.createTerminal(CF_COM)
        else {ter?.sendText(`\x1d`);ter?.sendText(`cls`)} // 未退出repl情况下再次开启
        if (ter) {
          ter.show(true)
          ter.sendText(`terminal-s -p ${CF_COM} -b ${CF_BAUDRATE}`)
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
      {path: CF_COM, baudRate: CF_BAUDRATE, dataBits: 8, stopBits: 1, parity: "none"},
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

  get_CF_COM: () => CF_COM
}