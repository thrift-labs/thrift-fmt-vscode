import * as vscode from 'vscode';

import { ThriftData } from 'thrift-parser-ts';
import { ThriftFormatter, Option, newOption } from 'thrift-fmt-ts';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "thrift-formatter" is now active in the web extension host!');

	// register formatThriftfile command
	let disposable = vscode.commands.registerCommand('thirft-formatter.formatThriftFile', async () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		const { document } = vscode.window.activeTextEditor;
		const [fmtContent, ] = editDocument(document);
		if (fmtContent.length > 0) {
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
			const [, textEdit] = editDocument(document);
			if (textEdit === undefined) {
				return [];
			}
			return [textEdit];
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

export function editDocument(document: vscode.TextDocument): [string, vscode.TextEdit|undefined] {
	const config = vscode.workspace.getConfiguration('thriftFormatter');
	const option = newOption({
		patchRequired: config.get<boolean>('patch'),           // 兼容
		patchSeparator: config.get<boolean>('patchSeparator'),
		indent: config.get<number>('indent'),
		alignByAssign: config.get<boolean>('assignAlign'),     // 兼容
		alignByField: config.get<boolean>('alignByField'),
	})

	const content = document.getText();
	if (content === "") {
		vscode.window.showInformationMessage('No content to format.');
		return ["", undefined];
	}

	const [fmtContent, needUpdate] = formatThrift(content, option);
	if (needUpdate) {
		return [
			fmtContent,
			vscode.TextEdit.replace(
				new vscode.Range(0, 0, document.lineCount, 0), fmtContent)
		];
	}
	return [fmtContent, undefined];
}

export function formatThrift(content :string, option: Option): [string, boolean] {
	if (content === "") {
		return ["", false];
	}

	let data: ThriftData;
	try {
		data = ThriftData.fromString(content);
	} catch (error) {
		vscode.window.showInformationMessage('Thrift Formatter parse failed ' + error);
		return ["", false];
	}

	const fomatter = new ThriftFormatter(data);
	fomatter.option(option);

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
