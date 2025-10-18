import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { OperatorInfo } from '../types';

export function loadOperators(context: vscode.ExtensionContext): OperatorInfo[] {
	const config = vscode.workspace.getConfiguration('fieldOperatorHints');
	const customPath = config.get<string>('customOperatorJsonPath');
	let finalPath = '';

	if (customPath && customPath.trim()) {
		if (path.isAbsolute(customPath)) {
			finalPath = customPath;
		} else {
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			if (workspaceFolder) {
				finalPath = path.join(workspaceFolder.uri.fsPath, customPath);
			}
		}
	}

	if (!finalPath) {
		finalPath = path.join(context.extensionPath, 'assets', 'operators_2025.json');
	}

	if (!fs.existsSync(finalPath)) {
		vscode.window.showErrorMessage(`❌ Operator JSON not found: ${finalPath}`);
		return [];
	}

	try {
		return JSON.parse(fs.readFileSync(finalPath, 'utf-8')) as OperatorInfo[];
	} catch (err) {
		vscode.window.showErrorMessage(`❌ Failed to parse operator JSON: ${err}`);
		return [];
	}
}
