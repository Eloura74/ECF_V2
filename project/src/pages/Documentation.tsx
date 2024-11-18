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
    },
    {
      id: '3',
      title: 'Introduction au HTML5',
      content: `# Guide du Contributeur\n\n## Qu'est-ce que le HTML\nHTML (HyperText Markup Language) est un langage de balisage hypertexte utilisé principalement pour créer des documents sur Internet. HTML a commencé son parcours au début des années 90 en tant que langage primitif pour créer des pages Web, et à l'heure actuelle, il est difficile d'imaginer Internet sans HTML. La grande majorité des sites Web utilisent HTML d'une manière ou d'une autre.

En 2014, les travaux sur une nouvelle norme ont été officiellement achevés - HTML5, qui a en fait créé une révolution en apportant de nombreuses nouveautés au HTML.

Qu'a apporté exactement HTML5 ?

HTML5 définit un nouvel algorithme d'analyse pour créer la structure DOM

ajouter de nouveaux éléments et balises, tels que elements video, audioet un certain nombre d'autres

redéfinir les règles et la sémantique des éléments HTML préexistants

En fait, avec l'ajout de nouvelles fonctions, HTML5 est devenu non seulement une nouvelle version du langage de balisage pour créer des pages Web, mais en fait une plate-forme de création d'applications, et la portée de son utilisation s'est étendue bien au-delà de l'environnement Web Internet : HTML5 est également utilisé pour créer des applications mobiles pour Android, iOS, Windows Mobile et même pour créer des applications de bureau pour les ordinateurs classiques (en particulier sous Windows 8/8.1/10).

En conséquence, en règle générale, HTML 5 est utilisé principalement dans deux sens :

HTML 5 en tant que langage de balisage hypertexte mis à jour, quelques développements de la version précédente de HTML 4

HTML 5 en tant que plate-forme puissante pour créer des applications Web, qui comprend non seulement le langage de balisage hypertexte lui-même, le HTML mis à jour, mais également le langage de programmation JavaScript et les feuilles de style en cascade CSS 3.

Qui est responsable du développement de HTML5 ? Ceci est fait par le World Wide Web Consortium (en abrégé W3C - World Wide Web Consortium) - une organisation internationale indépendante qui définit la norme HTML5 sous forme de spécifications. La spécification complète actuelle en anglais peut être consultée sur https://www.w3.org/TR/html5/ . Et il convient de noter que l'organisation continue de travailler sur HTML5, en publiant des mises à jour de la spécification.

Prise en charge du navigateur
Il convient de noter qu'il y a toujours eu un écart entre la spécification HTML5 et l'utilisation de cette technologie dans les navigateurs Web. La plupart des navigateurs ont commencé à implémenter les normes HTML5 avant même leur publication officielle. Et désormais, la plupart des dernières versions des navigateurs prennent en charge la plupart des fonctionnalités HTML5 (Google Chrome, Firefox, Opera, Internet Explorer 11, Microsoft Edge). Dans le même temps, de nombreux navigateurs plus anciens, tels qu'Internet Explorer 8 et les versions antérieures, ne prennent pas en charge les normes, et IE 9, 10 ne les prend en charge que partiellement.

Cependant, même les navigateurs qui prennent généralement en charge les normes peuvent ne pas prendre en charge certaines fonctionnalités spécifiques. Et cela doit aussi être pris en compte dans le travail. Mais en général, la situation en matière de support de cette technologie est plutôt bonne.

Pour vérifier la prise en charge HTML5 pour un navigateur spécifique, vous pouvez utiliser un service spécial http://html5test.com .

Outils requis
De quoi avez-vous besoin pour travailler avec HTML5 ? Tout d'abord, un éditeur de texte pour taper le texte des pages web en html. À l'heure actuelle, l'un des éditeurs de texte les plus simples et les plus populaires est Notepad++ , disponible sur http://notepad-plus-plus.org/ . Ses avantages incluent la gratuité et la mise en évidence des balises HTML. À l'avenir, je me concentrerai sur cet éditeur de texte.

Il convient également de mentionner l'éditeur de texte multiplateforme Visual Studio Code . Cet éditeur a des capacités légèrement supérieures à celles de Notepad++ et, en plus, il peut fonctionner non seulement sous Windows, mais également sur les systèmes d'exploitation basés sur MacOS et Linux.

Et vous aurez également besoin d'un navigateur Web pour lancer et vérifier les pages Web écrites. En tant que navigateur Web, vous pouvez utiliser la dernière version de l'un des navigateurs courants : Google Chrome, Mozilla Firefox, Microsoft Edge, Opera.`,
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