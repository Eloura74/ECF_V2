import React from 'react';
import { 
  Activity, Users, Code, Star, Bell, TrendingUp, 
  MessageSquare, FileText, Calendar, Award, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { name: 'Projets Actifs', value: '25', icon: Activity },
    { name: 'Développeurs', value: '150', icon: Users },
    { name: 'Contributions', value: '1.2k', icon: Code },
    { name: 'Projets Favoris', value: '89', icon: Star }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'project',
      title: 'Mise à jour du projet React',
      description: 'Nouvelle version déployée',
      time: 'Il y a 5 minutes',
      icon: Code
    },
    {
      id: 2,
      type: 'message',
      title: 'Nouveau message dans HTML & CSS',
      description: 'Question sur les flexbox',
      time: 'Il y a 15 minutes',
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'doc',
      title: 'Documentation mise à jour',
      description: 'Guide JavaScript ES6+',
      time: 'Il y a 1 heure',
      icon: FileText
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Workshop React',
      date: '2024-03-25',
      time: '14:00',
      participants: 12
    },
    {
      id: 2,
      title: 'Code Review Session',
      date: '2024-03-26',
      time: '10:00',
      participants: 5
    }
  ];

  const trendingTopics = [
    { id: 1, name: 'React', count: 234, trend: '+12%' },
    { id: 2, name: 'TypeScript', count: 189, trend: '+8%' },
    { id: 3, name: 'Node.js', count: 156, trend: '+5%' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* En-tête avec message de bienvenue personnalisé */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Bienvenue, {user?.name}
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Votre plateforme collaborative d'apprentissage et d'entraide
        </p>
      </div>

      {/* Statistiques */}
      <div className="mt-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200">
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* Section principale avec grille */}
      <div className="mt-10 grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Activités récentes */}
        <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 text-indigo-500 mr-2" />
              Activités Récentes
            </h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                            <activity.icon className="h-5 w-5 text-indigo-500" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.title}{' '}
                              <span className="font-medium text-gray-900">
                                {activity.description}
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar avec événements et tendances */}
        <div className="space-y-8">
          {/* Événements à venir */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                Événements à venir
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} à {event.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      {event.participants} participants
                    </p>
                  </div>
                ))}
              </div>
              <Link
                to="/events"
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Voir tous les événements
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Sujets tendances */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
                Sujets Tendances
              </h2>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-gray-900">{topic.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{topic.count} discussions</span>
                      <span className="text-sm text-green-500">{topic.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges et récompenses */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-indigo-500 mr-2" />
                Vos Réalisations
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Top Contributeur</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Expert Support</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Code className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Code Master</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}