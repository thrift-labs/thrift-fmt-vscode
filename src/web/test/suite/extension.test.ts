// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import assert = require('assert');
import * as vscode from 'vscode';
import * as fmtExt from '../../extension';

suite('Web Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Sample test', () => {
		const rawContent = `include    "shared.thrift"`;
		const [content, ok] = fmtExt.formatThrift(rawContent, true, 4);
		assert.ok(ok);
		assert.equal(content, 'include "shared.thrift"');
	});
});
