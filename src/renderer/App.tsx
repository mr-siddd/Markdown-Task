import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import { logout } from './firebase';
import './App.css';

interface Note {
  id: string;
  title: string;
  content: string;
  updated: number;
}

const MarkdownApp: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [dark, setDark] = useState(false);

  const currentNote = notes.find(n => n.id === currentId) || null;

  const persist = async (updated: Note[]) => {
    setNotes(updated);
    await window.electronAPI.saveNotes(updated);
  };

  const newNote = () => {
    const n: Note = {
      id: Date.now().toString(),
      title: `Untitled ${notes.length + 1}`,
      content: '',
      updated: Date.now()
    };
    persist([...notes, n]);
    setCurrentId(n.id);
    setMarkdown('');
  };

  const saveNote = async () => {
    if (!currentNote) return;
    const upd = notes.map(n =>
      n.id === currentId ? { ...n, content: markdown, updated: Date.now() } : n,
    );
    await persist(upd);
  };

  const deleteNote = async () => {
    if (!currentId) return;
    const upd = notes.filter(n => n.id !== currentId);
    setCurrentId(null);
    setMarkdown('');
    await persist(upd);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const stored = await window.electronAPI.loadNotes();
        setNotes(stored);
        if (stored[0]) {
          setCurrentId(stored[0].id);
          setMarkdown(stored[0].content);
        }
      })();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className={dark ? 'dark app' : 'app'}>
      <header className="app-header">
        <h1>MarkDesk</h1>
        <div className="user-info">
          <span>Welcome, {currentUser.displayName || currentUser.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="toolbar">
        <button onClick={newNote}>➕ New</button>
        <button onClick={saveNote} disabled={!currentId}>💾 Save</button>
        <button onClick={deleteNote} disabled={!currentId}>🗑 Delete</button>
        <span className="spacer" />
        <label className="toggle">
          🌞
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
          🌜
        </label>
      </nav>

      <section className="pane">
        <textarea
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          placeholder="Write Markdown here…"
        />
        <div className="preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </section>

      <footer className="status">
        {currentNote
          ? `✏️ ${currentNote.title}  •  Last saved ${new Date(
              currentNote.updated,
            ).toLocaleTimeString()}`
          : 'No note selected'}
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MarkdownApp />
    </AuthProvider>
  );
}
