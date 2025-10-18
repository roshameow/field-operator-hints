import * as vscode from 'vscode';

/**
 * 注册 universe/neutralization 补全 + 折叠 + 大纲
 * @param pythonSelectors VSCode DocumentSelector
 * @param mergedUniverseMap Map<string, string[]> universe 映射
 * @param mergedNeutralMap Map<string, string[]> neutralization 映射
 */
export function registerNeutralizationProvider(
	pythonSelectors: vscode.DocumentSelector,
	mergedUniverseMap: Map<string, string[]>,
	mergedNeutralMap: Map<string, string[]>
): vscode.Disposable[] {

	// --- universe 补全 ---
	const universeCompletionProvider = vscode.languages.registerCompletionItemProvider(
		pythonSelectors,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const lineText = document.lineAt(position).text;
				const lineUntilPos = lineText.slice(0, position.character);
				const quoteMatch = lineUntilPos.match(/["']([\w\d_]*)$/);
				const word = quoteMatch ? quoteMatch[1] : '';
				const range = quoteMatch
					? new vscode.Range(
							position.line,
							position.character - word.length,
							position.line,
							position.character
					  )
					: undefined;

				const items: vscode.CompletionItem[] = [];
				for (const [value, regions] of mergedUniverseMap.entries()) {
					if (!word || value.startsWith(word)) {
						const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
						item.detail = `universe: ${regions.join(', ')}`;
						item.sortText = '0_' + value;
						if (range) item.range = range;
						items.push(item);
					}
				}
				return items;
			}
		},
		...'"abcdefghijklmnopqrstuvwxyz_\''.split('')
	);

	// --- neutralization 补全 ---
	const neutralCompletionProvider = vscode.languages.registerCompletionItemProvider(
		pythonSelectors,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const lineText = document.lineAt(position).text;
				const lineUntilPos = lineText.slice(0, position.character);
				const quoteMatch = lineUntilPos.match(/["']([\w\d_]*)$/);
				const word = quoteMatch ? quoteMatch[1] : '';
				const range = quoteMatch
					? new vscode.Range(
							position.line,
							position.character - word.length,
							position.line,
							position.character
					  )
					: undefined;

				const items: vscode.CompletionItem[] = [];
				for (const [value, regions] of mergedNeutralMap.entries()) {
					if (!word || value.startsWith(word)) {
						const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
						item.detail = `neutralization: ${regions.join(', ')}`;
						item.sortText = '0_' + value;
						if (range) item.range = range;
						items.push(item);
					}
				}
				return items;
            }
        },
        ...'"abcdefghijklmnopqrstuvwxyz_\''.split('')
    );

	// --- 折叠区域 ---
	const foldingProvider = vscode.languages.registerFoldingRangeProvider(
		pythonSelectors,
		{
			provideFoldingRanges(document) {
				const ranges: vscode.FoldingRange[] = [];
				const startStack: number[] = [];

				for (let i = 0; i < document.lineCount; i++) {
					const line = document.lineAt(i).text;
					if (/^\s*#neutralization\b/.test(line)) {
						startStack.push(i);
					} else if (/^\s*#endneutralization\b/.test(line)) {
						const start = startStack.pop();
						if (start !== undefined) {
							ranges.push(new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Region));
						}
					}
				}
				return ranges;
			}
		}
	);

	// --- 大纲符号 ---
	const symbolProvider = vscode.languages.registerDocumentSymbolProvider(
		pythonSelectors,
		{
			provideDocumentSymbols(document) {
				const symbols: vscode.DocumentSymbol[] = [];
				for (let i = 0; i < document.lineCount; i++) {
					const line = document.lineAt(i);
					const match = line.text.match(/^\s*#neutralization\s*(.+)?$/);
					if (match) {
						const name = match[1]?.trim() || 'Unnamed neutralization';
						const symbol = new vscode.DocumentSymbol(
							name,
							'Neutralization Block',
							vscode.SymbolKind.Namespace,
							line.range,
							line.range
						);
						symbols.push(symbol);
					}
				}
				return symbols;
			}
		}
	);

	return [universeCompletionProvider, neutralCompletionProvider, foldingProvider, symbolProvider];
}
