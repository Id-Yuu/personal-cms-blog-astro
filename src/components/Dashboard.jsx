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
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </div>

      {/* Tabs Menu */}
      <div className="tab-bar">
        <button onClick={() => setActiveTab('posts')} className={`btn tab-btn ${activeTab === 'posts' ? 'tab-btn--active' : ''}`}>Manage Posts</button>
        {isAdmin && <button onClick={() => setActiveTab('sidebars')} className={`btn tab-btn ${activeTab === 'sidebars' ? 'tab-btn--active' : ''}`}>Manage Sidebars</button>}
        {isAdmin && <button onClick={() => setActiveTab('widgets')} className={`btn tab-btn ${activeTab === 'widgets' ? 'tab-btn--active' : ''}`}>Manage Top Widgets</button>}
        {isAdmin && <button onClick={() => setActiveTab('users')} className={`btn tab-btn ${activeTab === 'users' ? 'tab-btn--active' : ''}`}>Manage Users</button>}
        {isAdmin && <button onClick={() => setActiveTab('settings')} className={`btn tab-btn ${activeTab === 'settings' ? 'tab-btn--active' : ''}`}>Settings</button>}
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