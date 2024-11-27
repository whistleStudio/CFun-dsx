import * as vscode from 'vscode'
import opSerialport from './core/opSerialport'
import setupDsx from './core/setupDsx'
import {exec} from "child_process"
import { toc } from './examples/toc';
import { ExampleTreeDataProvider, openExampleDoc } from './core/exampleTreeDataProvider';


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

	/* 4. 打开接口文档 */
	const openApiDoc = vscode.commands.registerCommand("cfdsx.openApiDoc", () => {
		exec("start https://dict.cfunworld.com/apidoc/cfdsx/")
	})

	/* 5. 打开示例 */
	// 侧边栏注册
	for (let i in toc) {
		vscode.window.registerTreeDataProvider(i, new ExampleTreeDataProvider(context, i))
	}

	vscode.commands.registerCommand("cfdsx.openExample", (item: vscode.TreeItem) => {
		openExampleDoc(item)
	} )

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

	context.subscriptions.push(selectSp, uploadFile, installMachine, setup, 
		openApiDoc, helloWorld)
} 

/* ---------------------- */
/* 延时 */
function msDelay (t: number) {
  return new Promise ((rsv: (v: unknown)=>void, rej) => {
    setTimeout (() => rsv(1), t)
  })
}