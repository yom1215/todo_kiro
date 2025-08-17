# Todo管理アプリ

React + FastAPI + SQLiteで構築されたTodo管理アプリケーションです。

## プロジェクト構成

```
app/
├── frontend/          # Reactフロントエンド
│   ├── src/
│   │   ├── App.jsx    # メインコンポーネント
│   │   ├── main.jsx   # エントリーポイント
│   │   └── index.css  # スタイル
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── backend/           # FastAPIバックエンド
    ├── main.py        # APIサーバー
    └── requirements.txt
```

## 機能

- Todoの一覧表示（期限順でソート）
- 新しいTodoの追加
- Todoの完了/未完了の切り替え
- 期限切れのTodoのハイライト表示
- 完了したTodoの取り消し線表示

## セットアップ

### バックエンド（FastAPI）

```bash
cd app/backend
pip install -r requirements.txt
python main.py
```

サーバーは http://localhost:8000 で起動します。

### フロントエンド（React）

```bash
cd app/frontend
npm install
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## 使用技術

- **フロントエンド**: React 18, Vite, Axios
- **バックエンド**: FastAPI, SQLite, Pydantic
- **スタイリング**: CSS3

## API エンドポイント

- `GET /api/todos` - Todo一覧取得
- `POST /api/todos` - 新しいTodo作成
- `PUT /api/todos/{id}` - Todo更新（完了状態の変更）