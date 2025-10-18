import * as vscode from 'vscode';

/**
 * 注册 SA Fields 补全和 hover
 */
export function registerSaFieldProvider(
	pythonSelectors: vscode.DocumentSelector,
	saFields: Record<string, string[]>
): vscode.Disposable[] {

	const validGroups = Object.keys(saFields);

	// --- Completion Provider ---
	const saCompletionProvider = vscode.languages.registerCompletionItemProvider(
		pythonSelectors,
		{
			provideCompletionItems(document, position) {
				if (validGroups.length === 0) {
					return undefined;
				}

				const lineText = document.lineAt(position).text;
				const lineUntilPos = lineText.slice(0, position.character);

				// 匹配 /xxx
				const match = lineUntilPos.match(/\/([\w]*)$/);
				if (!match) return undefined;

				const prefix = match[1] || '';
				const lowerPrefix = prefix.toLowerCase();

				// 找到匹配的 group
                const matchedGroups = validGroups.filter(g =>
                    g.toLowerCase().startsWith(lowerPrefix)
                );

                if (matchedGroups.length === 0) {
                    return undefined;
                }

                // 计算要替换的范围
                const range = new vscode.Range(
                    position.line,
                    position.character - (prefix.length + 1), // 包含 '/'
                    position.line,
                    position.character
                );

                const items: vscode.CompletionItem[] = [];

                for (const group of matchedGroups) {
                    for (const field of saFields[group]) {
                        const item = new vscode.CompletionItem(
                            `${group}: ${field}`,
                            vscode.CompletionItemKind.Field
                        );

						// 告诉 VS Code 如何过滤：使用 /group 的形式
						item.filterText = `/${group}`;
                        // 替换文本：只插入 field
                        item.insertText = field;
                        item.range = range;

                        item.detail = `From group: /${group}`;
                        item.documentation = new vscode.MarkdownString(
                            `**${field}** from group \`/${group}\``
                        );
                        item.sortText = `0_${group}_${field}`;
                        items.push(item);
                    }
                }

                return items;
            }
        }
		// (不再需要触发字符 '/')
    );


	// --- Hover Provider ---
	const saHoverProvider = vscode.languages.registerHoverProvider(
		pythonSelectors,
		{
			provideHover(document, position) {
				const wordRange = document.getWordRangeAtPosition(position, /[\w_]+/);
				if (!wordRange) return undefined;
				const word = document.getText(wordRange);

				for (const [group, fields] of Object.entries(saFields)) {
					if (fields.includes(word)) {
						const md = new vscode.MarkdownString(
							`**${word}**\n\nFrom \`/${group}\` field group.`
						);
						md.isTrusted = true;
						return new vscode.Hover(md, wordRange);
					}
				}
				return undefined;
			}
		}
	);

	return [saCompletionProvider, saHoverProvider];
}