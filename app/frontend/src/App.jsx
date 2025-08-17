import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = '/api'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTodo, setNewTodo] = useState({
    content: '',
    due_date: ''
  })

  // Todoリストを取得
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`)
      setTodos(response.data)
    } catch (error) {
      console.error('Todoの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  // 新しいTodoを作成
  const createTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.content.trim() || !newTodo.due_date) {
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, newTodo)
      setTodos([...todos, response.data])
      setNewTodo({ content: '', due_date: '' })
    } catch (error) {
      console.error('Todoの作成に失敗しました:', error)
    }
  }

  // Todoの完了状態を更新
  const toggleTodo = async (todoId, completed) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${todoId}`, {
        completed: !completed
      })
      setTodos(todos.map(todo => 
        todo.id === todoId ? response.data : todo
      ))
    } catch (error) {
      console.error('Todoの更新に失敗しました:', error)
    }
  }

  // 期限が過ぎているかチェック
  const isOverdue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    return due < today
  }

  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    })
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Todo管理</h1>
      </header>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            まだTodoがありません。下のフォームから追加してください。
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <div className={`todo-content ${todo.completed ? 'completed' : ''}`}>
                {todo.content}
              </div>
              <div className={`todo-due-date ${isOverdue(todo.due_date) && !todo.completed ? 'overdue' : ''}`}>
                {formatDate(todo.due_date)}
              </div>
            </div>
          ))
        )}
      </div>

      <form className="todo-form" onSubmit={createTodo}>
        <div className="form-group">
          <label htmlFor="content">タスク内容</label>
          <textarea
            id="content"
            value={newTodo.content}
            onChange={(e) => setNewTodo({...newTodo, content: e.target.value})}
            placeholder="新しいタスクを入力してください"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="due_date">期限</label>
          <input
            type="date"
            id="due_date"
            value={newTodo.due_date}
            onChange={(e) => setNewTodo({...newTodo, due_date: e.target.value})}
            required
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!newTodo.content.trim() || !newTodo.due_date}
        >
          新規作成
        </button>
      </form>
    </div>
  )
}

export default App