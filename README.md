# Garage Log

Webapp quản lý xe cá nhân, theo dõi chi phí và phụ tùng đang lắp.

## Tech stack

- React + TypeScript + Vite
- TailwindCSS
- React Router (HashRouter)
- Zod validation
- Lucide icons
- Local Storage theo mô hình adapter/repository

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Deploy GitHub Pages

1. Cập nhật `vite.config.ts` nếu cần base path riêng cho repo.
2. Build app:

```bash
npm run build
```

3. Deploy lên `gh-pages` branch:

```bash
npm run deploy
```

## Cấu trúc chính

```text
src/
  app/
  components/
  features/
    cars/
    expenses/
    parts/
    dashboard/
    settings/
  services/storage/
  utils/
  styles/
```

## Data model

```ts
type AppData = {
  cars: Car[]
  expenses: Expense[]
  installedParts: InstalledPart[]
  schemaVersion: number
}
```
