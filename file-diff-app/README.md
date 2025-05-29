# File Diff Tauri App

## Description

A simple Tauri-based desktop application that allows you to compare two text files side-by-side and view their differences. Lines that are added, removed, or common are highlighted.

This application uses a static HTML/CSS/JS frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Rust and Cargo:** Required for building the Tauri backend. Installation instructions can be found at [rust-lang.org](https://www.rust-lang.org/tools/install).
*   **Node.js and npm:** While the application's frontend is static HTML, Tauri's internal tooling or specific cargo commands might have dependencies or utilize Node.js/npm for certain operations. It's recommended to have them installed. You can get them from [nodejs.org](https://nodejs.org/).
*   **System Dependencies (Linux):**
    *   `libwebkit2gtk-4.1-dev` (or `webkit2gtk-4.1` depending on your package manager)
    *   `librsvg2-dev`
    *   `build-essential` (or equivalent group for C/C++ compilers)
    *   You can typically install these using `apt-get` on Debian/Ubuntu based systems:
        ```bash
        sudo apt-get update
        sudo apt-get install libwebkit2gtk-4.1-dev librsvg2-dev build-essential
        ```

## Building the Application

1.  **Navigate to the project directory:**
    ```bash
    cd file-diff-app
    ```
2.  **Build the Rust backend and fetch dependencies:**
    This step compiles the Rust code and ensures all dependencies are correctly fetched and built.
    ```bash
    cargo build
    ```
3.  **Build the Tauri application:**
    This command bundles the frontend and backend into a distributable application.
    ```bash
    /home/jules/.cargo/bin/cargo-tauri build 
    ```
    *(Note: If `/home/jules/.cargo/bin` is in your PATH, you can just use `cargo tauri build`)*

## Running the Application

### Development Mode

To run the application in development mode with live reloading for the backend (frontend is static):

1.  **Navigate to the project directory:**
    ```bash
    cd file-diff-app
    ```
2.  **Run the development command:**
    *   **On Linux (especially in headless/CI environments or if you encounter GTK errors):**
        ```bash
        xvfb-run -a /home/jules/.cargo/bin/cargo-tauri dev
        ```
    *   **On systems with a graphical desktop environment (Linux, macOS, Windows):**
        ```bash
        /home/jules/.cargo/bin/cargo-tauri dev
        ```
        *(Note: If `/home/jules/.cargo/bin` is in your PATH, you can likely use `cargo tauri dev` directly).*

    The application window should open.

### Production Build

After building the application with `cargo tauri build` (see "Building the Application" section):

1.  **Locate the application:**
    *   The executable will typically be found in `file-diff-app/target/release/`. The exact name might be `file-diff-app` (or `file-diff-app.exe` on Windows).
    *   Installers or bundles (e.g., `.deb`, `.AppImage`, `.msi`, `.dmg`) will be in `file-diff-app/target/release/bundle/`.

2.  **Run the executable directly** from the `target/release/` directory or install and run using the appropriate bundle from `target/release/bundle/`.
