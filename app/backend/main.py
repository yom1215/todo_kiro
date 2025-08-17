from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date
import sqlite3
import json
from typing import List, Optional

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベース初期化
def init_db():
    conn = sqlite3.connect('todos.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            due_date DATE NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Pydanticモデル
class TodoCreate(BaseModel):
    content: str
    due_date: date

class TodoUpdate(BaseModel):
    completed: bool

class Todo(BaseModel):
    id: int
    content: str
    due_date: date
    completed: bool
    created_at: datetime

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/api/todos", response_model=List[Todo])
async def get_todos():
    conn = sqlite3.connect('todos.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, content, due_date, completed, created_at 
        FROM todos 
        ORDER BY due_date ASC, created_at ASC
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    todos = []
    for row in rows:
        todos.append({
            "id": row[0],
            "content": row[1],
            "due_date": row[2],
            "completed": bool(row[3]),
            "created_at": row[4]
        })
    return todos

@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate):
    conn = sqlite3.connect('todos.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO todos (content, due_date) 
        VALUES (?, ?)
    ''', (todo.content, todo.due_date))
    todo_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute('''
        SELECT id, content, due_date, completed, created_at 
        FROM todos WHERE id = ?
    ''', (todo_id,))
    row = cursor.fetchone()
    conn.close()
    
    return {
        "id": row[0],
        "content": row[1],
        "due_date": row[2],
        "completed": bool(row[3]),
        "created_at": row[4]
    }

@app.put("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_update: TodoUpdate):
    conn = sqlite3.connect('todos.db')
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE todos SET completed = ? WHERE id = ?
    ''', (todo_update.completed, todo_id))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Todo not found")
    
    conn.commit()
    
    cursor.execute('''
        SELECT id, content, due_date, completed, created_at 
        FROM todos WHERE id = ?
    ''', (todo_id,))
    row = cursor.fetchone()
    conn.close()
    
    return {
        "id": row[0],
        "content": row[1],
        "due_date": row[2],
        "completed": bool(row[3]),
        "created_at": row[4]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)