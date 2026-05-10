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

### Cách 1: Tự deploy bằng gh-pages

1. Cập nhật `vite.config.ts` nếu cần base path riêng cho repo.
2. Chạy deploy (tự build trước khi deploy):

```bash
npm run deploy
```

### Cách 2: Deploy tự động bằng GitHub Actions (đã setup sẵn)

1. Push code lên branch `main`.
2. Vào GitHub repo -> `Settings` -> `Pages`.
3. Ở mục `Build and deployment`, chọn `Source = GitHub Actions`.
4. Workflow `Deploy to GitHub Pages` sẽ tự build và publish mỗi lần push `main`.

Workflow file: `.github/workflows/deploy-pages.yml`

## URL GitHub Pages

Sau khi deploy, app thường có URL dạng:

`https://papercoding22.github.io/car-book/`

## Firebase config

Project đã hỗ trợ đọc Firebase config từ biến môi trường.

1. Copy `.env.example` thành `.env`.
2. Điền các giá trị `VITE_FIREBASE_*` trong `.env`.

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Nếu deploy bằng GitHub Actions, thêm các secret cùng tên trong
`Settings -> Secrets and variables -> Actions`.

Workflow `deploy-pages.yml` đã map sẵn các secret này vào env khi build.

## Analytics (GA4)

Nếu dùng GA4, thêm:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
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
