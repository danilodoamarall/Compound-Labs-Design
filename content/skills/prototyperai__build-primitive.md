<!--
  Origem:  https://github.com/PrototyperAI/prototyper-ui/blob/main/apps/docs/skill/build-primitive/SKILL.md
  Autor:   PrototyperAI
  Licença: MIT
  Commit:  eff1e06fa43a1fc3ba4e940b43b7ba0fa5b72339
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->---
name: build-primitive
description: >
  Guide for building foundational Prototyper UI components from scratch when no
  Base UI primitive exists. Use when creating components that need custom ARIA
  contracts, keyboard navigation, focus management, controlled/uncontrolled state,
  form integration, or animation lifecycle — all without an existing Base UI wrapper.
tools: [Read, Glob, Grep, Write, Edit, Bash]
---

# Prototyper UI — Building Primitive Components

How to build a 10/10 component from scratch when no Base UI primitive exists. ARIA contracts first, then keyboard navigation, then state management, then styling hooks, then form integration.

**When does this apply?** When you need a component that Base UI does not provide — Breadcrumb, Avatar, Badge, Card, Skeleton, Rating, Pagination, Stepper, Tag Input, File Upload, Calendar, Data Table, Carousel, Command Palette, Resizable Panels, Tree View, etc.

**Philosophy:** A primitive-quality component is invisible infrastructure. It handles every edge case so consumers never have to. Every interactive element must be keyboard-operable, every state must be announced to assistive technology, every animation must respect `prefers-reduced-motion`, and every form control must participate in native form submission.

---

## 1. Decision Gate

Before building from scratch, verify that no existing solution handles the hard parts.

```
Does a Base UI primitive exist for this component?
│
├── Yes → Use /create-component skill (wrap the primitive)
│
├── Partially (e.g., Collapsible exists but not Accordion)
│   └── Compose from existing primitives + custom logic
│       (Accordion = Collapsible + custom keyboard nav + ARIA)
│
└── No primitive exists
    │
    ├── Is it purely presentational? (Avatar, Badge, Card, Skeleton)
    │   └── Section 2 — Presentational Template (simple, no hooks)
    │
    ├── Is it a simple interactive? (Breadcrumb, Pagination, Rating)
    │   └── Section 3 — Interactive Template (ARIA + keyboard)
    │
    ├── Is it a form control? (Tag Input, File Upload, Color Picker)
    │   └── Section 4 — Form Control Template (ARIA + keyboard + form)
    │
    └── Is it a complex composite? (Calendar, Data Table, Tree View)
        └── Section 5 — Composite Template (all patterns combined)
```

### Can a third-party library handle the hard parts?

Before building complex interactivity from scratch, check if a headless library provides the state machine:

| Component              | Consider                       | Why                                            |
| ---------------------- | ------------------------------ | ---------------------------------------------- |
| Calendar / Date Picker | `react-aria` (date primitives) | Date math, locale, time zones                  |
| Data Table             | `@tanstack/react-table`        | Sorting, filtering, pagination, virtualization |
| Command Palette        | `cmdk`                         | Fuzzy search, keyboard nav, scoring            |
| Carousel               | `embla-carousel-react`         | Snap points, drag physics, loop                |
| Resizable Panels       | `react-resizable-panels`       | Drag, constraints, persistence                 |
| Virtual Lists          | `@tanstack/react-virtual`      | Windowing, dynamic heights                     |
| DnD / Sortable         | `@dnd-kit/core`                | Drag physics, collision, accessibility         |

If a headless library exists, wrap it with Prototyper UI styling patterns (data-slot, cn(), tokens, animation) rather than reimplementing the state machine.

---

## 2. Presentational Template

For components with no interactive behavior — just semantic HTML, styling, and slots.

Used by: Avatar, Badge, Card, Skeleton, Separator, AspectRatio

```tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// --- Variants ---

const avatarVariants = cva(
  [
    "relative inline-flex items-center justify-center overflow-hidden",
    "rounded-full bg-muted text-muted-foreground",
    "select-none",
  ],
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

// --- Root ---

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarVariants>) {
  return (
    <span
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

// --- Image (with fallback handling) ---

function AvatarImage({
  className,
  onError,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      onError={onError}
      {...props}
    />
  );
}

// --- Fallback ---

function AvatarFallback({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
```

### Presentational Rules

