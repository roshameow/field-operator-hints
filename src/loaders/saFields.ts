import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';



export function loadSaFields(context: vscode.ExtensionContext): Record<string, string[]> {
	const config = vscode.workspace.getConfiguration('fieldOperatorHints');
	const customPath = config.get<string>('customSaFieldsJsonPath');
	let finalPath = '';

	if (customPath && customPath.trim()) {
		finalPath = path.isAbsolute(customPath)
			? customPath
			: path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', customPath);
	} else {
		finalPath = path.join(context.extensionPath, 'assets', 'sa_fields.json');
	}

	if (!fs.existsSync(finalPath)) {
		vscode.window.showErrorMessage(`❌ SA Fields JSON not found: ${finalPath}`);
		return {};
	}

	try {
		return JSON.parse(fs.readFileSync(finalPath, 'utf-8'));
	} catch (err) {
		vscode.window.showErrorMessage(`❌ Failed to parse SA Fields JSON: ${err}`);
		return {};
	}
}


