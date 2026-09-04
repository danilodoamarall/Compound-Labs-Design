---
name: vueuse-functions
description: Apply VueUse composables where appropriate to build concise, maintainable Vue.js / Nuxt features.
license: MIT
metadata:
    author: SerKo <https://github.com/serkodev>
    version: "1.0"
compatibility: Requires Vue 3 (or above) or Nuxt 3 (or above) project
---

<!--
  Origem:  https://github.com/antfu/skills/blob/main/skills/vueuse-functions/SKILL.md
  Autor:   antfu
  Licença: MIT
  Commit:  a74f281a27dadc02397bc1a174b0f2c97531b6ae
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# VueUse Functions

This skill is a decision-and-implementation guide for VueUse composables in Vue.js / Nuxt projects. It maps requirements to the most suitable VueUse function, applies the correct usage pattern, and prefers composable-based solutions over bespoke code to keep implementations concise, maintainable, and performant.

## When to Apply

- Apply this skill whenever assisting user development work in Vue.js / Nuxt.
- Always check first whether a VueUse function can implement the requirement.
- Prefer VueUse composables over custom code to improve readability, maintainability, and performance.
- Map requirements to the most appropriate VueUse function and follow the function’s invocation rule.
- Please refer to the `Invocation` field in the below functions table. For example:
  - `AUTO`: Use automatically when applicable.
  - `EXTERNAL`: Use only if the user already installed the required external dependency; otherwise reconsider, and ask to install only if truly needed.
  - `EXPLICIT_ONLY`: Use only when explicitly requested by the user.
  > *NOTE* User instructions in the prompt or `AGENTS.md` may override a function’s default `Invocation` rule.

## Functions

