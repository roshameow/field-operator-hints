# Brain DataField & Operator IntelliSense

A lightweight VSCode extension that provides **hover documentation** and **autocomplete** for custom **data fields** and **operators**, based on your own CSV documentation.

Perfect for domain-specific languages, financial modeling DSLs, or internal operator libraries.

---

## ✨ Features

✅ **Hover Documentation**  
Get instant descriptions of your data fields and operators when hovering over them in the code.

✅ **Autocomplete Suggestions**  
Start typing an operator or field name and get intelligent, context-aware completions.

✅ **CSV-Based Documentation**  
Powered by one or more `.csv` files describing your internal field/operator docs. Easy to maintain and extend.

---

## 📁 Example CSV Format

Place your operator definitions in a CSV file like `operatorDocs.csv` in the `src/` directory:

```csv
name,category,signature,syntax,description
pasteurize,Arithmetic,"['COMBO', 'REGULAR']",pasteurize(x),Set to NaN if x is INF or not in Alpha universe. Helps reduce outliers.
