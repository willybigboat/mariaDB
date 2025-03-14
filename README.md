# MariaDB 座位預約系統 Demo

這是一個使用 MariaDB 資料庫的座位預約系統示範專案。

## 專案結構

- `/mariadbDemo` - 後端服務器 (Node.js, Express, TypeScript)
- `/Front` - 前端應用 (React, TypeScript, Vite)

## 功能模塊

- 座位預約管理
- 學生資訊管理
- 時段管理

## 快速開始

### 後端設置

1. 進入後端目錄
   ```
   cd mariadbDemo
   ```

2. 安裝依賴
   ```
   npm install
   ```

3. 創建 `.env` 檔案，參考 `.env.example`

4. 編譯並啟動後端伺服器
   ```
   npm run dev
   ```

### 前端設置

1. 進入前端目錄
   ```
   cd Front
   ```

2. 安裝依賴
   ```
   npm install
   ```

3. 啟動開發伺服器
   ```
   npm run dev
   ```

## 資料庫設計

系統使用 MariaDB 資料庫，主要表結構包括：

- Reservations (預約記錄)
- Students (學生資訊)
- Seats (座位資訊)
- Timeslots (時段資訊)