All functions listed below are part of the [VueUse](https://vueuse.org/) library, each section categorizes functions based on their functionality.

IMPORTANT: Each function entry includes a short `Description` and a detailed `Reference`. When using any function, always consult the corresponding document in `./references` for Usage details and Type Declarations.

### State

| Function | Description | Invocation |
|----------|-------------|------------|
| [`createGlobalState`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createGlobalState.md) | Keep states in the global scope to be reusable across Vue instances | AUTO |
| [`createInjectionState`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createInjectionState.md) | Create global state that can be injected into components | AUTO |
| [`createSharedComposable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createSharedComposable.md) | Make a composable function usable with multiple Vue instances | AUTO |
| [`injectLocal`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/injectLocal.md) | Extended `inject` with ability to call `provideLocal` to provide the value in the same component | AUTO |
| [`provideLocal`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/provideLocal.md) | Extended `provide` with ability to call `injectLocal` to obtain the value in the same component | AUTO |
| [`useAsyncState`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAsyncState.md) | Reactive async state | AUTO |
| [`useDebouncedRefHistory`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDebouncedRefHistory.md) | Shorthand for `useRefHistory` with debounced filter | AUTO |
| [`useLastChanged`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useLastChanged.md) | Records the timestamp of the last change | AUTO |
| [`useLocalStorage`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useLocalStorage.md) | Reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | AUTO |
| [`useManualRefHistory`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useManualRefHistory.md) | Manually track the change history of a ref when the user calls `commit()` | AUTO |
| [`useRefHistory`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRefHistory.md) | Track the change history of a ref | AUTO |
| [`useSessionStorage`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSessionStorage.md) | Reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) | AUTO |
| [`useStorage`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useStorage.md) | Create a reactive ref that can be used to access & modify [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) | AUTO |
| [`useStorageAsync`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useStorageAsync.md) | Reactive Storage with async support | AUTO |
| [`useThrottledRefHistory`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useThrottledRefHistory.md) | Shorthand for `useRefHistory` with throttled filter | AUTO |

### Elements

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useActiveElement`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useActiveElement.md) | Reactive `document.activeElement` | AUTO |
| [`useDocumentVisibility`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDocumentVisibility.md) | Reactively track [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState) | AUTO |
| [`useDraggable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDraggable.md) | Make elements draggable | AUTO |
| [`useDropZone`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDropZone.md) | Create a zone where files can be dropped | AUTO |
| [`useElementBounding`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useElementBounding.md) | Reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element | AUTO |
| [`useElementSize`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useElementSize.md) | Reactive size of an HTML element | AUTO |
| [`useElementVisibility`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useElementVisibility.md) | Tracks the visibility of an element within the viewport | AUTO |
| [`useIntersectionObserver`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIntersectionObserver.md) | Detects changes to a target element's visibility | AUTO |
| [`useMouseInElement`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMouseInElement.md) | Reactive mouse position related to an element | AUTO |
| [`useMutationObserver`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMutationObserver.md) | Watch for changes being made to the DOM tree | AUTO |
| [`useParentElement`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useParentElement.md) | Get parent element of the given element | AUTO |
| [`useResizeObserver`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useResizeObserver.md) | Reports changes to the dimensions of an Element's content or the border-box | AUTO |
| [`useWindowFocus`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWindowFocus.md) | Reactively track window focus with `window.onfocus` and `window.onblur` events | AUTO |
| [`useWindowScroll`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWindowScroll.md) | Reactive window scroll | AUTO |
| [`useWindowSize`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWindowSize.md) | Reactive window size | AUTO |

### Browser

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useBluetooth`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useBluetooth.md) | Reactive [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) | AUTO |
| [`useBreakpoints`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useBreakpoints.md) | Reactive viewport breakpoints | AUTO |
| [`useBroadcastChannel`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useBroadcastChannel.md) | Reactive [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) | AUTO |
| [`useBrowserLocation`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useBrowserLocation.md) | Reactive browser location | AUTO |
| [`useClipboard`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useClipboard.md) | Reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) | AUTO |
| [`useClipboardItems`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useClipboardItems.md) | Reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) | AUTO |
| [`useColorMode`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useColorMode.md) | Reactive color mode (dark / light / customs) with auto data persistence | AUTO |
| [`useCssSupports`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCssSupports.md) | SSR compatible and reactive [`CSS.supports`](https://developer.mozilla.org/docs/Web/API/CSS/supports_static) | AUTO |
| [`useCssVar`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCssVar.md) | Manipulate CSS variables | AUTO |
| [`useDark`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDark.md) | Reactive dark mode with auto data persistence | AUTO |
| [`useEventListener`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useEventListener.md) | Use EventListener with ease | AUTO |
| [`useEyeDropper`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useEyeDropper.md) | Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API) | AUTO |
| [`useFavicon`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFavicon.md) | Reactive favicon | AUTO |
| [`useFileDialog`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFileDialog.md) | Open file dialog with ease | AUTO |
| [`useFileSystemAccess`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFileSystemAccess.md) | Create and read and write local files with [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) | AUTO |
| [`useFullscreen`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFullscreen.md) | Reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) | AUTO |
| [`useGamepad`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useGamepad.md) | Provides reactive bindings for the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) | AUTO |
| [`useImage`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useImage.md) | Reactive load an image in the browser | AUTO |
| [`useMediaControls`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMediaControls.md) | Reactive media controls for both `audio` and `video` elements | AUTO |
| [`useMediaQuery`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMediaQuery.md) | Reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries) | AUTO |
| [`useMemory`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMemory.md) | Reactive Memory Info | AUTO |
| [`useObjectUrl`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useObjectUrl.md) | Reactive URL representing an object | AUTO |
| [`usePerformanceObserver`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePerformanceObserver.md) | Observe performance metrics | AUTO |
| [`usePermission`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePermission.md) | Reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) | AUTO |
| [`usePreferredColorScheme`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePreferredColorScheme.md) | Reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query | AUTO |
| [`usePreferredContrast`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePreferredContrast.md) | Reactive [prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) media query | AUTO |
| [`usePreferredDark`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePreferredDark.md) | Reactive dark theme preference | AUTO |
| [`usePreferredLanguages`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePreferredLanguages.md) | Reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages) | AUTO |
| [`usePreferredReducedMotion`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePreferredReducedMotion.md) | Reactive [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media query | AUTO |
| [`usePreferredReducedTransparency`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePreferredReducedTransparency.md) | Reactive [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency) media query | AUTO |
| [`useScreenOrientation`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useScreenOrientation.md) | Reactive [Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API) | AUTO |
| [`useScreenSafeArea`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useScreenSafeArea.md) | Reactive `env(safe-area-inset-*)` | AUTO |
| [`useScriptTag`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useScriptTag.md) | Creates a script tag | AUTO |
| [`useShare`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useShare.md) | Reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) | AUTO |
| [`useSSRWidth`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSSRWidth.md) | Used to set a global viewport width which will be used when rendering SSR components that rely on the viewport width like [`useMediaQuery`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/useMediaQuery/index.md) or [`useBreakpoints`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/useBreakpoints/index.md) | AUTO |
| [`useStyleTag`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useStyleTag.md) | Inject reactive `style` element in head | AUTO |
| [`useTextareaAutosize`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTextareaAutosize.md) | Automatically update the height of a textarea depending on the content | AUTO |
| [`useTextDirection`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTextDirection.md) | Reactive [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) of the element's text | AUTO |
| [`useTitle`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTitle.md) | Reactive document title | AUTO |
| [`useUrlSearchParams`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useUrlSearchParams.md) | Reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | AUTO |
| [`useVibrate`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useVibrate.md) | Reactive [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) | AUTO |
| [`useWakeLock`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWakeLock.md) | Reactive [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) | AUTO |
| [`useWebNotification`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWebNotification.md) | Reactive [Notification](https://developer.mozilla.org/en-US/docs/Web/API/notification) | AUTO |
| [`useWebWorker`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWebWorker.md) | Simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication | AUTO |
| [`useWebWorkerFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWebWorkerFn.md) | Run expensive functions without blocking the UI | AUTO |

### Sensors

| Function | Description | Invocation |
|----------|-------------|------------|
| [`onClickOutside`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/onClickOutside.md) | Listen for clicks outside of an element | AUTO |
| [`onElementRemoval`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/onElementRemoval.md) | Fires when the element or any element containing it is removed from the DOM | AUTO |
| [`onKeyStroke`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/onKeyStroke.md) | Listen for keyboard keystrokes | AUTO |
| [`onLongPress`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/onLongPress.md) | Listen for a long press on an element | AUTO |
| [`onStartTyping`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/onStartTyping.md) | Fires when users start typing on non-editable elements | AUTO |
| [`useBattery`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useBattery.md) | Reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API) | AUTO |
| [`useDeviceMotion`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDeviceMotion.md) | Reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) | AUTO |
| [`useDeviceOrientation`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDeviceOrientation.md) | Reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) | AUTO |
| [`useDevicePixelRatio`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDevicePixelRatio.md) | Reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/docs/Web/API/Window/devicePixelRatio) | AUTO |
| [`useDevicesList`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDevicesList.md) | Reactive [enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) listing available input/output devices | AUTO |
| [`useDisplayMedia`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDisplayMedia.md) | Reactive [`mediaDevices.getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) streaming | AUTO |
| [`useElementByPoint`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useElementByPoint.md) | Reactive element by point | AUTO |
| [`useElementHover`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useElementHover.md) | Reactive element's hover state | AUTO |
| [`useFocus`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFocus.md) | Reactive utility to track or set the focus state of a DOM element | AUTO |
| [`useFocusWithin`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFocusWithin.md) | Reactive utility to track if an element or one of its descendants has focus | AUTO |
| [`useFps`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFps.md) | Reactive FPS (frames per second) | AUTO |
| [`useGeolocation`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useGeolocation.md) | Reactive [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) | AUTO |
| [`useIdle`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIdle.md) | Tracks whether the user is being inactive | AUTO |
| [`useInfiniteScroll`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useInfiniteScroll.md) | Infinite scrolling of the element | AUTO |
| [`useKeyModifier`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useKeyModifier.md) | Reactive [Modifier State](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState) | AUTO |
| [`useMagicKeys`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMagicKeys.md) | Reactive keys pressed state | AUTO |
| [`useMouse`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMouse.md) | Reactive mouse position | AUTO |
| [`useMousePressed`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMousePressed.md) | Reactive mouse pressing state | AUTO |
| [`useNavigatorLanguage`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useNavigatorLanguage.md) | Reactive [navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language) | AUTO |
| [`useNetwork`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useNetwork.md) | Reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) | AUTO |
| [`useOnline`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useOnline.md) | Reactive online state | AUTO |
| [`usePageLeave`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePageLeave.md) | Reactive state to show whether the mouse leaves the page | AUTO |
| [`useParallax`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useParallax.md) | Create parallax effect easily | AUTO |
| [`usePointer`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePointer.md) | Reactive [pointer state](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) | AUTO |
| [`usePointerLock`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePointerLock.md) | Reactive [pointer lock](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API) | AUTO |
| [`usePointerSwipe`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePointerSwipe.md) | Reactive swipe detection based on [PointerEvents](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) | AUTO |
| [`useScroll`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useScroll.md) | Reactive scroll position and state | AUTO |
| [`useScrollLock`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useScrollLock.md) | Lock scrolling of the element | AUTO |
| [`useSpeechRecognition`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSpeechRecognition.md) | Reactive [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) | AUTO |
| [`useSpeechSynthesis`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSpeechSynthesis.md) | Reactive [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) | AUTO |
| [`useSwipe`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSwipe.md) | Reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) | AUTO |
| [`useTextSelection`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTextSelection.md) | Reactively track user text selection based on [`Window.getSelection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection) | AUTO |
| [`useUserMedia`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useUserMedia.md) | Reactive [`mediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) streaming | AUTO |

