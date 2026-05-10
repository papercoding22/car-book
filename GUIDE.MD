Dưới đây là một **prompt “xịn” hơn, đầy đủ hơn** để bạn đưa cho LLM/code agent như Cursor, Claude Code, ChatGPT, Windsurf… nhằm tạo webapp quản lý xe cá nhân.

Bạn có thể copy nguyên khối này.

---

````text
Bạn là một Senior Frontend Engineer kiêm Product Designer.
Nhiệm vụ của bạn là xây dựng hoàn chỉnh một webapp quản lý xe cá nhân cho người dùng, sử dụng ReactJS, TypeScript, Vite và TailwindCSS.

# 1. Mục tiêu sản phẩm

Tạo một webapp tên tạm là “Garage Log” hoặc “My Car Garage”, cho phép người dùng:

- Thêm và quản lý thông tin xe cá nhân.
- Theo dõi chi phí theo timeline.
- Phân loại chi phí theo category thông minh, gần với cách người dùng chơi xe / chăm xe thực tế.
- Quản lý danh sách phụ tùng hiện đang lắp trên xe.
- Lưu toàn bộ dữ liệu ở Local Storage trong giai đoạn đầu.
- Thiết kế kiến trúc code sao cho sau này có thể dễ dàng thay Local Storage bằng REST API hoặc backend thật.

Ứng dụng trước tiên sẽ deploy lên GitHub Pages, sau đó có thể chuyển sang deploy trên web server khác.

# 2. Tech Stack bắt buộc

Sử dụng:

- ReactJS phiên bản mới nhất.
- TypeScript.
- Vite phiên bản mới nhất.
- React Router để quản lý pages.
- TailwindCSS.
- Một thư viện UI đẹp, hiện đại. Ưu tiên shadcn/ui hoặc Radix UI kết hợp TailwindCSS.
- Lucide React cho icons.
- ESLint cấu hình chuẩn.
- Prettier cấu hình chuẩn.
- Không dùng backend ở giai đoạn này.
- Không dùng database thật ở giai đoạn này.
- Lưu dữ liệu vào Local Storage.

# 3. Yêu cầu về routing

Dùng React Router.

Vì app sẽ deploy lên GitHub Pages trước, cần cấu hình routing phù hợp.

Ưu tiên dùng HashRouter để tránh lỗi refresh 404 trên GitHub Pages.

Thiết kế route cơ bản:

- / hoặc #/ : Dashboard
- #/cars : Danh sách xe
- #/cars/new : Thêm xe mới
- #/cars/:carId : Chi tiết xe
- #/cars/:carId/edit : Chỉnh sửa xe
- #/cars/:carId/expenses : Timeline chi phí
- #/cars/:carId/parts : Current Installed Parts
- #/settings : Cài đặt app

# 4. Kiến trúc dữ liệu

Thiết kế type/interface rõ ràng trong TypeScript.

Cần có ít nhất các entity sau:

## Car

Một chiếc xe có các thông tin:

- id
- brand: hãng xe
- model
- manufactureYear
- licensePlate
- currentOdo
- imageUrl hoặc imageBase64
- horsepower
- note
- createdAt
- updatedAt

Ví dụ:

```ts
type Car = {
  id: string;
  brand: string;
  model: string;
  manufactureYear: number;
  licensePlate: string;
  currentOdo: number;
  image?: string;
  horsepower?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};
````

## Expense

Một khoản chi phí của xe:

- id
- carId
- date
- categoryGroup
- category
- cost
- odoAtExpense
- note
- createdAt
- updatedAt

Ví dụ:

```ts
type ExpenseCategoryGroup =
  | "maintenance"
  | "mods"
  | "cosmetic"
  | "emergency"
  | "running_cost";

type Expense = {
  id: string;
  carId: string;
  date: string;
  categoryGroup: ExpenseCategoryGroup;
  category: string;
  cost: number;
  odoAtExpense?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};
```

## InstalledPart

Phụ tùng hiện đang lắp trên xe:

- id
- carId
- partName
- brand
- installedAtOdo
- currentOdoSnapshot
- installedDate
- status
- note
- createdAt
- updatedAt

Ví dụ:

```ts
type PartStatus = "active" | "replaced" | "removed" | "needs_check";

