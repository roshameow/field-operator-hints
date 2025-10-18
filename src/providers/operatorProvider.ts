import * as vscode from 'vscode';
import { OperatorInfo } from '../types';

export function registerOperatorProvider(
	pythonSelectors: vscode.DocumentSelector,
	operators: OperatorInfo[]
): vscode.Disposable[] {

	const completionProvider = vscode.languages.registerCompletionItemProvider(
		pythonSelectors,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const wordRange = document.getWordRangeAtPosition(position);
				const word = wordRange ? document.getText(wordRange) : '';

				if (!word) {
					return [];
				}

				return operators
					.filter(op => op.name.startsWith(word))
					.map(op => {
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
		pythonSelectors,
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

	return [completionProvider, hoverProvider];
}
