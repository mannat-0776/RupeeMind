# Contributing to RupeeMind

We welcome contributions to RupeeMind! Please follow these standards to ensure quality, security, and stability across the platform.

---

## Code Quality Standards

1. **Strict TypeScript**:
   - Ensure all files pass `npm run lint` (`tsc --noEmit`).
   - Never use `any` unless strictly typing unknown external API payloads.
   - Define shared interfaces in `src/types/index.ts`.

2. **Styling & UI**:
   - Adhere strictly to **Material Design 3** guidelines.
   - Use Tailwind CSS classes alongside MUI themes.
   - Respect light/dark mode design tokens.

3. **Financial Math & Intelligence**:
   - Financial figures must be rounded to nearest integer or 2 decimal places.
   - Currency formatters in `src/utils/formatters.ts` must be used for all user-facing monetary displays.

4. **Testing Requirements**:
   - Any new SMS parser format or regex rule must have a corresponding test case in `src/__tests__/smsParser.test.ts`.
   - Run `npx vitest run` before creating a pull request.

---

## Development Workflow

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Make your modifications and run tests:
   ```bash
   npm run lint
   npx vitest run
   ```
3. Commit with conventional commit messages:
   ```bash
   git commit -m "feat(ai): add ICICI credit card cashback parser format"
   ```
4. Push and open a Pull Request.