type InstalledPart = {
  id: string;
  carId: string;
  partName: string;
  brand?: string;
  installedAtOdo: number;
  currentOdoSnapshot?: number;
  installedDate?: string;
  status: PartStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
};
```

# 5. Category thông minh

Không chỉ dùng category chung chung như “bảo dưỡng” hoặc “phụ tùng”.

Cần tạo category theo tư duy người dùng thật:

```ts
const expenseCategories = {
  maintenance: {
    label: "Maintenance",
    items: [
      "Thay nhớt",
      "Lọc gió",
      "Brake pad",
      "Lốp",
      "Bugi",
      "Nước làm mát",
      "Dầu hộp số",
      "Ắc quy",
      "Vệ sinh kim phun",
      "Cân chỉnh thước lái",
    ],
  },
  mods: {
    label: "Mods",
    items: [
      "Exhaust",
      "Body kit",
      "Suspension",
      "ECU",
      "Intake",
      "Wheels",
      "Brake upgrade",
      "Turbo/Supercharger",
      "Interior mod",
    ],
  },
  cosmetic: {
    label: "Cosmetic",
    items: [
      "Wrap",
      "Detailing",
      "Ceramic coating",
      "PPF",
      "Sơn dặm",
      "Polish",
      "Đèn",
      "Tint film",
    ],
  },
  emergency: {
    label: "Emergency",
    items: [
      "Cứu hộ",
      "Sửa va quẹt",
      "Thủng lốp",
      "Hỏng máy",
      "Hỏng điện",
      "Tai nạn",
      "Khẩn cấp khác",
    ],
  },
  running_cost: {
    label: "Running Cost",
    items: [
      "Xăng",
      "Gửi xe",
      "Phí đường bộ",
      "Bảo hiểm",
      "Đăng kiểm",
      "Rửa xe",
      "Vé cao tốc",
      "Phạt giao thông",
    ],
  },
};
```

Cho phép người dùng nhập category custom nếu category có sẵn chưa phù hợp.

# 6. Tính năng chi tiết

## 6.1 Dashboard

Dashboard cần hiển thị:

- Tổng số xe đã thêm.
- Tổng chi phí toàn bộ xe.
- Tổng chi phí tháng hiện tại.
- Xe có chi phí gần đây nhất.
- Danh sách xe dạng card.
- Quick action: Add Car, Add Expense.

## 6.2 Car List

Trang danh sách xe:

- Hiển thị card từng xe.
- Có ảnh xe.
- Hãng xe, model, năm sản xuất.
- Biển số.
- ODO hiện tại.
- Tổng chi phí của xe.
- Nút xem chi tiết.
- Nút chỉnh sửa.
- Nút xóa, có confirm dialog.

## 6.3 Add/Edit Car

Form thêm/sửa xe gồm:

- Hãng xe.
- Model.
- Năm sản xuất.
- Biển số.
- ODO hiện tại.
- Ảnh xe.
- Mã lực.
- Ghi chú.

Yêu cầu:

- Validate dữ liệu cơ bản.
- ODO phải là số không âm.
- Năm sản xuất hợp lệ.
- Biển số không được rỗng.
- Preview ảnh xe nếu upload ảnh.
- Có trạng thái empty/error rõ ràng.

## 6.4 Car Detail

Trang chi tiết xe cần có:

- Header lớn với ảnh xe.
- Thông tin xe.
- ODO hiện tại.
- Mã lực.
- Tổng chi phí.
- Chi phí tháng này.
- Số phụ tùng active.
- Recent expenses.
- Current installed parts.
- Quick actions: Add Expense, Add Part, Edit Car.

## 6.5 Expense Timeline

Trang quản lý chi phí:

Hiển thị dạng timeline hoặc table đẹp:

| Date  | Category        | Cost       | ODO      | Note |
| ----- | --------------- | ---------- | -------- | ---- |
| 12/05 | Thay nhớt       | 1,000,000  | 58,200km |      |
| 18/05 | Body kit        | 12,000,000 | 58,300km |      |
| 20/05 | Ceramic coating | 5,000,000  | 58,400km |      |

Tính năng:

- Thêm chi phí.
- Sửa chi phí.
- Xóa chi phí.
- Filter theo category group.
- Filter theo tháng/năm.
- Search theo note/category.
- Sort theo ngày mới nhất.
- Hiển thị tổng chi phí theo filter hiện tại.
- Format tiền tệ theo VND.
- Format ODO theo km.

Form thêm expense gồm:

- Date.
- Category group.
- Category.
- Cost.
- ODO tại thời điểm chi.
- Note.

## 6.6 Current Installed Parts

Trang phụ tùng đang lắp:

Hiển thị table:

| Part      | Brand        | Installed At | Current ODO | Status |
| --------- | ------------ | ------------ | ----------- | ------ |
| Tire      | Michelin PS5 | 52,000km     | 58,200km    | Active |
| Brake Pad | Endless MX72 | 55,000km     | 58,200km    | Active |
| Coilover  | Tein Flex Z  | 40,000km     | 58,200km    | Active |

Tính năng:

- Thêm part.
- Sửa part.
- Xóa part.
- Đổi status: Active, Replaced, Removed, Needs Check.
- Filter theo status.
- Tự động hiển thị số km đã sử dụng của part:
  currentOdo - installedAtOdo

Ví dụ:

```text
Michelin PS5 đã chạy 6,200km
```

## 6.7 Settings

Trang settings đơn giản:

- Export data ra file JSON.
- Import data từ file JSON.
- Clear all data, có confirm dialog.
- Hiển thị version app.
- Gợi ý rằng dữ liệu hiện đang lưu local trên thiết bị.

# 7. Local Storage Architecture

Không viết logic Local Storage rải rác trong component.

Cần tạo abstraction layer rõ ràng, ví dụ:

```text
src/
  services/
    storage/
      storageAdapter.ts
      localStorageAdapter.ts
    repositories/
      carRepository.ts
      expenseRepository.ts
      partRepository.ts
