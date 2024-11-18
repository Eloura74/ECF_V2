import React, { useState } from 'react';
import { Search, Book, FileText, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { marked } from 'marked';
import { useAuthStore } from '../stores/authStore';
import 'highlight.js/styles/github.css';

interface DocSection {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export default function Documentation() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocSection | null>(null);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showDeleteDocModal, setShowDeleteDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [docs, setDocs] = useState<DocSection[]>([
    {
      id: '1',
      title: 'Guide de Démarrage',
      content: `# Guide de Démarrage\n\n## Introduction\nBienvenue sur DevCollab !`,
      category: 'Développement',
      tags: ['débutant', 'guide']
    },
    {
      id: '2',
      title: 'Guide du Contributeur',
      content: `# Guide du Contributeur\n\n## Comment Contribuer\n1. Fork le projet`,
      category: 'Développement',
      tags: ['contribution', 'opensource']
    }
  ]);

  const handleEditDoc = (doc: DocSection) => {
    if (user?.role === 'admin') {
      setSelectedDoc(doc);
      setNewDoc({
        title: doc.title,
        content: doc.content,
        category: doc.category,
        tags: doc.tags.join(', ')
      });
      setShowNewDocModal(true);
    }
  };

  const handleDeleteDoc = (doc: DocSection) => {
    if (user?.role === 'admin') {
      setSelectedDoc(doc);
      setShowDeleteDocModal(true);
    }
  };

  const confirmDeleteDoc = () => {
    if (selectedDoc && user?.role === 'admin') {
      setDocs(docs.filter(d => d.id !== selectedDoc.id));
      setShowDeleteDocModal(false);
      setSelectedDoc(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowNewDocModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Documentation
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <nav className="space-y-1">
            {docs
              .filter(doc => 
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    selectedDoc?.id === doc.id
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  {doc.title}
                </button>
              ))}
          </nav>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow">
          {selectedDoc ? (
            <div className="p-6">
              {user?.role === 'admin' && (
                <div className="flex justify-end space-x-2 mb-4">
                  <button
                    onClick={() => handleEditDoc(selectedDoc)}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(selectedDoc)}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </button>
                </div>
              )}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked(selectedDoc.content, { breaks: true })
                }}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedDoc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Book className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Sélectionnez un document
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Choisissez un document dans la liste pour commencer.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création/édition de documentation */}
      {showNewDocModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedDoc ? 'Modifier la documentation' : 'Créer une nouvelle documentation'}
              </h2>
              <button onClick={() => setShowNewDocModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const docData = {
                id: selectedDoc?.id || Date.now().toString(),
                title: newDoc.title,
                content: newDoc.content,
                category: newDoc.category,
                tags: newDoc.tags.split(',').map(tag => tag.trim())
              };
              
              if (selectedDoc) {
                setDocs(docs.map(d => d.id === selectedDoc.id ? docData : d));
              } else {
                setDocs([...docs, docData]);
              }
              
              setShowNewDocModal(false);
              setNewDoc({ title: '', content: '', category: '', tags: '' });
              setSelectedDoc(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({...newDoc, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newDoc.tags}
                    onChange={(e) => setNewDoc({...newDoc, tags: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contenu (Markdown)
                  </label>
                  <textarea
                    required
                    rows={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
                    value={newDoc.content}
                    onChange={(e) => setNewDoc({...newDoc, content: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {selectedDoc ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteDocModal && selectedDoc && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Supprimer la documentation</h2>
              <button onClick={() => setShowDeleteDocModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer la documentation "{selectedDoc.title}" ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDocModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteDoc}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}