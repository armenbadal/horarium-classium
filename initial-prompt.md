You are a senior TypeScript/Tauri developer.

Create the initial skeleton of a Windows desktop application called __horarium-classium__ («Դասացուցակ»).

The application will eventually show a weekly lesson schedule and run mostly in the Windows system tray.

## Technology

Use:

* Tauri 2
* TypeScript
* Vanilla HTML
* Vanilla CSS
* npm
* Rust only for the minimum Tauri backend/bootstrap code

Do NOT use:

* React
* Vue
* Svelte
* Angular
* Tailwind
* Bootstrap
* any frontend framework

Keep the project deliberately small and simple.

## Application idea

The final application will:

1. Show the lessons for the current weekday.
2. Run in the Windows system tray.
3. One minute before a lesson starts, show a native Windows notification.
4. At the end of a lesson, show a notification telling the user what the next lesson is.
5. Optionally play a sound.
6. Optionally use text-to-speech.
7. Eventually support autostart with Windows.
8. Closing the main window should eventually hide it to the tray instead of terminating the application.

For THIS TASK, do not implement all of this behavior yet.

The goal is to create a clean project skeleton and install/configure the dependencies needed for the first development iterations.

## Step 1 — Inspect the environment

Before modifying anything, check that the required development tools are available:

* Node.js
* npm
* Rust
* Cargo

Also verify that the machine can build a Tauri 2 Windows application.

Do not silently install large global/system dependencies.

If a required Windows/Tauri prerequisite is missing, clearly report it.

## Step 2 — Create the project

Create a Tauri 2 application using the current official Tauri tooling.

Use:

* npm
* TypeScript
* Vanilla frontend

Application/product name:

```
Դասացուցակ
```

Use a reasonable package/project identifier such as:

```
horarium
```

and an application identifier such as:

```
am.badalian.horarium
```

If the repository already contains files, inspect them first and do not overwrite unrelated work.

## Step 3 — Install Tauri dependencies

Install and configure the official Tauri plugins needed for:

### Notifications

Use the official Tauri notification plugin:

```
@tauri-apps/plugin-notification
```

and its Rust-side Tauri plugin dependency/configuration.

### Autostart

Use the official Tauri autostart plugin:

```
@tauri-apps/plugin-autostart
```

and its Rust-side Tauri plugin dependency/configuration.

### System tray

Use the standard Tauri 2 tray API.

Do not add a third-party tray library.

Do not add unnecessary dependencies.

For sound and speech, do NOT install libraries yet.

Later we intend to use browser/WebView APIs where practical:

* `Audio`
* `speechSynthesis`

## Step 4 — Create the source structure

Organize the TypeScript code approximately like this:

```
src/
  main.ts
  schedule.ts
  scheduler.ts
  notifications.ts
  audio.ts
  speech.ts
  tray.ts
  settings.ts
  types.ts
  style.css
```

Do not put substantial logic into these modules yet.

Create clean minimal exports/interfaces so that the architecture is visible and the project compiles.

Use this basic domain model:

```ts
export interface Lesson {
    subject: string;
    start: string;
    end: string;
}

export interface DaySchedule {
    day: number;
    lessons: Lesson[];
}
```

Use:

```
1 = Երկուշաբթի
2 = Երեքշաբթի
3 = Չորեքշաբթի
4 = Հինգշաբթի
5 = Ուրբաթ
6 = Շաբաթ
7 = Կիրակի
```

Create one small hard-coded example schedule containing at least:

```
Մաթեմատիկա
09:02
10:05
```

The schedule must live in `schedule.ts`, not directly in the UI.

## Step 5 — Minimal UI

Create a minimal main window.

It should display something similar to:

```
┌──────────────────────────────────────┐
│ Չորեքշաբթի                           │
├──────────────┬───────────────────────┤
│ 09:02–10:05  │ Մաթեմատիկա            │
├──────────────┼───────────────────────┤
│ 10:10–10:50  │ Մայրենի               │
└──────────────┴───────────────────────┘
```

Use semantic HTML and plain CSS.

Do not spend time on visual polish.

The important point is that Armenian Unicode text displays correctly.

## Step 6 — Notification smoke test

Implement a very small notification wrapper in:

```
src/notifications.ts
```

It should expose approximately:

```ts
export async function notify(
    title: string,
    body: string
): Promise<void>
```

