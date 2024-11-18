import * as vscode from 'vscode'
import {exec} from "child_process"
import opSerialport from './core/opSerialport'

export function activate (context: vscode.ExtensionContext) {
	/* 2. 串口选择 */
	const selectSp = vscode.commands.registerCommand('cfdsx.selectSp', () => {
		opSerialport.selectSp()
	});


	context.subscriptions.push(selectSp)
} 