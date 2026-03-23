import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:4000';

export function useSettings() {
  const [settingsForm, setSettingsForm] = useState({
    headerTitle: '',
    headerDesc: '',
    footerText: '',
    postsPerPage: 3
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const { fetchWithAuth, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      if (data) setSettingsForm(data);
    } catch (error) { console.error("Error fetching settings:", error); }
  };

  const saveSettings = async (newSettings) => {
    setIsSavingSettings(true);
    try {
      await fetchWithAuth(`${API_URL}/settings`, {
        method: 'PUT', body: JSON.stringify(newSettings)
      });
      setSettingsForm(newSettings);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSavingSettings(false);
    }
  };

  return { settingsForm, saveSettings, isSavingSettings };
}
