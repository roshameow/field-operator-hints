import * as vscode from 'vscode';
import { loadOperators } from './loaders/operators';
import { loadMergedRegionMap } from './loaders/neutralizations';
import { loadSaFields } from './loaders/saFields';

// 各种 Provider 注册函数
import { registerOperatorProvider } from './providers/operatorProvider';
import { registerNeutralizationProvider } from './providers/neutralizationProvider';
import { registerSaFieldProvider } from './providers/saFieldProvider';

export function activate(context: vscode.ExtensionContext) {
    // --- 打印扩展信息 ---
    const pkg = require(context.asAbsolutePath('package.json'));
	const outputChannel = vscode.window.createOutputChannel('Field Operator Hints');
	outputChannel.appendLine('🛠️ Activating Field Operator Hints...');
	outputChannel.appendLine(`Extension path: ${context.extensionPath}`);
	outputChannel.appendLine(`Version: ${pkg.version}`);
	outputChannel.appendLine(`Publisher: ${pkg.publisher}`);

	// --- 通用语言选择器 ---
	const pythonSelectors = [
		{ scheme: 'file', language: 'python' },
		{ scheme: 'vscode-notebook-cell', language: 'python' }
	];

	// === 1️⃣ 加载静态数据 ===
	const operators = loadOperators(context);
	outputChannel.appendLine(`Loaded ${operators.length} operators.`);

	const mergedUniverseMap = loadMergedRegionMap(context, 'universe');
	outputChannel.appendLine(`Loaded ${mergedUniverseMap.size} universe entries.`);

	const mergedNeutralMap = loadMergedRegionMap(context, 'neutralization');
	outputChannel.appendLine(`Loaded ${mergedNeutralMap.size} neutralization entries.`);


	const saFields = loadSaFields(context);
	outputChannel.appendLine(`Loaded ${Object.keys(saFields).length} SA field groups.`);

	// === 2️⃣ 注册所有 Provider ===
	context.subscriptions.push(
		...registerOperatorProvider(pythonSelectors, operators),
		...registerNeutralizationProvider(pythonSelectors, mergedUniverseMap, mergedNeutralMap),
		...registerSaFieldProvider(pythonSelectors, saFields)
	);

	vscode.window.showInformationMessage('✨ All providers registered successfully.');
}

export function deactivate() {
	console.log('🛑 Field Operator Hints deactivated');
}
