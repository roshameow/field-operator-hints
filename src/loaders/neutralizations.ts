import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RegionMap } from '../types';

export function loadRegionMap(context: vscode.ExtensionContext, key: 'universe' | 'neutralization'): RegionMap {
	try {
		const config = vscode.workspace.getConfiguration('fieldOperatorHints');
		const customPath = config.get<string>('customRegionSettingJsonPath');
		let settingsPath = '';

		if (customPath && customPath.trim()) {
			if (path.isAbsolute(customPath)) {
				settingsPath = customPath;
			} else {
				const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
				if (workspaceFolder) {
					settingsPath = path.join(workspaceFolder.uri.fsPath, customPath);
				}
			}
		}

		if (!settingsPath) {
			settingsPath = path.join(context.extensionPath, 'assets', 'settings_snapshot.json');
		}

		const json = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
		const equitySettings =
			json.actions?.POST?.settings?.children?.[key]?.choices?.instrumentType?.EQUITY?.region || {};

		const map: RegionMap = {};
		for (const [region, values] of Object.entries(equitySettings)) {
			map[region] = (values as any[]).map((v: any) => v.value);
		}

		return map;
	} catch (err) {
		vscode.window.showErrorMessage(`❌ Failed to load ${key}: ${err}`);
		return {};
	}
}

export function loadMergedRegionMap(context: vscode.ExtensionContext, key: 'universe' | 'neutralization') {
	const regionToValues = loadRegionMap(context, key);
	const valueToRegions = new Map<string, string[]>();

	for (const [region, values] of Object.entries(regionToValues)) {
		for (const value of values) {
			if (!valueToRegions.has(value)) valueToRegions.set(value, []);
			valueToRegions.get(value)!.push(region);
		}
	}
	return valueToRegions;
}
