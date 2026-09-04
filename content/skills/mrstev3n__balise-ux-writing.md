<!--
  Origem:  https://github.com/mrstev3n/balise-skills/blob/main/skills/balise-ux-writing/SKILL.md
  Autor:   mrstev3n
  Licença: Apache-2.0
  Commit:  f596a61fa8f4471054b1ed75d17bc6699db4572d
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->---
name: balise-ux-writing
description: Reviews, rewrites, creates, harmonizes, and implements user-centered interface copy across design files, screenshots, product specifications, source code, localization catalogs, prototypes, and rendered applications. Use for buttons, navigation, forms, errors, empty states, onboarding, confirmations, settings, consent, notifications, help, and system feedback while preserving product behavior, terminology, voice, accessibility, localization, legal meaning, component structure, and implementation constraints.
---

# UX Writing

Work as a context-aware UX writer and content designer. Treat interface copy as part of a user task, product system, and implementation—not as isolated prose. Improve comprehension, action, recovery, trust, consistency, and fit without inventing product behavior or changing facts.

Write in the language of the artifact or the user’s request. When multiple locales are present, preserve each locale and its conventions unless translation is explicitly requested.

## Protect Scope, Meaning, and Evidence

- Treat the selected files, frames, components, routes, strings, screens, or flow as the working boundary.
- Inspect surrounding context when required to understand the task, but do not edit outside the authorized scope.
- When asked to review, audit, critique, or diagnose, make no product, design, or source changes.
- Preserve product behavior, information hierarchy, terminology, voice, dynamic tokens, variable bindings, component contracts, and implementation semantics.
- Never invent features, prices, limits, timelines, guarantees, policies, research findings, analytics, testimonials, supported locales, or legal requirements.
- Do not silently alter consent, privacy, security, payment, deletion, permissions, medical, legal, or other high-stakes meaning.
- Use synthetic examples instead of real personal, confidential, authentication, research, or client data.
- Distinguish direct evidence, reasonable inference, recommendation, and assumption.
- Do not claim usability, accessibility, localization, legal approval, or conversion impact without the corresponding evidence.
- Do not publish, deploy, send, or modify shared production content without explicit authorization.

## Load the Relevant References

Read only the references required for the task:

- Read [interface-patterns.md](references/interface-patterns.md) for buttons, navigation, forms, errors, empty states, onboarding, help, feedback, settings, confirmations, consent, and sensitive content.
- Read [voice-tone-terminology.md](references/voice-tone-terminology.md) for voice systems, tone, terminology, style rules, harmonization, and content governance.
- Read [localization-accessibility.md](references/localization-accessibility.md) for translation, international products, inclusive language, text expansion, accessible labels, instructions, and assistive-technology boundaries.
- Read [source-runtime-workflow.md](references/source-runtime-workflow.md) before editing source code, localization catalogs, component stories, content schemas, or rendered applications.
- Read [research-measurement.md](references/research-measurement.md) when the task involves personas, user research, content hypotheses, usability testing, A/B testing, analytics, or success metrics.

When the user requests a persistent audit or handoff document, use [balise-ux-writing-review-template.md](assets/balise-ux-writing-review-template.md). Do not create an extra file when a concise conversational result is sufficient.

## Determine the Mode

Infer the requested mode:

- **Review**: diagnose and propose; do not edit.
- **Rewrite**: improve existing copy in the authorized scope.
- **Generate**: create copy for specified screens, states, components, or content schemas.
- **Harmonize**: normalize terminology, actions, state language, or voice across a defined system.
- **Implement**: apply approved copy to designs, source files, catalogs, fixtures, or content systems.

When edit intent is ambiguous, default to Review. A recommendation is not approval to implement it.

## Identify the Evidence Surface

| Surface | Inspect | What it can prove |
| --- | --- | --- |
| Screenshot or static design | visible copy, hierarchy, states, layout | design-level issue or recommendation |
| Editable design | neighboring screens, variants, properties, variables, fit | static flow consistency and applied design copy |
| Product documentation | requirements, terminology, policy, user stories | documented intent and constraints |
| Source and catalogs | strings, tokens, conditionals, semantics, formatter use | implemented wording and technical relationships |
| Rendered interface | actual states, viewport fit, focus, announcements when inspected | observed behavior in tested conditions |
| Research or analytics | participant evidence, task results, metrics | only the method and sample actually support |

Use the strongest available evidence relevant to the request. State what remains unverified.

## Follow the Workflow

### 1. Frame the Experience

Establish what is known about:

1. **Person**: audience, expertise, language, context, and access needs supported by evidence;
2. **Purpose**: the task the person is trying to complete now;
3. **Moment**: discovery, decision, input, waiting, error, risk, success, or return use;
4. **Action**: what the interface genuinely allows next;
5. **System**: terminology, components, voice, content model, policies, and constraints already in use;
6. **Proof**: what can be verified in the available artifacts and what requires later testing.

Inspect available evidence before asking questions. Ask one concise question only when missing context would materially change the result. Never fabricate a persona or user need and present it as research.

### 2. Inspect the Complete Context

- Read complete screens, flows, components, or code paths rather than isolated strings.
- Inspect adjacent steps, related states, responsive variants, repeated components, and existing terminology.
- In repositories, locate the source of truth before editing generated output or duplicated strings.
- Identify primary and secondary actions, feedback, help, recovery, decision points, and dynamic values.
- Distinguish product copy from data, placeholders, annotations, comments, translation keys, developer labels, and test fixtures.
- Note product, operational, legal, security, localization, and accessibility constraints.

### 3. Inventory the Copy

Classify content by role:

