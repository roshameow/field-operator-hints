# Code Structure (For Developers)

This document provides a high-level overview of the codebase structure for developers contributing to this extension.

## Overview

The extension is architected to be modular and extensible. The core logic is divided into three main responsibilities:
1.  **Loading Data**: Reading and parsing data from JSON files.
2.  **Providing IntelliSense**: Registering and implementing VS Code's language features like auto-completion and hover information.
3.  **Activation**: Tying everything together in the main extension entry point.

## Directory Breakdown

-   `extension.ts`
    -   This is the **main entry point** for the extension.
    -   The `activate()` function is responsible for initializing the extension. It creates an `OutputChannel` for logging, loads all necessary data by calling the modules in `loaders/`, and registers all feature providers from `providers/`.
    -   The `deactivate()` function handles cleanup when the extension is disabled.

-   `loaders/`
    -   This directory contains modules responsible for **loading and parsing data** from JSON files.
    -   Each file corresponds to a specific data source (e.g., `operators.ts`, `saFields.ts`).
    -   They handle finding the correct JSON file (either the default one in `assets/` or a custom path from user settings), reading it, parsing it, and returning it in a structured format.

-   `providers/`
    -   This directory contains the implementations for VS Code's **language features (IntelliSense)**.
    -   Each file is a "provider" for a specific feature set. For example, `saFieldProvider.ts` implements the auto-completion and hover logic for SA Fields.
    -   These providers receive the data loaded by the `loaders/` and use it to generate `CompletionItem` or `Hover` objects based on the user's input in the editor.

-   `types/`
    -   Contains shared TypeScript type definitions and interfaces used across the project to ensure data consistency.

-   `test/`
    -   Contains unit and integration tests for the extension.

## Data Flow

The typical data flow on activation is as follows:

1.  `extension.ts:activate()` is called by VS Code.
2.  It calls functions from `loaders/` (e.g., `loadSaFields()`).
3.  The loader function finds the relevant JSON file, reads it, and returns the parsed data (e.g., a `Record<string, string[]>`).
4.  `extension.ts` then calls a registration function from `providers/` (e.g., `registerSaFieldProvider()`), passing the loaded data to it.
5.  The provider function creates and registers one or more language feature providers (e.g., `registerCompletionItemProvider`) with VS Code, using the data to respond to user actions.