### Network

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useEventSource`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useEventSource.md) | An [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server | AUTO |
| [`useFetch`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFetch.md) | Reactive [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) provides the ability to abort requests | AUTO |
| [`useWebSocket`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useWebSocket.md) | Reactive [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client | AUTO |

### Animation

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useAnimate`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAnimate.md) | Reactive [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) | AUTO |
| [`useInterval`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useInterval.md) | Reactive counter that increases on every interval | AUTO |
| [`useIntervalFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIntervalFn.md) | Wrapper for `setInterval` with controls | AUTO |
| [`useNow`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useNow.md) | Reactive current Date instance | AUTO |
| [`useRafFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRafFn.md) | Call function on every `requestAnimationFrame` | AUTO |
| [`useTimeout`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTimeout.md) | Reactive value that becomes `true` after a given time | AUTO |
| [`useTimeoutFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTimeoutFn.md) | Wrapper for `setTimeout` with controls | AUTO |
| [`useTimestamp`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTimestamp.md) | Reactive current timestamp | AUTO |
| [`useTransition`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTransition.md) | Transition between values | AUTO |

### Component

| Function | Description | Invocation |
|----------|-------------|------------|
| [`computedInject`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/computedInject.md) | Combine `computed` and `inject` | AUTO |
| [`createReusableTemplate`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createReusableTemplate.md) | Define and reuse template inside the component scope | AUTO |
| [`createTemplatePromise`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createTemplatePromise.md) | Template as Promise | AUTO |
| [`templateRef`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/templateRef.md) | Shorthand for binding ref to template element | AUTO |
| [`tryOnBeforeMount`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/tryOnBeforeMount.md) | Safe `onBeforeMount` | AUTO |
| [`tryOnBeforeUnmount`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/tryOnBeforeUnmount.md) | Safe `onBeforeUnmount` | AUTO |
| [`tryOnMounted`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/tryOnMounted.md) | Safe `onMounted` | AUTO |
| [`tryOnScopeDispose`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/tryOnScopeDispose.md) | Safe `onScopeDispose` | AUTO |
| [`tryOnUnmounted`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/tryOnUnmounted.md) | Safe `onUnmounted` | AUTO |
| [`unrefElement`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/unrefElement.md) | Retrieves the underlying DOM element from a Vue ref or component instance | AUTO |
| [`useCurrentElement`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCurrentElement.md) | Get the DOM element of current component as a ref | AUTO |
| [`useMounted`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMounted.md) | Mounted state in ref | AUTO |
| [`useTemplateRefsList`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTemplateRefsList.md) | Shorthand for binding refs to template elements and components inside `v-for` | AUTO |
| [`useVirtualList`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useVirtualList.md) | Create virtual lists with ease | AUTO |
| [`useVModel`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useVModel.md) | Shorthand for v-model binding | AUTO |
| [`useVModels`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useVModels.md) | Shorthand for props v-model binding | AUTO |

### Watch

| Function | Description | Invocation |
|----------|-------------|------------|
| [`until`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/until.md) | Promised one-time watch for changes | AUTO |
| [`watchArray`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchArray.md) | Watch for an array with additions and removals | AUTO |
| [`watchAtMost`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchAtMost.md) | `watch` with the number of times triggered | AUTO |
| [`watchDebounced`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchDebounced.md) | Debounced watch | AUTO |
| [`watchDeep`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchDeep.md) | Shorthand for watching value with `{deep: true}` | AUTO |
| [`watchIgnorable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchIgnorable.md) | Ignorable watch | AUTO |
| [`watchImmediate`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchImmediate.md) | Shorthand for watching value with `{immediate: true}` | AUTO |
| [`watchOnce`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchOnce.md) | Shorthand for watching value with `{ once: true }` | AUTO |
| [`watchPausable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchPausable.md) | Pausable watch | AUTO |
| [`watchThrottled`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchThrottled.md) | Throttled watch | AUTO |
| [`watchTriggerable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchTriggerable.md) | Watch that can be triggered manually | AUTO |
| [`watchWithFilter`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchWithFilter.md) | `watch` with additional EventFilter control | AUTO |
| [`whenever`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/whenever.md) | Shorthand for watching value to be truthy | AUTO |

