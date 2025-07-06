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

## 🔧 自定义 Operator JSON 文件支持

本插件默认使用内置的 `assets/operators_2025.json` 文件提供自动补全与悬浮提示功能。但你也可以通过 VS Code 设置项，指定自己的 JSON 文件路径。

### ✅ 配置方式

在你的 VS Code 设置中添加以下字段（可在全局或项目的 `.vscode/settings.json` 中配置）：

```jsonc
{
  "fieldOperatorHints.customOperatorJsonPath": "./my_operators.json"
}
```

### 📌 路径说明

* **相对路径**：以项目根目录为基准，例如 `./my_operators.json`
* **绝对路径**：支持 `/Users/xxx/path/to/operators.json` 这种形式

如果没有配置，插件将使用默认内置文件 `assets/operators_2025.json`。

---

## 📄 JSON 文件格式要求

你的自定义 JSON 文件应为数组格式，元素结构如下：

```json
[
  {
    "name": "add",
    "category": "Arithmetic",
    "definition": "add(x, y, filter=false), x + y",
    "description": "Add all inputs. If filter=true, NaN will be treated as 0."
  },
  ...
]
```


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

当然可以，下面是适合放入你插件项目 `README.md` 文件中的**中文使用说明**部分，专门介绍如何使用自定义 JSON 文件配置：

