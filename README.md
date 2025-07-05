# Brain DataField & Operator IntelliSense

一个轻量级的 VSCode 插件，提供**悬停文档**和**自动补全**功能，用于自定义的**数据字段**和**运算符**，基于你自己的 JSON 文档。

非常适用于领域特定语言（DSL）、金融建模 DSL 或者内部运算符库。

---

## ✨ 功能

✅ **悬停文档**
在代码中悬停自定义数据字段或运算符时，立即获取相应的描述信息。

✅ **自动补全建议**
输入运算符或字段名称时，提供智能、上下文感知的自动补全。

✅ **基于 JSON 的文档**
通过一个或多个 `.json` 文件来描述你的内部字段/运算符文档，便于维护和扩展。

---

## 📄 替换 JSON 示例

你可以按以下方式替换 `assets/operators_2025.json` 来描述新的运算符和字段：

### 示例 1: `add` 运算符

```json
{
  "name": "add",
  "category": "Arithmetic",
  "scope": ["COMBO", "REGULAR", "SELECTION"],
  "definition": "add(x, y, filter = false), x + y",
  "description": "Add all inputs (at least 2 inputs required). If filter = true, filter all input NaN to 0 before adding",
  "documentation": null,
  "level": "ALL",
  "details": null,
  "content": null,
  "lastModified": null
}
```

### 如何替换 JSON？

1. 将 `JSON` 格式的数据替换成你自己定义的运算符和字段。
2. 确保 `name`, `category`, `definition`, `description` 等字段的内容与你的需求匹配。
3. 保存修改后的 `JSON` 文件。

你可以根据需要新增运算符或字段，只需遵循相同的格式。

---

## 💻 重新编译 VSIX 插件

安装 `.vsix` 插件非常简单，只需按照以下步骤操作：

### 1. 打包插件

如果你已经完成插件的开发，并且准备打包，可以通过以下命令将插件打包成 `.vsix` 文件：

```bash
npm install -g vsce
npm run compile
vsce package
```

这将生成一个 `.vsix` 文件，通常为 `your-extension-name-1.0.0.vsix`。

### 2. 安装 VSIX 插件

在 VSCode 中安装 `.vsix` 插件：

1. 打开 VSCode。
2. 点击左侧栏的扩展（Extensions）图标，或者按 `Ctrl+Shift+X` 打开扩展面板。
3. 在扩展面板的右上角，点击 **...** 按钮，选择 **Install from VSIX...**。
4. 选择你刚刚打包的 `.vsix` 文件进行安装。

完成安装后，插件就会自动启用，你可以开始享受自动补全和悬停文档的功能了。

---

## 🛠️ 开发与调试

在插件开发过程中，你可以通过以下步骤进行调试：

1. 在 VSCode 中打开插件项目。
2. 按 `F5` 运行插件，VSCode 会自动启动一个新的窗口来加载并调试插件。
3. 在 `View -> Output -> Extension Host` 查看调试日志，检查插件是否正确加载。

