import getTargetDrive from "./getTargetDrive";
import fs from "fs"
import * as vscode from 'vscode';
import path from "path";
import opSerialport from "./opSerialport";


const ignoreFiles = ["README.txt", "pybcdc.inf", "boot.py"]
const ignoreDir = [".vscode"]

export default {
  /* 1. 上传文件 */
  uploadFile: async (curFileUri: string) => {
    if (opSerialport.get_CF_COM()) {
      curFileUri = curFileUri.slice(1)
      const targetDrive = await getTargetDrive("CFUNFLASH")
      if (!targetDrive) { vscode.window.showErrorMessage("未找到CFUNFLASH") }
      else {
        fs.readFile(curFileUri, (err, data) => {
          if (err) {
            vscode.window.showErrorMessage("文件读取失败") }
          else {
            fs.writeFile(`${targetDrive}:/main.py`, data, err => {
              if (err) { vscode.window.showErrorMessage("上传失败") } 
              else { 
                vscode.window.showInformationMessage("上传成功")
                opSerialport.reboot()
              }
            })     
          }
        })
      }
    } else { vscode.window.showErrorMessage("请先连接串口") }
  },

  /* 2. 上传项目 */
  uploadProject: (curProjUri: string) => {
    if (opSerialport.get_CF_COM()) {
      curProjUri = curProjUri.slice(1)
      // 遍历目录，是否包含main.py
      fs.readdir(curProjUri, async (err, files) => {
        if (!err) {
          let flag = false
          files.forEach(v => {
            if (v == "main.py") flag = true
          })
          if (flag) {
            // 打开CF磁盘
            const targetDrive = await getTargetDrive("CFUNFLASH")
            if (targetDrive) {
              try {
                copyDir(curProjUri, `${targetDrive}:/`)
                vscode.window.showInformationMessage("上传成功")
                opSerialport.reboot()
              } catch(err) {console.log(err); vscode.window.showErrorMessage("上传失败")}
            } else vscode.window.showErrorMessage("未找到CFUNFLASH")
          } else vscode.window.showErrorMessage("项目根目录缺失文件: main.py") 
        } else vscode.window.showErrorMessage("项目读取失败")
      })
    } else { vscode.window.showErrorMessage("请先连接串口") }
  },

  /* 3. 还原pyb */
  recoverPyb: async (context: vscode.ExtensionContext) => {
    const targetDrive = await getTargetDrive("CFUNFLASH")
    if (targetDrive) {
      vscode.window.showWarningMessage("确定要还原主控吗", "是", "否")
      .then(select => {
        if (select == "是") try {
          console.log(targetDrive)
          rmAndCp(`${targetDrive}:/`, `${context.extensionPath}/src/original`)
        } catch(e) {
          // 连续两次会报EPERM错误，暂时未知
          const reg= /.*EPERM:.*operation.*not.*permitted.*rmdir/
          if (reg.test(e as string)) {
            rmAndCp(`${targetDrive}:/`, `${context.extensionPath}/src/original`)
          } else vscode.window.showErrorMessage(`操作失败\n${e}`)}
      })
    } else vscode.window.showErrorMessage("未找到CFUNFLASH")
  }
} 


// 递归复制文件夹
function copyDir (cpPath: string, destPath: string, isIgnoreFiles = true) {
  const files = fs.readdirSync(cpPath) 
  files.forEach(v => {
    const curCp = path.resolve(cpPath, v)
    const curDest = path.resolve(destPath, v)
    fs.stat(curCp, (err, stats) => {
      if (!err) {
        // 复制文件
        if (stats.isFile()) {
          if (isIgnoreFiles) {
            const reg = /\.(png|jpg|jpeg)$/ //传图片时用
            if (ignoreFiles.indexOf(v) < 0 && !reg.test(v)) fs.createReadStream(curCp).pipe(fs.createWriteStream(curDest));
          } else fs.createReadStream(curCp).pipe(fs.createWriteStream(curDest))
        }
        // 复制目录 
        else if (stats.isDirectory()) {
          if (ignoreDir.indexOf(v) < 0) {
            fs.mkdirSync(curDest, {recursive: true}) 
            copyDir(curCp, curDest)
          }
        }
      }
    })
  })
}

// 清空拷贝
function rmAndCp (rmPath: string, cpPath: string) {
  fs.rmdirSync(rmPath, {recursive: true})
  copyDir(cpPath, rmPath, false)
  vscode.window.showInformationMessage("主控已重置")
}
