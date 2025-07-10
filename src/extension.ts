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

interface RegionMap {
	[region: string]: string[];
}

function loadRegionMap(
	context: vscode.ExtensionContext,
	key: 'universe' | 'neutralization'
): RegionMap {
	try {
		const config = vscode.workspace.getConfiguration('fieldOperatorHints');
		const customPath = config.get<string>('customRegionSettingJsonPath');
		let settingsPath = '';

		if (customPath && customPath.trim()) {
			if (path.isAbsolute(customPath)) {
				settingsPath = customPath;
			} else {
				const workspace = vscode.workspace.workspaceFolders?.[0];
				if (workspace) {
					settingsPath = path.join(workspace.uri.fsPath, customPath);
				}
			}
		} else {
			settingsPath = path.join(context.extensionPath, 'assets', 'settings_snapshot.json');
		}
		const raw = fs.readFileSync(settingsPath, 'utf-8');
		const json = JSON.parse(raw);

		const equitySettings =
			json.actions?.POST?.settings?.children?.[key]?.choices?.instrumentType?.EQUITY?.region || {};

		const map: RegionMap = {};
		for (const [region, values] of Object.entries(equitySettings)) {
			map[region] = (values as any[]).map((v: any) => v.value);
		}

		return map;
	} catch (err) {
		console.warn(`⚠️ Failed to load ${key} from settings_snapshot.json:`, err);
		return {};
	}
}

function loadMergedRegionMap(
	context: vscode.ExtensionContext,
	key: 'universe' | 'neutralization'
): Map<string, string[]> {
	const regionToValues = loadRegionMap(context, key); // 复用你已有的函数
	const valueToRegions = new Map<string, string[]>();

	for (const [region, values] of Object.entries(regionToValues)) {
		for (const value of values) {
			if (!valueToRegions.has(value)) {
				valueToRegions.set(value, []);
			}
			valueToRegions.get(value)!.push(region);
		}
	}
	return valueToRegions;
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


	//region universe hints
	const mergedUniverseMap = loadMergedRegionMap(context, 'universe');

	const universeCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'python' },
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
	context.subscriptions.push(universeCompletionProvider);

	// region neutralization hints
	const mergedNeutralMap = loadMergedRegionMap(context, 'neutralization');

	const neutralizationCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'python' },
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
		...'abcdefghijklmnopqrstuvwxyz_\''.split('')
	);
	context.subscriptions.push(neutralizationCompletionProvider);


}