### Reactivity

| Function | Description | Invocation |
|----------|-------------|------------|
| [`computedAsync`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/computedAsync.md) | Computed for async functions | AUTO |
| [`computedEager`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/computedEager.md) | Eager computed without lazy evaluation | AUTO |
| [`computedWithControl`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/computedWithControl.md) | Explicitly define the dependencies of computed | AUTO |
| [`createRef`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createRef.md) | Returns a `deepRef` or `shallowRef` depending on the `deep` param | AUTO |
| [`extendRef`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/extendRef.md) | Add extra attributes to Ref | AUTO |
| [`reactify`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/reactify.md) | Converts plain functions into reactive functions | AUTO |
| [`reactifyObject`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/reactifyObject.md) | Apply `reactify` to an object | AUTO |
| [`reactiveComputed`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/reactiveComputed.md) | Computed reactive object | AUTO |
| [`reactiveOmit`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/reactiveOmit.md) | Reactively omit fields from a reactive object | AUTO |
| [`reactivePick`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/reactivePick.md) | Reactively pick fields from a reactive object | AUTO |
| [`refAutoReset`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/refAutoReset.md) | A ref which will be reset to the default value after some time | AUTO |
| [`refDebounced`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/refDebounced.md) | Debounce execution of a ref value | AUTO |
| [`refDefault`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/refDefault.md) | Apply default value to a ref | AUTO |
| [`refManualReset`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/refManualReset.md) | Create a ref with manual reset functionality | AUTO |
| [`refThrottled`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/refThrottled.md) | Throttle changing of a ref value | AUTO |
| [`refWithControl`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/refWithControl.md) | Fine-grained controls over ref and its reactivity | AUTO |
| [`syncRef`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/syncRef.md) | Two-way refs synchronization | AUTO |
| [`syncRefs`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/syncRefs.md) | Keep target refs in sync with a source ref | AUTO |
| [`toReactive`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/toReactive.md) | Converts ref to reactive | AUTO |
| [`toRef`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/toRef.md) | Normalize value/ref/getter to `ref` or `computed` | EXPLICIT_ONLY |
| [`toRefs`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/toRefs.md) | Extended [`toRefs`](https://vuejs.org/api/reactivity-utilities.html#torefs) that also accepts refs of an object | AUTO |

### Array

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useArrayDifference`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayDifference.md) | Reactive get array difference of two arrays | AUTO |
| [`useArrayEvery`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayEvery.md) | Reactive `Array.every` | AUTO |
| [`useArrayFilter`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayFilter.md) | Reactive `Array.filter` | AUTO |
| [`useArrayFind`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayFind.md) | Reactive `Array.find` | AUTO |
| [`useArrayFindIndex`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayFindIndex.md) | Reactive `Array.findIndex` | AUTO |
| [`useArrayFindLast`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayFindLast.md) | Reactive `Array.findLast` | AUTO |
| [`useArrayIncludes`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayIncludes.md) | Reactive `Array.includes` | AUTO |
| [`useArrayJoin`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayJoin.md) | Reactive `Array.join` | AUTO |
| [`useArrayMap`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayMap.md) | Reactive `Array.map` | AUTO |
| [`useArrayReduce`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayReduce.md) | Reactive `Array.reduce` | AUTO |
| [`useArraySome`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArraySome.md) | Reactive `Array.some` | AUTO |
| [`useArrayUnique`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useArrayUnique.md) | Reactive unique array | AUTO |
| [`useSorted`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSorted.md) | Reactive sort array | AUTO |

### Time

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useCountdown`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCountdown.md) | Reactive countdown timer in seconds | AUTO |
| [`useDateFormat`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDateFormat.md) | Get the formatted date according to the string of tokens passed in | AUTO |
| [`useTimeAgo`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTimeAgo.md) | Reactive time ago | AUTO |
| [`useTimeAgoIntl`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTimeAgoIntl.md) | Reactive time ago with i18n supported | AUTO |