```

Yêu cầu thiết kế:

- Component không gọi trực tiếp localStorage.
- Repository gọi storage adapter.
- Sau này có thể thay Local Storage bằng API bằng cách implement adapter mới.
- Dữ liệu nên được lưu theo một root key, ví dụ:

```ts
const STORAGE_KEY = "garage_log_data";
```

Cấu trúc dữ liệu Local Storage:

```ts
type AppData = {
  cars: Car[];
  expenses: Expense[];
  installedParts: InstalledPart[];
  schemaVersion: number;
};
```

Cần có helper:

- getAppData()
- saveAppData()
- resetAppData()
- exportData()
- importData()
- migrateDataIfNeeded()

# 8. Cấu trúc thư mục đề xuất

Tạo cấu trúc thư mục sạch, dễ scale:

```text
src/
  app/
    App.tsx
    router.tsx
  components/
    common/
    layout/
    ui/
  features/
    cars/
      components/
      pages/
      hooks/
      car.types.ts
      car.repository.ts
    expenses/
      components/
      pages/
      hooks/
      expense.types.ts
      expense.repository.ts
      expenseCategories.ts
    parts/
      components/
      pages/
      hooks/
      part.types.ts
      part.repository.ts
  services/
    storage/
      storageAdapter.ts
      localStorageAdapter.ts
  utils/
    formatCurrency.ts
    formatDate.ts
    formatOdo.ts
    id.ts
  styles/
    globals.css
  main.tsx