Use the official Tauri notification API.

Handle notification permission correctly.

For testing only, provide a temporary button in the main window:

```
Փորձարկել ծանուցումը
```

When clicked, it should attempt to show a native notification such as:

```
Title:
Դասացուցակ

Body:
1 րոպեից սկսվում է «Մաթեմատիկա» դասը։
```

Keep in mind that Windows notification behavior in Tauri development mode may differ from an installed application.

## Step 7 — Tray skeleton

Create `tray.ts`.

Add a basic system tray icon/menu architecture.

The tray menu should be prepared for these commands:

```
Բացել
----------------
Ձայն
Խոսք
----------------
Ելք
```

For this initial skeleton it is enough if:

* `Բացել` shows/focuses the main window;
* `Ելք` exits the application.

The sound and speech entries may be placeholders for now.

Prefer implementing the tray integration using supported Tauri 2 APIs rather than custom native code.

## Step 8 — Autostart integration

Configure the official autostart plugin and create minimal wrapper functions in `settings.ts`, for example:

```ts
export async function getAutostartEnabled(): Promise<boolean>;

export async function setAutostartEnabled(
    enabled: boolean
): Promise<void>;
```

Do not automatically enable autostart during development.

Just make the API available for later Settings UI.

Make sure the required Tauri capability permissions are configured.

## Step 9 — Placeholder modules

Create minimal placeholders for:

### scheduler.ts

Eventually responsible for:

* determining today's lessons;
* detecting a lesson starting in one minute;
* detecting lesson end;
* finding the next lesson;
* preventing duplicate notifications.

Do not implement the timer loop yet.

### audio.ts

Prepare a simple API such as:

```ts
export async function playBell(): Promise<void>;
```

It may currently be an empty/no-op implementation or clearly marked TODO.

### speech.ts

Prepare:

```ts
export function speak(text: string): void;
```

It may use `speechSynthesis` if doing so is trivial and safe, otherwise leave a clear TODO.

## Step 10 — Configuration and permissions

Inspect all generated Tauri configuration.

Configure only the permissions/capabilities required for the features already installed.

In particular verify permissions required by:

* notification
* autostart
* tray/window operations if applicable

Do not use overly broad permissions merely to make things work.

## Step 11 — Verify

After creating the project:

1. run npm install if necessary;
2. run TypeScript/frontend checks;
3. run the Tauri development build;
4. fix compilation/configuration errors;
5. make sure Rust code compiles;
6. make sure TypeScript compiles;
7. make sure the main window opens.

If possible, also verify that the notification test button reaches the native notification API.

Do not claim a test succeeded unless you actually ran it successfully.

## Step 12 — README

Create or update `README.md` with:

* project purpose;
* technology stack;
* prerequisites;
* how to install dependencies;
* how to run in development mode;
* how to build the Windows application;
* current project structure;
* which features are implemented;
* which features remain TODO.

## Coding style

Use:

* strict TypeScript;
* explicit types where they improve clarity;
* small modules;
* simple functions;
* no unnecessary abstractions;
* no dependency injection framework;
* no state management library;
* no classes unless they genuinely simplify the design.

This is a small desktop utility, not an enterprise web application.

Prefer straightforward code that will also be easy to explain in an educational context.

## Important architectural rule

Keep business logic independent from Tauri wherever possible.

For example:

```
scheduler.ts
```

should eventually contain ordinary TypeScript scheduling logic and should not directly know how Windows notifications are implemented.

Instead it should call abstractions/functions from:

```
notifications.ts
```

```
audio.ts
```

```
speech.ts
```

Likewise, the schedule data should not be tied to the DOM.

## Final result

At the end of the task I expect a project that:

* is a valid Tauri 2 + TypeScript + HTML + CSS application;
* has all required npm/Rust dependencies installed;
* builds successfully;
* has the proposed source directory structure;
* displays the sample Armenian lesson;
* has a system tray skeleton;
* has notification integration and a test button;
* has autostart support installed/configured but disabled by default;
* contains placeholders for scheduler, audio, speech and settings;
* contains no unnecessary frameworks or dependencies.

Finally, give me a concise report containing:

1. files created or significantly modified;
2. dependencies installed;
3. commands you actually ran;
4. build/test results;
5. any remaining warnings or environment issues;
6. the next logical implementation step.

Do not continue by implementing the full scheduler unless explicitly asked.