- Use semantic HTML elements (`<nav>`, `<ol>`, `<figure>`, `<time>`, `<hr>`) — never a `<div>` when a semantic element exists
- No ARIA roles needed when HTML semantics are sufficient
- No keyboard handling needed (unless it contains interactive children)
- Props type: `React.ComponentProps<"element">` — not Base UI types
- Still needs: `data-slot`, `cn()` merge, CVA if variants exist
- Still needs: `"use client"`, named exports, no forwardRef

---

## 3. Interactive Template

For components with keyboard interaction and ARIA state — but not form submission.

Used by: Breadcrumb, Pagination, Rating, Stepper, Disclosure, Tree View

```tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// --- Controlled/Uncontrolled State Hook ---

function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internal;

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue =
        typeof next === "function"
          ? (next as (prev: T) => T)(isControlled ? controlledValue! : internal)
          : next;
      if (!isControlled) setInternal(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, controlledValue, internal, onChange],
  );

  return [value, setValue];
}

// --- Root ---

function Rating({
  className,
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  onValueChange,
  disabled = false,
  readOnly = false,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: number;
  defaultValue?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const [value, setValue] = useControllableState(
    controlledValue,
    defaultValue,
    onValueChange,
  );
  const [hovered, setHovered] = React.useState<number | null>(null);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || readOnly) return;

      let next = value;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = Math.min(value + 1, max);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = Math.max(value - 1, 0);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = max;
          break;
        default:
          return;
      }

      event.preventDefault();
      setValue(next);
    },
    [disabled, readOnly, value, max, setValue],
  );

  return (
    <div
      data-slot="rating"
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "inline-flex gap-0.5",
        "focus-visible:focus-ring rounded-sm",
        disabled && "status-disabled",
        className,
      )}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHovered(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => (
        <RatingItem
          key={i}
          index={i + 1}
          filled={(hovered ?? value) >= i + 1}
          onHover={() => !disabled && !readOnly && setHovered(i + 1)}
          onSelect={() => !disabled && !readOnly && setValue(i + 1)}
        />
      ))}
    </div>
  );
}

// --- Item ---

function RatingItem({
  filled,
  onHover,
  onSelect,
  index,
}: {
  filled: boolean;
  index: number;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <span
      data-slot="rating-item"
      data-filled={filled || undefined}
      aria-hidden="true"
      className={cn(
        "cursor-pointer text-muted transition-colors duration-150 ease-smooth",
        "motion-reduce:transition-none",
        "data-filled:text-primary",
        "hover-only:hover:scale-110",
      )}
      onMouseEnter={onHover}
      onClick={onSelect}
    >
      ★
    </span>
  );
}

export { Rating, RatingItem };
```

### Interactive Patterns Explained

This template demonstrates all the core patterns you need for interactive components:

**1. Controlled/Uncontrolled dual-mode** (the `useControllableState` hook)
**2. ARIA role + states** (`role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`)
**3. Keyboard navigation** (`onKeyDown` with arrow keys, Home/End)
**4. Focus management** (`tabIndex`, `focus-visible:focus-ring`)
**5. Data attributes for styling** (`data-filled` on items)
**6. Disabled/ReadOnly states** (`aria-disabled`, conditional keyboard handling)

---

## 4. Form Control Template

For components that participate in form submission — need hidden inputs and Field compatibility.

Used by: Tag Input, File Upload, Color Picker, Custom Select

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// --- useControllableState (same as Section 3, extract to shared hook) ---

function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internal;

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue =
        typeof next === "function"
          ? (next as (prev: T) => T)(isControlled ? controlledValue! : internal)
          : next;
      if (!isControlled) setInternal(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, controlledValue, internal, onChange],
  );

  return [value, setValue];
}

// --- TagInput ---