### Utilities

| Function | Description | Invocation |
|----------|-------------|------------|
| [`createDisposableDirective`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createDisposableDirective.md) | Utility for authoring disposable directives | AUTO |
| [`createEventHook`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createEventHook.md) | Utility for creating event hooks | AUTO |
| [`createUnrefFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createUnrefFn.md) | Make a plain function accepting ref and raw values as arguments | AUTO |
| [`get`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/get.md) | Shorthand for accessing `ref.value` | EXPLICIT_ONLY |
| [`isDefined`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/isDefined.md) | Non-nullish checking type guard for Ref | AUTO |
| [`makeDestructurable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/makeDestructurable.md) | Make isomorphic destructurable for object and array at the same time | AUTO |
| [`set`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/set.md) | Shorthand for `ref.value = x` | EXPLICIT_ONLY |
| [`useAsyncQueue`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAsyncQueue.md) | Executes each asynchronous task sequentially and passes the current task result to the next task | AUTO |
| [`useBase64`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useBase64.md) | Reactive base64 transforming | AUTO |
| [`useCached`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCached.md) | Cache a ref with a custom comparator | AUTO |
| [`useCloned`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCloned.md) | Reactive clone of a ref | AUTO |
| [`useConfirmDialog`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useConfirmDialog.md) | Creates event hooks to support modals and confirmation dialog chains | AUTO |
| [`useCounter`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCounter.md) | Basic counter with utility functions | AUTO |
| [`useCycleList`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCycleList.md) | Cycle through a list of items | AUTO |
| [`useDebounceFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDebounceFn.md) | Debounce execution of a function | AUTO |
| [`useEventBus`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useEventBus.md) | A basic event bus | AUTO |
| [`useMemoize`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMemoize.md) | Cache results of functions depending on arguments and keep it reactive | AUTO |
| [`useOffsetPagination`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useOffsetPagination.md) | Reactive offset pagination | AUTO |
| [`usePrevious`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePrevious.md) | Holds the previous value of a ref | AUTO |
| [`useStepper`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useStepper.md) | Provides helpers for building a multi-step wizard interface | AUTO |
| [`useSupported`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSupported.md) | SSR compatibility `isSupported` | AUTO |
| [`useThrottleFn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useThrottleFn.md) | Throttle execution of a function | AUTO |
| [`useTimeoutPoll`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTimeoutPoll.md) | Use timeout to poll something | AUTO |
| [`useToggle`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useToggle.md) | A boolean switcher with utility functions | AUTO |
| [`useToNumber`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useToNumber.md) | Reactively convert a string ref to number | AUTO |
| [`useToString`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useToString.md) | Reactively convert a ref to string | AUTO |

