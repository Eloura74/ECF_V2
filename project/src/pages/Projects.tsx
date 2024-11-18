import React, { useState } from 'react';
import { FolderGit2, Lock, Globe, Search, Plus, X, Edit2, FileText, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import CodeEditor from '../components/CodeEditor';

// Interfaces
interface ProjectFile {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: ProjectFile[];
  path: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  tags: string[];
  category: string;
  owner: {
    id: string;
    name: string;
  };
  stars: number;
  createdAt: Date;
  files: ProjectFile[];
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

export default function Projects() {
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "DevCollab API",
      description: "API REST pour la plateforme DevCollab",
      isPrivate: false,
      tags: ["Node.js", "TypeScript", "API"],
      category: "Développement",
      owner: {
        id: "admin1",
        name: "Quentin Faber"
      },
      stars: 42,
      createdAt: new Date(),
      status: 'approved',
      approvedBy: 'admin1',
      files: [
        {
          id: '1',
          name: 'src',
          type: 'directory',
          path: '/src',
          children: [
            {
              id: '2',
              name: 'index.ts',
              type: 'file',
              content: 'console.log("Hello World");',
              path: '/src/index.ts'
            },
            {
              id: '3',
              name: 'config',
              type: 'directory',
              path: '/src/config',
              children: [
                {
                  id: '4',
                  name: 'database.ts',
                  type: 'file',
                  content: 'export const config = {};',
                  path: '/src/config/database.ts'
                }
              ]
            }
          ]
        },
        {
          id: '5',
          name: 'package.json',
          type: 'file',
          content: '{\n  "name": "project"\n}',
          path: '/package.json'
        }
      ]
    }
  ]);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    isPrivate: false,
    category: '',
    tags: ''
  });

  const categories = [
    'Développement',
    'Médecine',
    'Artisanat',
    'Sciences',
    'Éducation',
    'Design'
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      isPrivate: newProject.isPrivate,
      category: newProject.category,
      tags: newProject.tags.split(',').map(tag => tag.trim()),
      owner: {
        id: user?.id || '',
        name: user?.name || ''
      },
      stars: 0,
      createdAt: new Date(),
      status: user?.role === 'admin' ? 'approved' : 'pending',
      files: []
    };
    setProjects([...projects, project]);
    setShowNewProjectModal(false);
    setNewProject({ name: '', description: '', isPrivate: false, category: '', tags: '' });
  };

  const handleDeleteProject = (project: Project) => {
    if (user?.role === 'admin' || project.owner.id === user?.id) {
      setSelectedProject(project);
      setShowDeleteProjectModal(true);
    }
  };

  const confirmDeleteProject = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setShowDeleteProjectModal(false);
      setSelectedProject(null);
    }
  };

  const renderFileTree = (files: ProjectFile[], level = 0) => {
    return (
      <div className={`ml-${level * 4}`}>
        {files.map((file) => (
          <div key={file.id}>
            <button
              onClick={() => setSelectedFile(file)}
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded w-full text-left"
            >
              {file.type === 'directory' ? (
                <FolderGit2 className="h-4 w-4 text-gray-400" />
              ) : (
                <FileText className="h-4 w-4 text-gray-400" />
              )}
              <span>{file.name}</span>
            </button>
            {file.type === 'directory' && file.children && (
              <div className="ml-4">
                {renderFileTree(file.children, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau Projet
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher des projets..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <FolderGit2 className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {project.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          {project.isPrivate ? (
                            <Lock className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Globe className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Ouvrir
                    </button>
                    {(user?.role === 'admin' || project.owner.id === user?.id) && (
                      <>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Catégorie: {project.category}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Créé par {project.owner.name}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de création de projet */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Créer un nouveau projet</h2>
              <button onClick={() => setShowNewProjectModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom du projet</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                    placeholder="react, typescript, api"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={newProject.isPrivate}
                    onChange={(e) => setNewProject({...newProject, isPrivate: e.target.checked})}
                  />
                  <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                    Projet privé
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualisation du projet */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProject.name}</h2>
              <button onClick={() => setSelectedProject(null)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="h-full overflow-hidden">
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-1 border-r overflow-y-auto">
                  <h3 className="font-medium mb-4">Fichiers du projet</h3>
                  {renderFileTree(selectedProject.files)}
                </div>
                <div className="col-span-2 overflow-y-auto">
                  {selectedFile ? (
                    selectedFile.type === 'file' ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">{selectedFile.path}</h3>
                          {(user?.role === 'admin' || selectedProject.owner.id === user?.id) && (
                            <button
                              onClick={() => {/* Logique d'édition */}}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        <CodeEditor
                          value={selectedFile.content || ''}
                          onChange={() => {/* Logique de mise à jour */}}
                          language={selectedFile.name.split('.').pop() || 'javascript'}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 mt-10">
                        Sélectionnez un fichier pour voir son contenu
                      </div>
                    )
                  ) : (
                    <div className="text-center text-gray-500 mt-10">
                      Sélectionnez un fichier pour voir son contenu
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Supprimer le projet</h2>
              <button onClick={() => setShowDeleteProjectModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer le projet "{selectedProject.name}" ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteProject}
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