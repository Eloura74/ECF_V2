import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Chat from './pages/Chat';
import AIAssistant from './pages/AIAssistant';
import Documentation from './pages/Documentation';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { useAuthStore } from './stores/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-indigo-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projets" element={<Projects />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;