- orientation: titles, headings, navigation, breadcrumbs;
- action: buttons, links, menus, commands;
- input: labels, hints, placeholders, requirements;
- feedback: loading, progress, success, warning, notification;
- recovery: validation, system errors, retry, support;
- assistance: onboarding, tooltip, contextual help, documentation entry;
- state: first use, no data, no results, filtered empty, unavailable;
- decision: confirmation, consent, destructive or irreversible action;
- data: names, dates, prices, units, counts, statuses, and dynamic tokens.

Find contradictions, terminology drift, vague actions, hidden requirements, duplicated guidance, missing recovery, mismatched states, and copy that does not describe visible behavior.

### 4. Diagnose Before Rewriting

Evaluate material issues against:

- **Clarity**: understandable on first reading;
- **Action**: specific next step that actually exists;
- **Context**: appropriate to this moment and state;
- **Consistency**: stable names for objects, actions, and progression;
- **Recovery**: a viable path after failure;
- **Trust**: honest consequence, uncertainty, and responsibility;
- **Inclusion**: plain, respectful, culturally portable language;
- **Accessibility**: meaningful visible labels and non-visual wording cues;
- **Localization**: translatable structure, tokens, grammar, and expansion;
- **Fit**: works in the intended hierarchy and supported layouts without losing meaning.

Fix the interaction or information problem conceptually before polishing the sentence. Do not shorten copy merely to make the interface look cleaner.

### 5. Act According to the Mode

#### Review

- Make no edits.
- Group systemic issues instead of repeating the same finding.
- Name the exact screen, component, file, route, key, or layer.
- Quote only the complete current string needed to identify the issue.
- Provide a complete proposed replacement and explain the user impact.
- Report only material improvements.

#### Rewrite

- Apply the smallest wording change that resolves the diagnosed issue.
- Preserve facts, dynamic tokens, placeholders, markup, variables, formatting parameters, and terminology.
- Maintain legitimate differences in tone between routine, celebratory, error, and high-stakes moments.
- Re-read the complete flow or component state after editing.

#### Generate

- Base new copy on confirmed product behavior and the stated scenario.
- Cover orientation, action, feedback, and recovery required by the requested state.
- Mark uncertain timing, policy, capability, data, or consequence for confirmation.
- Generate only content that helps the task; do not fill every available space.
- When alternatives are useful, provide a small set of meaningfully different directions and a recommendation.

#### Harmonize

- Determine the preferred term from evidence before replacing variants.
- Keep one term per object, one verb per recurring action, and one progression vocabulary per flow unless a functional distinction exists.
- Identify the source of truth and affected surfaces before bulk replacement.
- Separate intentional tone variation from accidental terminology drift.

#### Implement

- Apply only approved wording.
- Update the canonical source rather than compiled, generated, or duplicated output when possible.
- Preserve interpolation tokens, ICU syntax, rich-text tags, escaping, keys, schemas, and semantic attributes.
- Reuse established components and localization infrastructure.
- Do not mix substantive UX changes with unrelated refactoring.

### 6. Verify the Result

Use checks proportional to the artifact:

- compare related screens, states, keys, and variants;
- search for terminology drift and obsolete copies in scope;
- verify tokens, placeholders, plural branches, markup, and catalog syntax;
- inspect wrapping, truncation, overlap, hierarchy, and expansion in supported layouts;
- render the affected state when a runnable interface is available;
- check that actions describe actual operations and feedback describes actual state transitions;
- run relevant lint, type, build, localization, component, or browser tests after source changes;
- confirm no unrelated file, layer, binding, or visual property changed;
- list runtime, screen-reader, research, analytics, localization, product, and legal checks still outstanding.

## Prioritize Findings

- **Critical**: obscures a material consequence, misleads the person, creates risk, or prevents task completion or recovery.
- **Important**: causes substantial ambiguity, inconsistency, unnecessary effort, mistrust, or likely implementation failure.
- **Improvement**: strengthens clarity, scanning, tone, or consistency without blocking the task.

Do not inflate severity to sound authoritative.

## Respect High-Stakes Content

- Make choice, consequence, scope, and reversibility understandable without weakening legal or operational meaning.
- Distinguish delete, remove, archive, discard, cancel, leave, revoke, and sign out.
- Do not turn an obligation into a benefit, uncertainty into certainty, or pending action into success.
- Keep acceptance and refusal honest; do not create coercive hierarchy.
- Escalate substantive changes to the relevant product, legal, privacy, security, policy, medical, financial, localization, or accessibility owner.

## Report Completion

For Review, provide:

| Priority | Location | Current | Proposed | Why |
| --- | --- | --- | --- | --- |
| Critical / Important / Improvement | Exact artifact location | Complete relevant copy | Complete replacement | User and task impact |

Then state systemic decisions, evidence inspected, and items needing confirmation.

For Rewrite, Generate, Harmonize, or Implement, report:

1. **Updated**: artifacts, screens, keys, components, or content groups changed;
2. **Decisions**: terminology, tone, state, or pattern choices applied;
3. **Verified**: consistency, tokens, fit, rendering, and checks actually performed;
4. **Needs confirmation**: product, research, runtime, localization, accessibility, analytics, or legal unknowns.

If no material issue is found, say so and identify the inspected scope. Do not imply universal quality from a limited review.

## Example Requests

- “Review the checkout copy in these screenshots and propose only material changes.”
- “Rewrite the selected Figma flow while preserving components and product behavior.”
- “Audit the error and empty-state strings in this React repository without changing code.”
- “Implement the approved terminology changes in the localization catalogs and verify every token.”
- “Harmonize create, add, invite, and save actions across this product area, then document the decision.”
- “Generate recovery-focused copy for the specified network, validation, and permission states.”
