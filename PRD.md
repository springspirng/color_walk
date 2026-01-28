# Product Requirements Document (PRD) - Prismatic Slots

## 1. 專案概述 (Project Overview)
**Prismatic Slots** 是一個基於網頁的互動式顏色角子老虎機應用程式。使用者可以點擊按鈕進行拉霸，系統將以物理模擬的動畫效果隨機選出一個顏色（紅、橙、黃、綠、藍、紫）。該專案旨在展示現代前端技術（React + Tailwind CSS）在無需複雜構建工具（No Build Step）環境下的互動能力與視覺效果。

## 2. 技術架構與環境 (Tech Stack & Environment)

### 2.1 核心技術
*   **Frontend Framework:** React 19 (透過 esm.sh 引入)
*   **Styling:** Tailwind CSS (透過 CDN 引入)
*   **Icons:** Lucide React (透過 esm.sh 引入)
*   **Module System:** Native ES Modules (瀏覽器原生支援)

### 2.2 運行環境
*   **瀏覽器相容性:** 需支援 ES Modules 與 Import Maps 的現代瀏覽器 (Chrome, Edge, Firefox, Safari)。
*   **依賴管理:** 使用 HTML `<script type="importmap">` 進行套件版本控制，無需 Node.js `node_modules` 或 Webpack/Vite 打包。

### 2.3 檔案結構
*   `index.html`: 應用程式入口，包含 Tailwind CDN 與 Import Maps 定義。
*   `index.tsx`: React 掛載點。
*   `App.tsx`: 主應用程式佈局與狀態管理。
*   `components/`: 包含 UI 組件 (`SlotReel`, `Confetti`, `IconRenderer`)。
*   `constants.tsx`: 定義顏色資料與動畫參數。
*   `types.ts`: TypeScript 介面定義。

## 3. 功能需求 (Functional Requirements)

### 3.1 核心功能
1.  **隨機抽獎 (RNG Spin):**
    *   使用者點擊 "Spin to Win" 按鈕觸發。
    *   系統透過 `Math.random()` 從 6 種顏色中隨機選取一個獲勝者。
    *   包含防連點機制：旋轉期間按鈕鎖定 (Disabled)。

2.  **滾輪動畫 (Slot Reel Animation):**
    *   **視覺暫留機制:** 透過無縫重置位置 (Position Reset) 創造無限滾動的視覺錯覺。
    *   **物理緩動:** 使用 CSS `cubic-bezier(0.25, 1, 0.5, 1)` 模擬真實滾輪的減速煞車效果。
    *   **旋轉時間:** 固定為 3000ms (`SPIN_DURATION`)。
    *   **最小圈數:** 確保至少旋轉 5 圈 (`MIN_LOOPS`) 後才停在結果上。

3.  **獲勝慶祝 (Victory Effects):**
    *   **彩帶特效 (Confetti):** 當動畫停止並顯示結果時，觸發 Canvas 粒子系統，噴發與獲勝顏色相對應的彩帶。
    *   **結果公告:** 顯示獲勝顏色的名稱、圖示與專屬標語 (Message)。

### 3.2 顏色選項配置
系統包含以下 6 種固定選項：
1.  **Red (熱情紅):** Icon: Flame, 寓意: Passion & Energy
2.  **Orange (活力橙):** Icon: Sun, 寓意: Creativity & Joy
3.  **Yellow (希望黃):** Icon: Zap, 寓意: Optimism & Intellect
4.  **Green (幸運綠):** Icon: Leaf, 寓意: Growth & Harmony
5.  **Blue (自由藍):** Icon: Droplets, 寓意: Trust & Peace
6.  **Purple (神秘紫):** Icon: Crown, 寓意: Luxury & Ambition

## 4. UI/UX 設計細節 (Design Specifications)

### 4.1 視覺風格 (Visual Style)
*   **主題:** 深色模式 (Dark Mode)，背景色 `#0f172a` (Slate 900)。
*   **裝飾:** 背景使用高斯模糊 (Gaussian Blur) 的動態光暈 (Purple/Blue gradients)。
*   **質感:** 採用 Glassmorphism (毛玻璃) 效果與豐富的陰影 (Shadows) 來營造立體感。
*   **字體:** 使用 Google Fonts 'Outfit'，呈現現代幾何風格。

### 4.2 組件細節
*   **老虎機視窗:**
    *   具有 3D 透視感 (Perspective)。
    *   上下緣具備反光遮罩 (Gradient Overlay) 模擬玻璃曲面。
    *   當選中時，獲勝方塊會放大 (`scale-110`) 並發光。
*   **操作按鈕:**
    *   **閒置狀態:** 漸層靛藍色，帶有 3D 按壓陰影 (`shadow-[0_8px_0_...]`)，懸停時有微微浮動動畫。
    *   **旋轉中狀態:** 變灰 (`bg-slate-700`)，顯示 Loading Spinner，按鈕下沉。

## 5. 資料結構 (Data Structure)

### ColorOption Interface
```typescript
export interface ColorOption {
  id: string;      // 唯一識別碼 (e.g., 'red')
  name: string;    // 顯示名稱 (e.g., '熱情紅 (Red)')
  twBg: string;    // Tailwind 背景類別 (e.g., 'bg-red-500')
  twText: string;  // Tailwind 文字類別
  hex: string;     // 十六進位色碼 (用於 Canvas 粒子)
  icon: string;    // Lucide Icon 名稱字串
  message: string; // 獲勝標語
}
```

## 6. 部署與執行 (Deployment)

由於本專案不依賴 Node.js 建置流程，可直接部署於任何靜態網頁託管服務 (GitHub Pages, Vercel, Netlify)。

### 本地開發
1.  確保資料夾結構完整。
2.  使用 VS Code 的 "Live Server" 或 `python -m http.server` 啟動。
3.  開啟瀏覽器訪問 `index.html`。

### GitHub 部署注意事項
*   確保所有檔案路徑為相對路徑 (`./`)。
*   由於使用 esm.sh，需確保客戶端網路能存取該 CDN。