```

# 9. UI/UX yêu cầu

Thiết kế giao diện hiện đại, sạch, dễ dùng.

Phong cách:

- Garage / automotive vibe.
- Dark mode friendly.
- Card layout đẹp.
- Responsive tốt trên mobile.
- Ưu tiên mobile-first.
- Dùng icon hợp lý.
- Empty state rõ ràng.

Ví dụ empty state:

```text
Chưa có xe nào trong garage.
Thêm chiếc xe đầu tiên của bạn để bắt đầu tracking chi phí và phụ tùng.
```

Các yếu tố UI nên có:

- Sidebar hoặc top navigation.
- Card.
- Badge.
- Button.
- Dialog/Modal.
- Table.
- Tabs.
- Dropdown.
- Toast notification.
- Confirm dialog.
- Form validation message.
- Skeleton/loading state nếu phù hợp.

# 10. State Management

Không cần Redux nếu app còn nhỏ.

Có thể dùng:

- React hooks.
- Context API nếu cần.
- Custom hooks theo feature.

Ví dụ:

- useCars()
- useCar(carId)
- useExpenses(carId)
- useParts(carId)

Các hook nên gọi repository thay vì gọi Local Storage trực tiếp.

# 11. Validation

Có thể dùng Zod hoặc tự validate bằng TypeScript.

Ưu tiên dùng Zod cho form validation nếu phù hợp.

Validate:

- Required fields.
- Number fields.
- Date hợp lệ.
- Cost phải >= 0.
- ODO phải >= 0.
- Manufacture year hợp lý.
- License plate không rỗng.

# 12. Formatting

Cần có utility format:

```ts
formatCurrency(1000000); // "1.000.000 ₫"
formatOdo(58200); // "58,200 km"
formatDate("2025-05-12"); // "12/05/2025"
```

# 13. Seed/demo data

Tạo một số dữ liệu demo nếu Local Storage trống trong môi trường development.

Ví dụ:

Car:

- Toyota GR86
- 2022
- 51K-888.88
- 58,200 km
- 235 hp

Expenses:

- 12/05: Thay nhớt - 1,000,000
- 18/05: Body kit - 12,000,000
- 20/05: Ceramic coating - 5,000,000

Installed Parts:

- Tire - Michelin PS5 - Installed at 52,000 km - Active
- Brake Pad - Endless MX72 - Installed at 55,000 km - Active
- Coilover - Tein Flex Z - Installed at 40,000 km - Active

# 14. GitHub Pages deployment

Cần cấu hình để build và deploy được lên GitHub Pages.

Yêu cầu:

- Vite config phù hợp với GitHub Pages.
- Dùng HashRouter để tránh lỗi refresh route.
- Thêm script build.
- Thêm hướng dẫn deploy bằng gh-pages hoặc GitHub Actions.

Nếu dùng package gh-pages, thêm script ví dụ:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "deploy": "gh-pages -d dist"
  }
}
```

# 15. Code quality

Yêu cầu:

- Code TypeScript rõ ràng.
- Không dùng any bừa bãi.
- Component nhỏ, dễ đọc.
- Tách logic ra hooks/repository/utils.
- Không hard-code quá nhiều trong component.
- Tạo constants cho category, routes, storage key.
- Có error handling cơ bản.
- Có confirm trước khi xóa dữ liệu.
- Có README.md hướng dẫn chạy project.

# 16. Output mong muốn từ bạn

Hãy tạo toàn bộ project hoàn chỉnh.

Trước khi code, hãy trình bày ngắn gọn:

1. Tech stack sẽ dùng.
2. Cấu trúc thư mục.
3. Data model chính.
4. Routing plan.

Sau đó hãy tạo code đầy đủ cho từng file quan trọng.

Nếu môi trường cho phép tạo file trực tiếp, hãy tạo toàn bộ file project.

Nếu không thể tạo file trực tiếp, hãy xuất code theo từng file với format:

```text
// File: src/...
```

Đảm bảo project có thể chạy bằng:

```bash
npm install
npm run dev
```

Và build được bằng:

```bash
npm run build
```

# 17. Ưu tiên triển khai theo thứ tự

Nếu không thể làm tất cả trong một lần, hãy triển khai theo thứ tự:

1. Setup Vite + React + TypeScript + TailwindCSS.
2. Setup Router.
3. Tạo layout chính.
4. Tạo data models.
5. Tạo storage adapter + repositories.
6. Tạo Dashboard.
7. Tạo CRUD Cars.
8. Tạo CRUD Expenses.
9. Tạo CRUD Installed Parts.
10. Tạo Settings export/import data.
11. Polish UI/UX.
12. README + deployment instructions.

# 18. Một số chi tiết sản phẩm nên tự động cải thiện

Hãy chủ động thêm các tính năng nhỏ nếu thấy hợp lý:

- Total cost per car.
- Cost by category.
- Recent activity.
- Km used per installed part.
- Search/filter/sort.
- Empty state.
- Toast notification.
- Confirm dialog.
- Responsive mobile layout.
- Data export/import JSON.
- Schema version cho Local Storage.
- Error boundary cơ bản nếu cần.

# 19. Ngôn ngữ hiển thị

