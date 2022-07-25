import * as vscode from 'vscode';

import { ThriftData } from 'thrift-parser-ts';
import { ThriftFormatter } from 'thrift-fmt-ts';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "thirft-formatter" is now active in the web extension host!');

	// register formatThriftfile command
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

	// register thrift language formatter
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