### @Electron

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useIpcRenderer`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIpcRenderer.md) | Provides [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) and all of its APIs with Vue reactivity | EXTERNAL |
| [`useIpcRendererInvoke`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIpcRendererInvoke.md) | Reactive [ipcRenderer.invoke API](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args) result | EXTERNAL |
| [`useIpcRendererOn`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIpcRendererOn.md) | Use [ipcRenderer.on](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener) with ease and [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted | EXTERNAL |
| [`useZoomFactor`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useZoomFactor.md) | Reactive [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) zoom factor | EXTERNAL |
| [`useZoomLevel`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useZoomLevel.md) | Reactive [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) zoom level | EXTERNAL |

### @Firebase

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useAuth`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAuth.md) | Reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding | EXTERNAL |
| [`useFirestore`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFirestore.md) | Reactive [Firestore](https://firebase.google.com/docs/firestore) binding | EXTERNAL |
| [`useRTDB`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRTDB.md) | Reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding | EXTERNAL |

### @Head

| Function | Description | Invocation |
|----------|-------------|------------|
| [`createHead`](https://github.com/vueuse/head#api) | Create the head manager instance. | EXTERNAL |
| [`useHead`](https://github.com/vueuse/head#api) | Update head meta tags reactively. | EXTERNAL |

### @Integrations

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useAsyncValidator`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAsyncValidator.md) | Wrapper for [`async-validator`](https://github.com/yiminghe/async-validator) | EXTERNAL |
| [`useAxios`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAxios.md) | Wrapper for [`axios`](https://github.com/axios/axios) | EXTERNAL |
| [`useChangeCase`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useChangeCase.md) | Reactive wrapper for [`change-case`](https://github.com/blakeembrey/change-case) | EXTERNAL |
| [`useCookies`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCookies.md) | Wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie) | EXTERNAL |
| [`useDrauu`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useDrauu.md) | Reactive instance for [drauu](https://github.com/antfu/drauu) | EXTERNAL |
| [`useFocusTrap`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFocusTrap.md) | Reactive wrapper for [`focus-trap`](https://github.com/focus-trap/focus-trap) | EXTERNAL |
| [`useFuse`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFuse.md) | Easily implement fuzzy search using a composable with [Fuse.js](https://github.com/krisk/fuse) | EXTERNAL |
| [`useIDBKeyval`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useIDBKeyval.md) | Wrapper for [`idb-keyval`](https://www.npmjs.com/package/idb-keyval) | EXTERNAL |
| [`useJwt`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useJwt.md) | Wrapper for [`jwt-decode`](https://github.com/auth0/jwt-decode) | EXTERNAL |
| [`useNProgress`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useNProgress.md) | Reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress) | EXTERNAL |
| [`useQRCode`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useQRCode.md) | Wrapper for [`qrcode`](https://github.com/soldair/node-qrcode) | EXTERNAL |
| [`useSortable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSortable.md) | Wrapper for [`sortable`](https://github.com/SortableJS/Sortable) | EXTERNAL |

### @Math

| Function | Description | Invocation |
|----------|-------------|------------|
| [`createGenericProjection`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createGenericProjection.md) | Generic version of `createProjection` | EXTERNAL |
| [`createProjection`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/createProjection.md) | Reactive numeric projection from one domain to another | EXTERNAL |
| [`logicAnd`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/logicAnd.md) | `AND` condition for refs | EXTERNAL |
| [`logicNot`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/logicNot.md) | `NOT` condition for ref | EXTERNAL |
| [`logicOr`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/logicOr.md) | `OR` conditions for refs | EXTERNAL |
| [`useAbs`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAbs.md) | Reactive `Math.abs` | EXTERNAL |
| [`useAverage`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useAverage.md) | Get the average of an array reactively | EXTERNAL |
| [`useCeil`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useCeil.md) | Reactive `Math.ceil` | EXTERNAL |
| [`useClamp`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useClamp.md) | Reactively clamp a value between two other values | EXTERNAL |
| [`useFloor`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useFloor.md) | Reactive `Math.floor` | EXTERNAL |
| [`useMath`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMath.md) | Reactive `Math` methods | EXTERNAL |
| [`useMax`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMax.md) | Reactive `Math.max` | EXTERNAL |
| [`useMin`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useMin.md) | Reactive `Math.min` | EXTERNAL |
| [`usePrecision`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/usePrecision.md) | Reactively set the precision of a number | EXTERNAL |
| [`useProjection`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useProjection.md) | Reactive numeric projection from one domain to another | EXTERNAL |
| [`useRound`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRound.md) | Reactive `Math.round` | EXTERNAL |
| [`useSum`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSum.md) | Get the sum of an array reactively | EXTERNAL |
| [`useTrunc`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useTrunc.md) | Reactive `Math.trunc` | EXTERNAL |

### @Motion

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useElementStyle`](https://motion.vueuse.org/api/use-element-style) | Sync a reactive object to a target element CSS styling | EXTERNAL |
| [`useElementTransform`](https://motion.vueuse.org/api/use-element-transform) | Sync a reactive object to a target element CSS transform. | EXTERNAL |
| [`useMotion`](https://motion.vueuse.org/api/use-motion) | Putting your components in motion. | EXTERNAL |
| [`useMotionProperties`](https://motion.vueuse.org/api/use-motion-properties) | Access Motion Properties for a target element. | EXTERNAL |
| [`useMotionVariants`](https://motion.vueuse.org/api/use-motion-variants) | Handle the Variants state and selection. | EXTERNAL |
| [`useSpring`](https://motion.vueuse.org/api/use-spring) | Spring animations. | EXTERNAL |

### @Router

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useRouteHash`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRouteHash.md) | Shorthand for a reactive `route.hash` | EXTERNAL |
| [`useRouteParams`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRouteParams.md) | Shorthand for a reactive `route.params` | EXTERNAL |
| [`useRouteQuery`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useRouteQuery.md) | Shorthand for a reactive `route.query` | EXTERNAL |

### @RxJS

| Function | Description | Invocation |
|----------|-------------|------------|
| [`from`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/from.md) | Wrappers around RxJS's [`from()`](https://rxjs.dev/api/index/function/from) and [`fromEvent()`](https://rxjs.dev/api/index/function/fromEvent) to allow them to accept `ref`s | EXTERNAL |
| [`toObserver`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/toObserver.md) | Sugar function to convert a `ref` into an RxJS [Observer](https://rxjs.dev/guide/observer) | EXTERNAL |
| [`useExtractedObservable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useExtractedObservable.md) | Use an RxJS [`Observable`](https://rxjs.dev/guide/observable) as extracted from one or more composables | EXTERNAL |
| [`useObservable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useObservable.md) | Use an RxJS [`Observable`](https://rxjs.dev/guide/observable) | EXTERNAL |
| [`useSubject`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSubject.md) | Bind an RxJS [`Subject`](https://rxjs.dev/guide/subject) to a `ref` and propagate value changes both ways | EXTERNAL |
| [`useSubscription`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/useSubscription.md) | Use an RxJS [`Subscription`](https://rxjs.dev/guide/subscription) without worrying about unsubscribing from it or creating memory leaks | EXTERNAL |
| [`watchExtractedObservable`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions/references/watchExtractedObservable.md) | Watch the values of an RxJS [`Observable`](https://rxjs.dev/guide/observable) as extracted from one or more composables | EXTERNAL |

### @SchemaOrg

| Function | Description | Invocation |
|----------|-------------|------------|
| [`createSchemaOrg`](https://vue-schema-org.netlify.app/api/core/create-schema-org.html) | Create the schema.org manager instance. | EXTERNAL |
| [`useSchemaOrg`](https://vue-schema-org.netlify.app/api/core/use-schema-org.html) | Update schema.org reactively. | EXTERNAL |

### @Sound

| Function | Description | Invocation |
|----------|-------------|------------|
| [`useSound`](https://github.com/vueuse/sound#examples) | Play sound effects reactively. | EXTERNAL |


