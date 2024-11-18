import React, { useState, useEffect, useRef } from 'react';
import { Send, User, UserPlus, X, Video, Phone } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import VideoCall from '../components/VideoCall';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

interface PrivateChat {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedPrivateChat, setSelectedPrivateChat] = useState<PrivateChat | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeChat, setActiveChat] = useState<'groups' | 'private'>('groups');
  
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alice Dev', status: 'online' },
    { id: '2', name: 'Bob Coder', status: 'offline' },
  ]);

  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([
    {
      id: 'chat1',
      userId: 'user1',
      userName: 'Alice Dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      lastMessage: 'Salut, comment vas-tu ?',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 'chat2',
      userId: 'user2',
      userName: 'Bob Coder',
      lastMessage: 'Merci pour ton aide !',
      unreadCount: 0,
      isOnline: false
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('https://api.devcollab.com');
    setSocket(newSocket);
    return () => { newSocket.close(); };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket && selectedFriend) {
      const message = {
        id: Date.now().toString(),
        sender: 'Utilisateur',
        content: newMessage,
        timestamp: new Date()
      };
      socket.emit('message', { message, recipientId: selectedFriend.id });
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: newFriendEmail.split('@')[0],
      status: 'offline'
    };
    setFriends([...friends, newFriend]);
    setNewFriendEmail('');
    setShowAddFriend(false);
  };

  return (
    <div className="flex h-full max-w-6xl mx-auto">
      {/* Liste des amis */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveChat('groups')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                activeChat === 'groups'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Groupes
            </button>
            <button
              onClick={() => setActiveChat('private')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                activeChat === 'private'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Messages privés
            </button>
          </div>
          <button
            onClick={() => setShowAddFriend(true)}
            className="w-full flex items-center justify-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Ajouter un ami
          </button>
        </div>

        <div className="overflow-y-auto h-full">
          {activeChat === 'groups' ? (
            friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${
                  selectedFriend?.id === friend.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{friend.name}</p>
                    <p className={`text-xs ${
                      friend.status === 'online' ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {friend.status}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            privateChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedPrivateChat(chat)}
                className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${
                  selectedPrivateChat?.id === chat.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.userName}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                  )}
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{chat.userName}</p>
                    {chat.unreadCount > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedFriend || selectedPrivateChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {selectedPrivateChat?.avatar ? (
                    <img
                      src={selectedPrivateChat.avatar}
                      alt={selectedPrivateChat.userName}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-gray-900">
                      {selectedPrivateChat?.userName || selectedFriend?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedPrivateChat?.isOnline || selectedFriend?.status === 'online' 
                        ? 'En ligne' 
                        : 'Hors ligne'}
                    </p>
                  </div>
                </div>
                {selectedPrivateChat && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowVideoCall(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                      <Phone className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'Utilisateur' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender !== 'Utilisateur' && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-sm ${
                      message.sender === 'Utilisateur'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Sélectionnez un ami pour commencer à discuter</p>
          </div>
        )}
      </div>

      {/* Modal d'ajout d'ami */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un ami</h2>
              <button onClick={() => setShowAddFriend(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddFriend}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email de votre ami
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Envoyer une invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'appel vidéo */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Appel vidéo avec {selectedPrivateChat?.userName}
              </h3>
              <button
                onClick={() => setShowVideoCall(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <VideoCall roomId={selectedPrivateChat?.id} />
          </div>
        </div>
      )}
    </div>
  );
}