import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  User, Moon, Sun, Share2, QrCode, Camera, 
  Mail, Phone, Shield, Globe, Palette, Bell,
  UserPlus, X, Check, Settings, Lock
} from 'lucide-react';
import QRCode from 'qrcode.react';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    avatar: user?.avatar || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    preferences: {
      notifications: true,
      language: 'fr',
      theme: 'light',
      visibility: 'public'
    }
  });

  const [admins, setAdmins] = useState([
    { email: 'faber.quentin@gmail.com', name: 'Quentin Faber', isMainAdmin: true },
    { email: 'admin2@example.com', name: 'Admin 2', isMainAdmin: false }
  ]);

  useEffect(() => {
    if (user) {
      setProfile({
        ...profile,
        avatar: user.avatar || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    // Mise à jour du profil
    const updatedUser = {
      ...user,
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      avatar: profile.avatar
    };
    useAuthStore.getState().setAuth(updatedUser);
    setEditMode(false);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        theme: isDarkMode ? 'light' : 'dark'
      }
    });
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminEmail) {
      setAdmins([...admins, { 
        email: newAdminEmail, 
        name: 'Nouvel Admin', 
        isMainAdmin: false 
      }]);
      setNewAdminEmail('');
      setShowAdminModal(false);
    }
  };

  const removeAdmin = (email: string) => {
    if (!admins.find(admin => admin.email === email)?.isMainAdmin) {
      setAdmins(admins.filter(admin => admin.email !== email));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête du profil */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-full w-full p-4 text-gray-400" />
                  )}
                </div>
                {editMode && (
                  <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700">
                    <Camera className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div>
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Prénom"
                    />
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nom"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                )}
                <p className="text-gray-500 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile.email}
                </p>
                {user?.role === 'admin' && (
                  <div className="mt-2 flex items-center text-indigo-600">
                    <Shield className="h-4 w-4 mr-2" />
                    Administrateur
                  </div>
                )}
              </div>
            </div>
            <div className="space-x-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Enregistrer
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </div>

          {/* Informations de contact et préférences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!editMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!editMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-gray-500" />
                    Notifications
                  </span>
                  <button
                    onClick={() => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: !profile.preferences.notifications
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      profile.preferences.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        profile.preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-gray-500" />
                    Thème sombre
                  </span>
                  <button
                    onClick={handleThemeToggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isDarkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-gray-500" />
                    Visibilité du profil
                  </span>
                  <select
                    value={profile.preferences.visibility}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        visibility: e.target.value
                      }
                    })}
                    className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                    <option value="friends">Amis uniquement</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section QR Code et Partage */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Partage et connexion</h3>
            <div className="space-x-3">
              <button
                onClick={() => setShowQR(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <QrCode className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            ID utilisateur: {user?.id}
          </p>
        </div>

        {/* Section Administrateur */}
        {user?.role === 'admin' && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Gestion des Administrateurs</h2>
              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Ajouter un Admin
              </button>
            </div>

            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      {admin.isMainAdmin ? (
                        <Lock className="h-6 w-6 text-indigo-600" />
                      ) : (
                        <User className="h-6 w-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {admin.name}
                        {admin.isMainAdmin && (
                          <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                            Admin Principal
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  {!admin.isMainAdmin && (
                    <button
                      onClick={() => removeAdmin(admin.email)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Code QR de profil</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center p-4 bg-white">
              <QRCode
                value={`https://devcollab.com/profile/${user?.id}`}
                size={200}
                level="H"
              />
            </div>
            <p className="mt-4 text-sm text-center text-gray-500">
              Scannez ce code pour accéder rapidement à votre profil
            </p>
          </div>
        </div>
      )}

      {/* Modal Ajout Admin */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ajouter un Administrateur</h3>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email du nouvel administrateur
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="admin@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}