Giao diện app ưu tiên tiếng Việt, nhưng tên biến/code vẫn dùng tiếng Anh.

Ví dụ UI text:

- “Thêm xe”
- “Chi phí”
- “Phụ tùng đang lắp”
- “Tổng chi phí”
- “ODO hiện tại”
- “Xuất dữ liệu”
- “Nhập dữ liệu”
- “Xóa toàn bộ dữ liệu”

# 20. Kết quả cuối cùng

Kết quả cần là một webapp hoàn chỉnh, có thể chạy local, build production, và deploy GitHub Pages.

Đừng chỉ tạo mockup tĩnh. Cần có CRUD thật với Local Storage.

````

---

Bạn cũng có thể dùng phiên bản **ngắn gọn hơn** nếu dùng với AI coding agent đã mạnh như Cursor/Windsurf:

```text
Build a complete React + TypeScript + Vite webapp named “Garage Log” for managing personal cars, expenses, and installed parts.

Requirements:
- React latest, TypeScript, Vite latest.
- React Router with HashRouter because the app will first be deployed to GitHub Pages.
- TailwindCSS + shadcn/ui or Radix UI + lucide-react.
- ESLint + Prettier configured.
- Data saved in Local Storage, but architecture must be adapter/repository based so Local Storage can later be replaced by an API.
- Mobile-first responsive UI.
- Vietnamese UI text, English code names.

Core features:
1. Car CRUD:
   - brand
   - model
   - manufactureYear
   - licensePlate
   - currentOdo
   - image
   - horsepower
   - note

2. Expense Timeline CRUD:
   Fields:
   - date
   - categoryGroup
   - category
   - cost
   - odoAtExpense
   - note

   Category groups:
   - Maintenance: Thay nhớt, Lọc gió, Brake pad, Lốp, Bugi, Nước làm mát, Dầu hộp số
   - Mods: Exhaust, Body kit, Suspension, ECU, Intake, Wheels, Brake upgrade
   - Cosmetic: Wrap, Detailing, Ceramic coating, PPF, Sơn dặm, Polish
   - Emergency: Cứu hộ, Sửa va quẹt, Thủng lốp, Hỏng máy, Tai nạn
   - Running Cost: Xăng, Gửi xe, Phí đường bộ, Bảo hiểm, Đăng kiểm, Rửa xe, Vé cao tốc

   Allow custom category input.

3. Current Installed Parts CRUD:
   Fields:
   - partName
   - brand
   - installedAtOdo
   - currentOdoSnapshot
   - installedDate
   - status: active, replaced, removed, needs_check
   - note

   Display km used = car.currentOdo - installedAtOdo.

Pages:
- Dashboard
- Cars list
- Add car
- Edit car
- Car detail
- Expense timeline
- Installed parts
- Settings

Dashboard should show:
- Total cars
- Total expenses
- Expenses this month
- Recent expenses
- Car cards
- Quick actions

Settings should support:
- Export JSON
- Import JSON
- Clear all data with confirmation
- App version

Architecture:
- Do not call localStorage directly inside components.
- Create storage adapter and repositories.
- Suggested structure:

src/
  app/
    App.tsx
    router.tsx
  components/
    common/
    layout/
    ui/
  features/
    cars/
    expenses/
    parts/
  services/
    storage/
      storageAdapter.ts
      localStorageAdapter.ts
  utils/
    formatCurrency.ts
    formatDate.ts
    formatOdo.ts
    id.ts

Local storage root data:

type AppData = {
  cars: Car[];
  expenses: Expense[];
  installedParts: InstalledPart[];
  schemaVersion: number;
};

Add utilities:
- formatCurrency
- formatDate
- formatOdo
- generateId

Add demo data in development when storage is empty:
- Toyota GR86 2022, plate 51K-888.88, 58,200km, 235hp
- Expenses: Thay nhớt 1,000,000; Body kit 12,000,000; Ceramic coating 5,000,000
- Parts: Michelin PS5, Endless MX72, Tein Flex Z

Before coding, explain briefly:
1. Tech stack
2. Folder structure
3. Data model
4. Routing plan

Then generate the full project code file by file. Make sure it can run with:
npm install
npm run dev

And build with:
npm run build

Also include README with GitHub Pages deployment instructions.
````

---