function TagInput({
  className,
  name,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  disabled = false,
  required = false,
  maxTags,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  maxTags?: number;
}) {
  const [tags, setTags] = useControllableState(
    controlledValue,
    defaultValue,
    onValueChange,
  );
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = React.useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed || tags.includes(trimmed)) return;
      if (maxTags && tags.length >= maxTags) return;
      setTags([...tags, trimmed]);
    },
    [tags, maxTags, setTags],
  );

  const removeTag = React.useCallback(
    (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
    },
    [tags, setTags],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          event.preventDefault();
          addTag(inputValue);
          setInputValue("");
          break;
        case "Backspace":
          if (inputValue === "" && tags.length > 0) {
            removeTag(tags.length - 1);
          }
          break;
      }
    },
    [disabled, inputValue, tags, addTag, removeTag],
  );

  return (
    <div
      data-slot="tag-input"
      data-disabled={disabled || undefined}
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-field-border",
        "bg-field-background px-3 py-1.5 shadow-field",
        "transition-[color,background-color,border-color,box-shadow,opacity] duration-150 ease-smooth",
        "motion-reduce:transition-none",
        "focus-within:focus-field-ring",
        "data-disabled:status-disabled",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      {tags.map((tag, index) => (
        <TagInputTag
          key={tag}
          onRemove={() => removeTag(index)}
          disabled={disabled}
        >
          {tag}
        </TagInputTag>
      ))}

      <input
        ref={inputRef}
        data-slot="tag-input-field"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "min-w-[60px] flex-1 bg-transparent text-sm outline-none",
          "placeholder:text-muted-foreground",
        )}
        aria-label="Add tag"
      />

      {/* Hidden inputs for form submission */}
      {name &&
        tags.map((tag) => (
          <input key={tag} type="hidden" name={name} value={tag} />
        ))}

      {/* Validation: required + empty = invalid */}
      {name && required && tags.length === 0 && (
        <input
          type="text"
          name={`${name}_validation`}
          required
          value=""
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// --- Tag ---

function TagInputTag({
  children,
  onRemove,
  disabled,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  onRemove: () => void;
  disabled?: boolean;
}) {
  return (
    <span
      data-slot="tag-input-tag"
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium",
        "transition-[color,background-color,border-color,box-shadow,opacity] duration-150 ease-smooth",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
      {!disabled && (
        <button
          data-slot="tag-input-remove"
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
          className={cn(
            "inline-flex size-3.5 items-center justify-center rounded-sm",
            "hover-only:hover:bg-primary-soft-hover",
            "focus-visible:focus-ring",
            "no-highlight",
          )}
        >
          ×
        </button>
      )}
    </span>
  );
}

export { TagInput, TagInputTag };
```

### Form Integration Patterns

**Hidden inputs for form submission:**

```tsx
// Single value — one hidden input
<input type="hidden" name={name} value={value} />;

// Multiple values — one hidden input per value (same name)
{
  values.map((v) => <input key={v} type="hidden" name={name} value={v} />);
}
```

**Validation with hidden inputs:**

```tsx
// Required field with custom control
{
  required && isEmpty && (
    <input
      type="text"
      required
      value=""
      onChange={() => {}}
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
```

**Field wrapper compatibility:**
The component must work when wrapped by `<Field>`:

```tsx
<Field>
  <FieldLabel>Tags</FieldLabel>
  <TagInput name="tags" required />
  <FieldError>Please add at least one tag.</FieldError>
</Field>
```

For this to work:

- The visible input must connect to Field via `id` (Field auto-generates this)
- Error states should respond to `data-invalid` from the parent Field
- Add `data-invalid:invalid-field-ring` to the container if it has a border

---

## 5. Composite Template

For complex components with multiple interactive regions, roving focus, and ARIA composite patterns.

Used by: Calendar, Data Table, Tree View, Command Palette

This template shows the **roving tabindex** pattern — the foundation for any composite widget with arrow-key navigation.

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// --- Roving Focus Hook ---

function useRovingFocus(
  containerRef: React.RefObject<HTMLElement | null>,
  options: {
    orientation?: "horizontal" | "vertical" | "both";
    loop?: boolean;
    selector?: string;
  } = {},
) {
  const {
    orientation = "both",
    loop = true,
    selector = "[data-roving-item]",
  } = options;

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const items = Array.from(
        container.querySelectorAll<HTMLElement>(selector),
      ).filter((el) => !el.hasAttribute("data-disabled"));

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      const isHorizontal =
        orientation === "horizontal" || orientation === "both";
      const isVertical = orientation === "vertical" || orientation === "both";

      switch (event.key) {
        case "ArrowRight":
          if (isHorizontal) nextIndex = currentIndex + 1;
          break;
        case "ArrowLeft":
          if (isHorizontal) nextIndex = currentIndex - 1;
          break;
        case "ArrowDown":
          if (isVertical) nextIndex = currentIndex + 1;
          break;
        case "ArrowUp":
          if (isVertical) nextIndex = currentIndex - 1;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = items.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex === null) return;
      event.preventDefault();

      // Loop or clamp
      if (loop) {
        nextIndex = ((nextIndex % items.length) + items.length) % items.length;
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
      }

      // Roving tabindex: deactivate current, activate next
      items[currentIndex].setAttribute("tabindex", "-1");
      items[nextIndex].setAttribute("tabindex", "0");
      items[nextIndex].focus();
    },
    [containerRef, orientation, loop, selector],
  );

  return { handleKeyDown };
}

// --- Example: Pagination ---

function Pagination({
  className,
  page: controlledPage,
  defaultPage = 1,
  total,
  onPageChange,
  ...props
}: Omit<React.ComponentProps<"nav">, "onChange"> & {
  page?: number;
  defaultPage?: number;
  total: number;
  onPageChange?: (page: number) => void;
}) {
  const [page, setPage] = useControllableState(
    controlledPage,
    defaultPage,
    onPageChange,
  );
  const containerRef = React.useRef<HTMLElement>(null);
  const { handleKeyDown } = useRovingFocus(containerRef, {
    orientation: "horizontal",
  });

  return (
    <nav
      ref={containerRef}
      data-slot="pagination"
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <PaginationItem
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        aria-label="Previous page"
        isFirst
      >
        ‹
      </PaginationItem>

      {Array.from({ length: total }, (_, i) => (
        <PaginationItem
          key={i + 1}
          active={page === i + 1}
          onClick={() => setPage(i + 1)}
          aria-label={`Page ${i + 1}`}
          aria-current={page === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </PaginationItem>
      ))}

      <PaginationItem
        disabled={page >= total}
        onClick={() => setPage(page + 1)}
        aria-label="Next page"
        isLast
      >
        ›
      </PaginationItem>
    </nav>
  );
}

function PaginationItem({
  active,
  disabled,
  isFirst,
  isLast,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  active?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <button
      data-slot="pagination-item"
      data-roving-item
      data-active={active || undefined}
      data-disabled={disabled || undefined}
      type="button"
      disabled={disabled}
      tabIndex={active || (isFirst && !disabled) ? 0 : -1}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-sm",
        "transition-[color,background-color,border-color,box-shadow,opacity] duration-150 ease-smooth",
        "motion-reduce:transition-none",
        "hover-only:hover:bg-accent hover-only:hover:text-accent-foreground",
        "focus-visible:focus-ring",
        "disabled:status-disabled",
        "no-highlight",
        "data-active:bg-primary data-active:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Pagination, PaginationItem };
```

---

## 6. ARIA Role Selection

### Which role for which component?

```
What does the component represent?
│
├── A clickable action?
│   ├── Navigates to URL → role not needed (<a> has implicit link role)
│   ├── Triggers action → role not needed (<button> has implicit button role)
│   └── Toggles state → role="switch" or aria-pressed="true/false"
│
├── A value in a range?
│   ├── User can change it → role="slider" (+ aria-valuenow/min/max)
│   ├── Display only, known range → role="meter" (+ aria-valuenow/min/max)
│   └── Display only, indeterminate → role="progressbar" (+ aria-valuenow or none)
│
├── A selection from options?
│   ├── Single select, dropdown → role="listbox" (items: role="option")
│   ├── Single select, inline → role="radiogroup" (items: role="radio")
│   ├── Multi-select → role="listbox" + aria-multiselectable="true"
│   └── Searchable select → role="combobox" (input) + role="listbox" (popup)
│
├── A group of related controls?
│   ├── Actions/buttons → role="toolbar"
│   ├── Navigation links → role not needed (<nav> has implicit navigation role)
│   ├── Tabs → role="tablist" (items: role="tab", panels: role="tabpanel")
│   └── Generic group → role="group" (+ aria-label)
│
├── A hierarchical structure?
│   ├── Tree of items → role="tree" (items: role="treeitem")
│   ├── Tabular data → role not needed (<table> has implicit table role)
│   └── Interactive grid → role="grid" (cells: role="gridcell")
│
├── An overlay?
│   ├── Blocks interaction → role="dialog" + aria-modal="true"
│   ├── Important message → role="alertdialog" + aria-modal="true"
│   └── Tooltip-like → role="tooltip"
│
└── A notification?
    ├── Urgent → role="alert" (implies aria-live="assertive")
    ├── Status update → role="status" (implies aria-live="polite")
    └── Running log → role="log" (implies aria-live="polite")
```

### Essential ARIA State Attributes

| Attribute        | Values                           | Use on                                                  |
| ---------------- | -------------------------------- | ------------------------------------------------------- |
| `aria-expanded`  | `"true"` / `"false"`             | Disclosure triggers, accordion headers, tree items      |
| `aria-selected`  | `"true"` / `"false"`             | Tabs, listbox options, tree items                       |
| `aria-checked`   | `"true"` / `"false"` / `"mixed"` | Checkboxes, radio buttons, switches                     |
| `aria-pressed`   | `"true"` / `"false"`             | Toggle buttons                                          |
| `aria-current`   | `"page"` / `"step"` / `"true"`   | Breadcrumb current item, stepper current step           |
| `aria-disabled`  | `"true"`                         | Disabled interactive elements                           |
| `aria-hidden`    | `"true"`                         | Decorative elements, icons alongside text labels        |
| `aria-valuenow`  | number                           | Sliders, meters, progress bars                          |
| `aria-valuemin`  | number                           | Sliders, meters, progress bars                          |
| `aria-valuemax`  | number                           | Sliders, meters, progress bars                          |
| `aria-valuetext` | string                           | Sliders when number alone is insufficient (e.g., "50%") |
| `aria-live`      | `"polite"` / `"assertive"`       | Regions with dynamic content updates                    |
| `aria-modal`     | `"true"`                         | Dialogs that trap focus                                 |

### Naming Rules

```
Does the element have visible text content?
│
├── Yes, and it's a button/link/heading → Name from content (automatic)
│
├── Yes, but text is ambiguous → aria-labelledby pointing to specific text
│   (e.g., "Read more..." → aria-labelledby="read-more heading-id")
│
├── No visible text (icon-only button) → aria-label="Close"
│
├── Form control → <label> element (explicit for= or implicit wrapping)
│
├── Group of controls → <fieldset> + <legend>
│   Or role="group" + aria-label="Group name"
│
├── Navigation region → <nav aria-label="Main navigation">
│
└── Decorative → aria-hidden="true" (remove from accessibility tree)
```

**Never** include the role name in the label. "Close" not "Close button." "Navigation" not "Navigation nav."

---

## 7. Keyboard Navigation Patterns

### Pattern A: Single Focusable Element

For components with one interactive surface (Button, Toggle, Rating, Disclosure).

```
Tab → Focus the element
Enter/Space → Activate
Arrow keys → Adjust value (if applicable)
```

```tsx
function handleKeyDown(event: React.KeyboardEvent) {
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      activate();
      break;
    case "ArrowRight":
    case "ArrowUp":
      event.preventDefault();
      increment();
      break;
    case "ArrowLeft":
    case "ArrowDown":
      event.preventDefault();
      decrement();
      break;
    case "Home":
      event.preventDefault();
      setToMinimum();
      break;
    case "End":
      event.preventDefault();
      setToMaximum();
      break;
  }
}
```

### Pattern B: Roving Tabindex (Composite Widget)

For components with multiple focusable items where only ONE is in the tab order at a time (Toolbar, Tabs, Listbox, Radio Group, Pagination).

```
Tab → Focus the active item (only one in tab order)
Arrow keys → Move focus between items
Home → Focus first item
End → Focus last item
Enter/Space → Select/activate focused item
```

**Implementation**: See the `useRovingFocus` hook in Section 5.

**Rules:**

- Active item gets `tabIndex={0}`, all others get `tabIndex={-1}`
- Arrow keys move focus AND update `tabIndex` values
- On initial focus, land on the selected item (or first item if none selected)
- Loop: wrap around when reaching the end (optional, configurable)

### Pattern C: Active Descendant (Combobox-style)

For components where focus stays on an input while a separate list shows a visual highlight (Combobox, Command Palette).

```
Tab → Focus the input
Arrow keys → Move highlight in the list (focus stays on input)
Enter → Select highlighted item
Escape → Close popup / clear
```

```tsx
<input
  role="combobox"
  aria-expanded={open}
  aria-activedescendant={highlightedId}
  aria-controls={listId}
  aria-autocomplete="list"
  onKeyDown={handleKeyDown}
/>

<ul id={listId} role="listbox">
  {items.map((item) => (
    <li
      key={item.id}
      id={item.id}
      role="option"
      aria-selected={item.id === highlightedId}
      data-highlighted={item.id === highlightedId || undefined}
    >
      {item.label}
    </li>
  ))}
</ul>
```

**Use `aria-activedescendant`** instead of roving tabindex when:

- Focus must stay on an input (combobox, searchbox)
- The list is virtualized (not all items are in DOM)
- You need typeahead search

### Pattern D: Grid Navigation

For two-dimensional navigation (Calendar, Data Table).

```
ArrowRight → Next cell
ArrowLeft → Previous cell
ArrowDown → Same column, next row
ArrowUp → Same column, previous row
Home → First cell in row
End → Last cell in row
Ctrl+Home → First cell in grid
Ctrl+End → Last cell in grid
PageDown → Same cell, next page/month
PageUp → Same cell, previous page/month
```

```tsx
function handleGridKeyDown(
  event: React.KeyboardEvent,
  row: number,
  col: number,
  rows: number,
  cols: number,
) {
  let nextRow = row;
  let nextCol = col;

  switch (event.key) {
    case "ArrowRight":
      nextCol = col + 1;
      break;
    case "ArrowLeft":
      nextCol = col - 1;
      break;
    case "ArrowDown":
      nextRow = row + 1;
      break;
    case "ArrowUp":
      nextRow = row - 1;
      break;
    case "Home":
      nextCol = event.ctrlKey ? 0 : 0;
      if (event.ctrlKey) nextRow = 0;
      break;
    case "End":
      nextCol = event.ctrlKey ? cols - 1 : cols - 1;
      if (event.ctrlKey) nextRow = rows - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  // Clamp or wrap
  nextRow = Math.max(0, Math.min(nextRow, rows - 1));
  nextCol = Math.max(0, Math.min(nextCol, cols - 1));
  focusCell(nextRow, nextCol);
}
```

### Typeahead Search

For listbox/tree/menu components — typing characters jumps to the matching item:

```tsx
function useTypeahead(
  items: { label: string; element: HTMLElement }[],
  options: { timeout?: number } = {},
) {
  const { timeout = 500 } = options;
  const searchRef = React.useRef("");
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      // Ignore control keys
      if (
        event.key.length !== 1 ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;

      clearTimeout(timerRef.current);
      searchRef.current += event.key.toLowerCase();

      const match = items.find((item) =>
        item.label.toLowerCase().startsWith(searchRef.current),
      );
      if (match) match.element.focus();

      timerRef.current = setTimeout(() => {
        searchRef.current = "";
      }, timeout);
    },
    [items, timeout],
  );

  return { handleKeyDown };
}
```

---

## 8. Focus Management

### Focus Trapping (Modals)

When building a modal from scratch (no Base UI Dialog), you must trap focus:

```tsx
function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableSelector = [
      "a[href]",
      "button:not(:disabled)",
      "input:not(:disabled)",
      "select:not(:disabled)",
      "textarea:not(:disabled)",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        container!.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef]);
}
```

### Focus Restoration

When an overlay closes, return focus to the element that opened it:

```tsx
function useFocusRestoration(isOpen: boolean) {
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      // Capture the currently focused element when opening
      triggerRef.current = document.activeElement as HTMLElement;
    } else if (triggerRef.current) {
      // Restore focus when closing
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);
}
```

### Initial Focus

When an overlay opens, move focus to the first focusable element inside:

```tsx
React.useEffect(() => {
  if (!isOpen) return;
  // Delay to ensure DOM is painted
  requestAnimationFrame(() => {
    const container = containerRef.current;
    if (!container) return;
    const autofocus = container.querySelector<HTMLElement>(
      "[autofocus], [data-autofocus]",
    );
    const firstFocusable =
      container.querySelector<HTMLElement>(focusableSelector);
    (autofocus ?? firstFocusable ?? container).focus();
  });
}, [isOpen]);
```

---

## 9. Controlled / Uncontrolled State

The `useControllableState` hook (shown in Sections 3 and 4) is the foundation for every interactive primitive. It supports three usage modes:

```tsx
// Uncontrolled — component manages its own state
<Rating defaultValue={3} onValueChange={(v) => console.log(v)} />

// Controlled — parent manages state
<Rating value={rating} onValueChange={setRating} />

// Fully uncontrolled — no callbacks, just internal state
<Rating defaultValue={3} />
```

### Implementation Pattern

```tsx
function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internal;

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue =
        typeof next === "function"
          ? (next as (prev: T) => T)(isControlled ? controlledValue! : internal)
          : next;
      if (!isControlled) setInternal(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, controlledValue, internal, onChange],
  );

  return [value, setValue];
}
```

### Props Convention

Always accept three props for controllable values:

| Prop            | Purpose                     | Example                          |
| --------------- | --------------------------- | -------------------------------- |
| `value`         | Controlled value (optional) | `value={3}`                      |
| `defaultValue`  | Initial uncontrolled value  | `defaultValue={0}`               |
| `onValueChange` | Callback when value changes | `onValueChange={(v) => setV(v)}` |

Name the callback `on{ValueName}Change` — e.g., `onValueChange`, `onPageChange`, `onOpenChange`, `onCheckedChange`.

---

## 10. Data Attributes as Styling Hooks

### Creating Custom Data Attributes

Expose component state via `data-*` attributes so consumers can style with CSS:

```tsx
<div
  data-slot="rating"
  data-disabled={disabled || undefined}
  data-readonly={readOnly || undefined}
  data-value={value}
>
  <span
    data-slot="rating-item"
    data-filled={filled || undefined}
    data-highlighted={highlighted || undefined}
  />
</div>
```

### Rules

1. **Boolean attributes**: Set to `true`/presence or `undefined` (never `"false"`)

   ```tsx
   data-active={isActive || undefined}      // Correct: present or absent
   data-active={isActive ? "true" : "false"} // Wrong: always present
   ```

2. **Enumerated attributes**: Use string values

   ```tsx
   data-state={state}           // "idle" | "loading" | "error"
   data-orientation={orientation} // "horizontal" | "vertical"
   data-side={side}             // "top" | "bottom" | "left" | "right"
   ```

3. **Numeric attributes**: Set as string (CSS can't read attribute values, but JS can)
   ```tsx
   data-value={String(value)}
   ```

### Tailwind Targeting

```tsx
// Boolean (presence)
"data-filled:text-primary";
"data-disabled:status-disabled";
"data-highlighted:bg-accent";

// Value-based
"data-[state=loading]:animate-pulse";
"data-[orientation=vertical]:flex-col";
"data-[side=top]:slide-in-from-bottom-2";

// Group data (from parent with group class)
"group-data-disabled:opacity-50";
"group-data-checked:bg-primary";
```

---

## 11. CSS Variables for Dynamic Values

Expose computed values as CSS custom properties for consumer-side styling:

```tsx
<div
  data-slot="progress"
  style={
    {
      "--progress-value": `${(value / max) * 100}%`,
      "--progress-max": String(max),
    } as React.CSSProperties
  }
>
  <div
    data-slot="progress-indicator"
    className="h-full bg-primary transition-[width] duration-300"
    style={{ width: "var(--progress-value)" }}
  />
</div>
```

### Common CSS Variables to Expose

| Variable              | Component Type          | Example                    |
| --------------------- | ----------------------- | -------------------------- |
| `--{component}-value` | Progress, Meter, Slider | Percentage or raw value    |
| `--{component}-max`   | Progress, Meter         | Maximum value              |
| `--{component}-count` | Tag Input, Pagination   | Number of items            |
| `--available-height`  | Positioned overlays     | Max height before overflow |
| `--anchor-width`      | Positioned overlays     | Trigger element width      |
| `--transform-origin`  | Positioned overlays     | Animation origin point     |

### Typing CSS Variables

React's `CSSProperties` type doesn't include custom properties. Use a type assertion:

```tsx
style={{ "--progress-value": `${pct}%` } as React.CSSProperties}
```

---

## 12. Click Outside & Escape Dismissal

For overlay-like components built without Base UI's Dialog/Popover.

```tsx
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean = true,
) {
  React.useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    // Use pointerdown, not click — click fires after mouseup,
    // which can be on a different element than mousedown
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, handler, enabled]);
}

function useEscapeKey(handler: () => void, enabled: boolean = true) {
  React.useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation(); // Prevent parent overlays from also closing
        handler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handler, enabled]);
}
```

### Combining Both

```tsx
function Disclosure({ ... }) {
  const [open, setOpen] = useControllableState(...)
  const contentRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(contentRef, () => setOpen(false), open)
  useEscapeKey(() => setOpen(false), open)

  return (
    <>
      <button
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </button>
      {open && (
        <div ref={contentRef} id={contentId}>
          {children}
        </div>
      )}
    </>
  )
}
```

---

## 13. Animation Lifecycle (Without Base UI)

When building overlays from scratch, you need to manage the mount/unmount animation cycle yourself. Base UI provides `data-starting-style` / `data-ending-style` and `getAnimations()` detection — when building from scratch, use this pattern:

### CSS Transition Approach (Preferred — Interruptible)

```tsx
function useAnimatedPresence(isOpen: boolean) {
  const [mounted, setMounted] = React.useState(isOpen);
  const [visible, setVisible] = React.useState(isOpen);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Force a layout read before setting visible (triggers transition)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      // Wait for transition to finish before unmounting
      const el = ref.current;
      if (!el) return setMounted(false);

      function handleTransitionEnd() {
        setMounted(false);
        el?.removeEventListener("transitionend", handleTransitionEnd);
      }
      el.addEventListener("transitionend", handleTransitionEnd);
      return () =>
        el?.removeEventListener("transitionend", handleTransitionEnd);
    }
  }, [isOpen]);

  return { ref, mounted, visible };
}
```

Usage:

```tsx
function MyOverlay({ open }: { open: boolean }) {
  const { ref, mounted, visible } = useAnimatedPresence(open);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      data-slot="my-overlay"
      className={cn(
        "transition-[opacity,transform] duration-150 ease-out-fluid",
        "motion-reduce:transition-none",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      )}
    />
  );
}
```

### CSS Keyframe Approach (For Non-Interruptible Enter/Exit)

If you prefer keyframe animations (like all current Prototyper UI overlays use), apply the animation conditionally:

```tsx
<div
  className={cn(
    open && "animate-in fade-in-0 zoom-in-95 duration-150",
    !open && "animate-out fade-out-0 zoom-out-95 duration-100",
    "motion-reduce:animate-none",
  )}
  onAnimationEnd={() => {
    if (!open) setMounted(false);
  }}
/>
```

---

## 14. Ref Merging

When your component needs an internal ref AND must accept a user ref:

```tsx
function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return React.useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") ref(node);
        else (ref as React.MutableRefObject<T | null>).current = node;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}

// Usage
function MyComponent({
  ref: userRef,
  ...props
}: {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const internalRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(internalRef, userRef);

  return <div ref={mergedRef} {...props} />;
}
```

---

## 15. Putting It All Together — Checklist

### Before You Start

- [ ] Confirmed no Base UI primitive exists for this component
- [ ] Checked for headless libraries that handle the state machine
- [ ] Identified the WAI-ARIA pattern (https://www.w3.org/WAI/ARIA/apg/patterns/)
- [ ] Identified the correct ARIA role from Section 6

### HTML & ARIA

- [ ] Using semantic HTML elements (`<nav>`, `<button>`, `<input>`, `<ol>`) — never `<div>` when semantic exists
- [ ] Correct ARIA role on the root or primary interactive element
- [ ] All required ARIA states set (`aria-expanded`, `aria-selected`, `aria-checked`, etc.)
- [ ] Interactive elements have accessible names (visible text, `aria-label`, or `<label>`)
- [ ] Decorative elements have `aria-hidden="true"`
- [ ] Live regions (`aria-live`) for dynamic content updates
- [ ] `aria-disabled` (not just HTML `disabled`) for custom controls

### Keyboard

- [ ] All functionality reachable via keyboard
- [ ] Correct keyboard pattern (single focus, roving tabindex, or active descendant)
- [ ] Arrow keys for navigation within composites
- [ ] Home/End for first/last item
- [ ] Enter/Space for activation
- [ ] Escape for dismissal (overlays)
- [ ] Tab order makes sense (only one tab stop per composite widget)
- [ ] `event.preventDefault()` on handled keys (prevent scroll on arrows)

### Focus

- [ ] `focus-visible:focus-ring` on focusable elements
- [ ] Focus trapped in modals (`useFocusTrap`)
- [ ] Focus restored when overlays close (`useFocusRestoration`)
- [ ] Initial focus set when overlays open
- [ ] Disabled items are either unfocusable or focusable-but-inert (depends on pattern)

### State

- [ ] Controlled/uncontrolled via `useControllableState`
- [ ] Props follow the `value` / `defaultValue` / `onValueChange` convention
- [ ] State exposed via data attributes for CSS targeting
- [ ] CSS variables for dynamic computed values

### Styling

- [ ] `data-slot` on every rendered element
- [ ] `cn()` merging with user `className` last
- [ ] Semantic tokens (no raw colors, no `dark:` utilities)
- [ ] `hover-only:hover:` prefix on all hover states
- [ ] `motion-safe:active:scale-[0.97]` for press feedback
- [ ] `motion-reduce:transition-none` on all transitions
- [ ] `motion-reduce:animate-none` on all animations
- [ ] `no-highlight` on interactive elements
- [ ] `disabled:status-disabled` on disableable elements

### Form (if applicable)

- [ ] Hidden `<input>` for form submission with `name` prop
- [ ] `required` validation via hidden required input or constraint API
- [ ] Works when wrapped by `<Field>` component
- [ ] Error state responds to `data-invalid` from Field

### Structure

- [ ] `"use client"` as line 1
- [ ] Import order: react → cva → icons → cn → local
- [ ] Named exports only, single `export { }` block
- [ ] No `React.forwardRef` (handle refs via prop or `useMergedRef`)
- [ ] No `export default`

---

## 16. Cross-References

- **Wrapping an existing Base UI primitive**: Invoke `/create-component` skill
- **Animation patterns and exact class strings**: Invoke `/animate-ui` skill
- **Design tokens, component selection, and usage patterns**: Invoke `/prototyper-ui` skill
- **WAI-ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/patterns/
- **Base UI primitives**: https://base-ui.com/react/components/{name}
