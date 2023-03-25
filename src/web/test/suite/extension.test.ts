import assert = require('assert');
import * as vscode from 'vscode';
import * as fmtExt from '../../extension';
import { newOption } from 'thrift-fmt-ts';

suite('Web Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Sample test', () => {
		const rawContent = `include    "shared.thrift"`;
		const [content, ok] = fmtExt.formatThrift(rawContent, newOption({indent: 4}));
		assert.ok(ok);
		assert.equal(content, 'include "shared.thrift"');
	});

	test('Sample test', () => {
		const rawContent = `const  string default_user = "\\'default_user\\'" ;
        const string default_name = '"abc\\'s"';`
        const [content, ok] = fmtExt.formatThrift(rawContent, newOption({indent: 4}));
		assert.ok(ok);
		assert.equal(content.length, 89);
	});

	test('test assign align', () => {
		const rawContent = `
		enum Numbers {
			ONE =1,
			TWO,
			SEVEN = 7, // seven
		}`
        const [content, ok] = fmtExt.formatThrift(rawContent, newOption({indent:4, alignByAssign:true}));
		//assert.ok(ok);
		assert.equal(content,
`enum Numbers {
    ONE   = 1,
    TWO,
    SEVEN = 7, // seven
}`);
	});
});
