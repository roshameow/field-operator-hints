import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface OperatorInfo {
	name: string;
	category: string;
	scope: string[];
	definition: string;
	description: string;
	documentation?: string | null;
}

function loadOperators(context: vscode.ExtensionContext): OperatorInfo[] {
	const jsonPath = path.join(context.extensionPath, 'assets', 'operators_2025.json');
	const content = fs.readFileSync(jsonPath, 'utf-8');
	const data = JSON.parse(content);
	return data as OperatorInfo[];
}

export function activate(context: vscode.ExtensionContext) {
	console.log('✅ Extension activated!');
	vscode.window.showInformationMessage('🧠 Operator Hint Extension Activated!');

	const operators = loadOperators(context);

	// Completion
	const completionProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'python' }, // 可根据需要改语言
		{
			provideCompletionItems() {
				return operators.map(op => {
					const item = new vscode.CompletionItem(op.name, vscode.CompletionItemKind.Function);
					item.detail = op.definition;
					item.documentation = new vscode.MarkdownString(`**${op.category}**\n\n${op.description}`);
					return item;
				});
			}
		},
		...'abcdefghijklmnopqrstuvwxyz_'.split('')
	);

	// Hover
	const hoverProvider = vscode.languages.registerHoverProvider(
		{ scheme: 'file', language: 'python' },
		{
			provideHover(document, position) {
				const word = document.getText(document.getWordRangeAtPosition(position));
				const match = operators.find(op => op.name === word);
				if (match) {
					const md = new vscode.MarkdownString();
					md.appendMarkdown(`### ${match.name} (${match.category})\n`);
					md.appendCodeblock(match.definition, 'python');
					md.appendMarkdown(`\n\n${match.description}`);
					if (match.documentation) {
						md.appendMarkdown(`\n\n[Docs](${match.documentation})`);
					}
					return new vscode.Hover(md);
				}
			}
		}
	);

	context.subscriptions.push(completionProvider, hoverProvider);
}
