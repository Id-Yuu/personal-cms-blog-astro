import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useSidebars } from '../hooks/useSidebars';
import { useWidgets } from '../hooks/useWidgets';
import { useUsers } from '../hooks/useUsers';
import { useSettings } from '../hooks/useSettings';

import PostsTab from './dashboard/PostsTab';
import SidebarsTab from './dashboard/SidebarsTab';
import WidgetTab from './dashboard/WidgetTab';
import UsersTab from './dashboard/UsersTab';
import SettingsTab from './dashboard/SettingsTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const { logout, token, role } = useAuth();
  
  const isAdmin = role === 'admin';
  
  const { posts, createPost, updatePost, deletePost } = usePosts();
  const { sidebars, createSidebar, updateSidebar, deleteSidebar } = useSidebars();
  const { widgets, createWidget, updateWidget, deleteWidget } = useWidgets();
  const { users, createUser, updateUser, deleteUser } = useUsers();
  const { settingsForm, saveSettings, isSavingSettings } = useSettings();

  // Wait until token is verified before rendering the dashboard
  if (!token) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard</h2>
        <button onClick={logout} className="btn" style={{ backgroundColor: '#dc3545', color: '#fff' }}>Logout</button>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('posts')} className="btn" style={{ backgroundColor: activeTab === 'posts' ? '#333' : '#ccc', color: activeTab === 'posts' ? '#fff' : '#000', border: 'none' }}>Manage Posts</button>
        {isAdmin && <button onClick={() => setActiveTab('sidebars')} className="btn" style={{ backgroundColor: activeTab === 'sidebars' ? '#333' : '#ccc', color: activeTab === 'sidebars' ? '#fff' : '#000', border: 'none' }}>Manage Sidebars</button>}
        {isAdmin && <button onClick={() => setActiveTab('widgets')} className="btn" style={{ backgroundColor: activeTab === 'widgets' ? '#333' : '#ccc', color: activeTab === 'widgets' ? '#fff' : '#000', border: 'none' }}>Manage Top Widgets</button>}
        {isAdmin && <button onClick={() => setActiveTab('users')} className="btn" style={{ backgroundColor: activeTab === 'users' ? '#333' : '#ccc', color: activeTab === 'users' ? '#fff' : '#000', border: 'none' }}>Manage Users</button>}
        {isAdmin && <button onClick={() => setActiveTab('settings')} className="btn" style={{ backgroundColor: activeTab === 'settings' ? '#333' : '#ccc', color: activeTab === 'settings' ? '#fff' : '#000', border: 'none' }}>Settings</button>}
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <PostsTab 
          posts={posts} 
          createPost={createPost} 
          updatePost={updatePost} 
          deletePost={deletePost} 
        />
      )}
      
      {isAdmin && activeTab === 'sidebars' && (
        <SidebarsTab 
          sidebars={sidebars} 
          createSidebar={createSidebar} 
          updateSidebar={updateSidebar} 
          deleteSidebar={deleteSidebar} 
        />
      )}

      {isAdmin && activeTab === 'widgets' && (
        <WidgetTab 
          widgets={widgets} 
          createWidget={createWidget} 
          updateWidget={updateWidget} 
          deleteWidget={deleteWidget} 
        />
      )}

      {isAdmin && activeTab === 'users' && (
        <UsersTab 
          users={users} 
          createUser={createUser} 
          updateUser={updateUser} 
          deleteUser={deleteUser} 
        />
      )}

      {isAdmin && activeTab === 'settings' && (
        <SettingsTab 
          settingsForm={settingsForm} 
          saveSettings={saveSettings} 
          isSavingSettings={isSavingSettings} 
        />
      )}
    </div>
  );
}