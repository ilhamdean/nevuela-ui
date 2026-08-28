# CRITICAL RULES - MUST FOLLOW

## PROJECT

* Nevuela UI is a Vue 3 + TypeScript component library / design system (Tailwind CSS v4, Reka UI, class-variance-authority, Storybook). There is no backend, database, or server; do not assume one exists.

## RESPONSES

* Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

* Always ask clarifying questions
* Never assume design, tokens, or variant behavior. Check `design-reference/tokens.md` and existing components for precedent first
* Use deep-dive sub-agents to assist with research

## COMPONENT WORK

* Before adding or editing anything under `src/components/**`, follow the `component-builder` skill (`.claude/skills/component-builder/SKILL.md`) for file structure, variant pattern, and Storybook story shape
* Components live at `src/components/<Category>/<Name>/` as `{ Name.vue, Name.stories.ts, index.ts }`; after creating one, export it from `src/index.ts` under the right category
* Only use the existing categories: `LayoutNav`, `DataDisplay`, `Forms`, `Feedback`, `Charts`, `AI`
* Use semantic CSS variables / design tokens (`src/style.css`, `design-reference/tokens.md`) instead of hard-coded colors or spacing

## CHANGE / EDIT MODE

* Use the best model for the task - premium models for complex tasks (like component implementation) and mid-tier models for simpler tasks, like documentation
* After completing features (large or small), always run `pnpm lint`, `pnpm typecheck`, and `pnpm build` to check code quality

## TESTING

* Verify component changes in Storybook (`pnpm storybook`): check all variants/states render and pass the a11y addon
* Never assume your changes simply work, always test!
* Run `pnpm lint` and `pnpm typecheck` before considering a change done
