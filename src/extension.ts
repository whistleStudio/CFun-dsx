import * as vscode from 'vscode'
import opSerialport from './core/opSerialport'
import setupDsx from './core/setupDsx'

export function activate (context: vscode.ExtensionContext) {
	// 只执行一次, 默认安装相关py包 pip install ./src/pyblib/pyb-0.0.0-py3-none-any.whl
	setupDsx.setup(context)
	/* 1. 安装machine库 */
	const installMachine = vscode.commands.registerCommand("cfdsx.installMachine", () => {
		setupDsx.installMachine(context, true)
	})

	/* 手动初始化 */
	const setup = vscode.commands.registerCommand("cfdsx.setup", () => {
		setupDsx.setup(context)
	})

	/* 2. 串口选择 */
	const selectSp = vscode.commands.registerCommand('cfdsx.selectSp', () => {
		opSerialport.selectSp()
	});

	/* 3. 上传程序 */
	const uploadFile = vscode.commands.registerCommand("cfdsx.uploadFile", (uri) => {
		opSerialport.uploadFile(uri)
	})

	/* !!!test!!! */
	const helloWorld = vscode.commands.registerCommand("cfdsx.helloWorld", () => {
		vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Finding ...',
				cancellable: false,
			},
			async (progress, token) => {
			  for (let i = 0; i < 10; i++) {
				  // setTimeout(() => {
				  // 	progress.report({ increment: i*10, message: "xxxxx" })
				  // }, 10000)
					progress.report({increment: 10, message: i+""})
					await msDelay(1000)
				}
		 	}
		)
	})

	context.subscriptions.push(selectSp, uploadFile, installMachine, setup, helloWorld)
} 

/* ---------------------- */
/* 延时 */
function msDelay (t: number) {
  return new Promise ((rsv: (v: unknown)=>void, rej) => {
    setTimeout (() => rsv(1), t)
  })
}