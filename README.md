# zlui-ts-fgui

## Summary

This is a TypeScript application for rendering FairyGUI-based user interfaces using ImGui as the rendering backend with zlui-ts.

this project is under construction.

## src/ Overview

The `src/` directory contains the main TypeScript application code:

- **index.ts** - Entry point with main loop logic, frame timing, and ImGui setup. Contains commented-out legacy code.
- **app.ts** - Core `App` class that:

  - Initializes FGUI (FairyGUI) with BlueSkin UI package
  - Manages UI rendering through UIMgr
  - Handles main loop updates and input (mouse, pointer, wheel)
  - Manages window resize events
  - Provides an ImGui inspector panel
- **zlUI/fgui/fgui.ts** - FGUI package loader and UI factory (loads `.fui` files from the `res/` folder)

