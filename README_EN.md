# Brain DataField & Operator IntelliSense

[中文版](./README.md)

[![Version](https://img.shields.io/visual-studio-marketplace/v/Roshameow.field-operator-hints)](https://marketplace.visualstudio.com/items?itemName=Roshameow.field-operator-hints)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Roshameow.field-operator-hints)](https://marketplace.visualstudio.com/items?itemName=Roshameow.field-operator-hints)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/Roshameow.field-operator-hints)](https://marketplace.visualstudio.com/items?itemName=Roshameow.field-operator-hints)

![Demo](./images/demo.gif)

A lightweight VSCode extension that provides **hover documentation** and **autocompletion** for custom **data fields** and **operators**, based on your own JSON documents.

Perfect for Domain Specific Languages (DSL), financial modeling DSLs, or internal operator libraries.

---

## ✨ Features

✅ **Hover Documentation**  
Get immediate descriptions when hovering over custom data fields or operators in your code.

✅ **Autocompletion Suggestions**  
Smart, context-aware autocompletion for operators and field names as you type.

✅ **Region → Universe / Neutralization Linkage**  
Supports cascading hints for `region`, `universe`, and `neutralization` read from a configured `setting_snapshot.json`.

✅ **SA Fields Dynamic Completion**  
Trigger SA fields completion by typing `/`. For example, typing `/selection` will suggest options like `selection: turnover`, and selecting it will automatically insert `turnover`.

✅ **JSON-Based Documentation**  
Describe your internal fields/operators using one or more `.json` files for easy maintenance and expansion.

---

## 🔧 Custom Configuration

### ✅ Custom Operator JSON Path

The extension reads the built-in `assets/operators_2025.json` by default. You can specify your own JSON file path via VS Code settings:

```jsonc
{
  "fieldOperatorHints.customOperatorJsonPath": "./my_operators.json"
}
```

### ✅ Custom Region Setting JSON (setting_snapshot.json) Path

If you have your own `setting_snapshot.json` for Region → Universe/Neutralization enum configurations:

```jsonc
{
  "fieldOperatorHints.customRegionSettingJsonPath": "./my_setting_snapshot.json"
}
```

### ✅ Custom SA Fields JSON Path

The extension reads the built-in `assets/sa_fields.json` by default. You can provide your own:

```jsonc
{
  "fieldOperatorHints.customSaFieldsJsonPath": "./my_sa_fields.json"
}
```

### 📌 Path Notes

* **Relative Path**: Relative to the project root (recommended), e.g., `./my_operators.json`
* **Absolute Path**: Full system path, e.g., `/Users/yourname/project/operators.json`

---

## 📄 JSON File Format Requirements

### Operator JSON

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

### SA Fields JSON

A mapping of `GroupName -> Field List`:
```json
{
  "selection": [
    "turnover",
    "author_fitness"
  ],
  "combo": [
    "pnl",
    "alpha"
  ]
}
```

### Region Setting JSON (WorldQuant Brain Style)

Requires the following nested structure:

```jsonc
{
  "actions": {
    "POST": {
      "settings": {
        "children": {
          "region": {
            "choices": {
              "instrumentType": {
                "EQUITY": [ ... ]
              }
            }
          },
          "universe": {
            "choices": {
              "instrumentType": {
                "EQUITY": {
                  "region": {
                    "USA": [ ... ],
                    "GLB": [ ... ]
                  }
                }
              }
            }
          },
          "neutralization": {
            "choices": {
              "instrumentType": {
                "EQUITY": {
                  "region": {
                    "USA": [ ... ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

The extension automatically extracts available Regions and their corresponding Universe/Neutralization enums for intelligent hints in Python files.

---

## 💡 Usage Suggestions (Highly Recommended)

To enable autocompletion within strings (e.g., `"TOP1000"`, `'REVERSION_AND_MOMENTUM'`), please enable the following in your VS Code settings:

### ✅ Enable Quick Suggestions in Strings

Add this to your User Settings or project `.vscode/settings.json`:

```jsonc
{
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

---

## 💻 Recompiling VSIX Extension

Installing the `.vsix` extension is straightforward:

### 1. Package the Extension

If you have modified the extension and want to package it, use the following commands:

```bash
npm install -g vsce
npm run compile
vsce package
```

This will generate a `.vsix` file, typically `field-operator-hints-x.x.x.vsix`.

### 2. Install VSIX Extension

To install the `.vsix` file in VSCode:

1. Open VSCode.
2. Click the Extensions icon in the Activity Bar or press `Ctrl+Shift+X`.
3. Click the **...** button in the top right of the Extensions view and select **Install from VSIX...**.
4. Select your generated `.vsix` file.

Once installed, the extension will activate automatically.

---

## 🛠️ Development and Debugging

1. Open the project in VSCode.
2. Press `F5` to start a new Extension Development Host window.
3. Check logs in `View -> Output -> Extension Host`.

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/roshameow/field-operator-hints](https://github.com/roshameow/field-operator-hints)
- **Marketplace**: [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Roshameow.field-operator-hints)
