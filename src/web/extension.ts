// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ThriftData } from 'thrift-parser-ts';
import { ThriftFormatter } from 'thrift-fmt-ts';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "thirft-formatter" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('thirft-formatter.formatThriftFile', async () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		const config = vscode.workspace.getConfiguration('thirftFormatter');
		const patch = config.get<boolean>('patch');
		const indent = config.get<number>('indent');

		const { document } = vscode.window.activeTextEditor;
		const content = document.getText();
		if (content === "") {
			vscode.window.showInformationMessage('No content to format.');
			return;
		}

		const [fmtContent, needUpdate] = formatThrift(content, patch || false, indent);
		if (needUpdate) {
			vscode.window.activeTextEditor.edit(editBuilder => {
				editBuilder.replace(
					new vscode.Range(0, 0, document.lineCount, 0), fmtContent);
			})
			vscode.window.showInformationMessage('Thrift file has been formatted');
		}
	});

	// 👍 formatter implemented using API
	vscode.languages.registerDocumentFormattingEditProvider('thrift', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const config = vscode.workspace.getConfiguration('thirftFormatter');
			const patch = config.get<boolean>('patch');
			const indent = config.get<number>('indent');

			const content = document.getText();
			if (content === "") {
				vscode.window.showInformationMessage('No content to format.');
				return [];
			}

			const [fmtContent, needUpdate] = formatThrift(content, patch || false, indent);

			if (needUpdate) {
				return [
					vscode.TextEdit.replace(
						new vscode.Range(0, 0, document.lineCount, 0), fmtContent)
				];
			}
		return [];
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

export function formatThrift(content :string, patch :boolean, indent: number|undefined): [string, boolean] {
	if (content === "") {
		return ["", false];
	}

	let data: ThriftData;
	try {
		data = ThriftData.from_string(content);
	} catch (error) {
		vscode.window.showInformationMessage('Thrift Formatter parse failed ' + error);
		return ["", false];
	}

	const fomatter = new ThriftFormatter(data);
	fomatter.option(true, patch, indent);

	const newContent = fomatter.format();
	if (newContent === content) {
		vscode.window.showInformationMessage('Thrift File has been formatted');
		return ["", false];
	}
	if (newContent === "") {
		vscode.window.showInformationMessage('Thrift Formatter something wrong');
		return ["", false];
	}

	return [newContent, true];
}
