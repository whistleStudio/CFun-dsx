import {exec} from "child_process"; 
import * as vscode from 'vscode';
import fs from "fs";

export default {
  /* 1. 安装machine */
  installMachine: function (context: vscode.ExtensionContext, isForce = false) {
    // 获取machine库文件名
    let machineDir = `${context.extensionPath}\\src\\pylib`
    let FileList = fs.readdirSync(machineDir)
    const reg = /machine-.+-py3-none-any.whl/
    let machineLib = ""
    for (let f of FileList) {
      if (reg.test(f)) {machineLib = f; break}
    }
    if (machineLib) {
      let cmd = isForce ? `${machineDir}\\${machineLib} --force-reinstall` : `${machineDir}\\${machineLib}`
      let hint = isForce ? `更新` : `安装`
      exec(`pip3 install ${cmd}`, (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          vscode.window.showErrorMessage(`脚本运行错误\nerr:${error}`)
        } else {
          const re = /Successfully\s*installed\s*machine/
          if (re.test(stdout)) {
            vscode.window.showInformationMessage(`machine库${hint}成功`)
          } else vscode.window.showErrorMessage(`machine库${hint}失败\nstderr:${stderr}`)
        }
      })
    }
  },

  // !!! 细化已安装的状态
  /* 2. 初始化时安装 */
  setup: function (context: vscode.ExtensionContext) {
    suggestInstallExt()
    this.installMachine(context)
  }
}


// 建议安装
function suggestInstallExt () {
  console.log("suggestInstallExt")
  const regPython = /ms-python.python/, regPylance = /ms-python.vscode-pylance/
  exec("code --list-extensions", {shell: "powershell.exe"}, (error, stdout, stderr) => {
    if (!error) {
      //  安装python插件，会自动安装pylance
      if (!regPython.test(stdout)) {
        vscode.window.showInformationMessage("建议安装Microsoft Python扩展", "安装", "算了")
        .then(select => {
          if (select == "安装") exec("code --install-extension ms-python.python", {shell: "powershell.exe"})
        })
      } else if (!regPylance.test(stdout)) {
        // 安装pylance插件
        vscode.window.showInformationMessage("建议安装Microsoft Pylance扩展", "安装", "算了")
        .then(select => {
          if (select == "安装") exec("code --install-extension ms-python.vscode-pylance", {shell: "powershell.exe"}, (error, stdout, stderr) => {
            if (!error) {
              if (/successfully.*installed/.test(stdout)) {
                vscode.window.showInformationMessage("Pylance安装成功!  \n你可能需要重启vscode使其生效")
              }
            }
          })
        })
      }
    } else {console.log(error)}
  })
}