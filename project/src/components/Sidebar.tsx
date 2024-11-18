import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FolderGit2, MessageSquare, Bot, BookOpen, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', icon: Home, href: '/' },
    { name: 'Projets', icon: FolderGit2, href: '/projets' },
    { name: 'Groupes & Discussions', icon: MessageSquare, href: '/chat' },
    { name: 'Assistant IA', icon: Bot, href: '/assistant' },
    { name: 'Documentation', icon: BookOpen, href: '/documentation' },
  ];

  return (
    <>
      {/* Bouton mobile pour ouvrir/fermer la sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-40 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col w-64 h-full">
          <div className="flex flex-col h-full bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-white">DevCollab</h1>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <Link
                to="/profile"
                className="flex-shrink-0 w-full group block"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <div className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Photo de profil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Mon Profil</p>
                    <p className="text-xs font-medium text-gray-300">Paramètres</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}