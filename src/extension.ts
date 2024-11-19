import * as vscode from 'vscode'
import {exec} from "child_process"
import opSerialport from './core/opSerialport'

export function activate (context: vscode.ExtensionContext) {
	/* 2. 串口选择 */
	const selectSp = vscode.commands.registerCommand('cfdsx.selectSp', () => {
		opSerialport.selectSp()
	});

	/* 上传程序 */
	const uploadFile = vscode.commands.registerCommand("cfdsx.uploadFile", (uri) => {
		opSerialport.uploadFile(uri)
	})

	/* test */
	const helloWorld = vscode.commands.registerCommand("cfdsx.helloWorld", () => {
		vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Finding ...',
				cancellable: false,
			},
			async (progress, token) => {
			  for (let i = 0; i < 10; i++) {
				  setTimeout(() => {
				  	progress.report({ increment: i*10, message: "xxxxx" })
				  }, 10000)
				}
		 	}
		)
	})

	context.subscriptions.push(selectSp, helloWorld)
} 