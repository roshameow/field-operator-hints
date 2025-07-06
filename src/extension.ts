import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface OperatorInfo {
	name: string;
	category: string;
	definition: string;
	description: string;
}

function loadOperators(context: vscode.ExtensionContext): OperatorInfo[] {
	const config = vscode.workspace.getConfiguration('fieldOperatorHints');
	const customPath = config.get<string>('customOperatorJsonPath');
	let finalPath = '';

	if (customPath && customPath.trim()) {
		if (path.isAbsolute(customPath)) {
			finalPath = customPath;
		} else {
			const workspace = vscode.workspace.workspaceFolders?.[0];
			if (workspace) {
				finalPath = path.join(workspace.uri.fsPath, customPath);
			}
		}
	} else {
		finalPath = path.join(context.extensionPath, 'assets', 'operators_2025.json');
	}

	if (!fs.existsSync(finalPath)) {
		vscode.window.showErrorMessage(`❌ Operator JSON not found: ${finalPath}`);
		return [];
	}

	try {
		const raw = fs.readFileSync(finalPath, 'utf-8');
		const json = JSON.parse(raw);
		return json as OperatorInfo[];
	} catch (err) {
		vscode.window.showErrorMessage(`❌ Failed to parse operator JSON: ${err}`);
		return [];
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('✅ Field Operator Hints activated');

	const operators = loadOperators(context);

	const completionProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'python' },
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

	const hoverProvider = vscode.languages.registerHoverProvider(
		{ scheme: 'file', language: 'python' },
		{
			provideHover(document, position) {
				const word = document.getText(document.getWordRangeAtPosition(position));
				const op = operators.find(o => o.name === word);
				if (op) {
					return new vscode.Hover([
						`**${op.name}** (${op.category})`,
						'',
						'```python\n' + op.definition + '\n```',
						'',
						op.description
					]);
				}
			}
		}
	);

	context.subscriptions.push(completionProvider, hoverProvider);
}
