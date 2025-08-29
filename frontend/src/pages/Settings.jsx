import useSettingsStore from '../store/useSettingsStore';

export default function Settings() {
  const { darkMode, toggleDarkMode, favoritePlatform, setFavoritePlatform } = useSettingsStore();
  
  return (
    <div className={`p-6 max-w-4xl mx-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-semibold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="w-5 h-5" />
          <span>Dark Mode</span>
        </label>
      </div>
      <div>
        <label className="block mb-2">Favorite Platform:</label>
        <select 
          value={favoritePlatform} 
          onChange={(e) => setFavoritePlatform(e.target.value)} 
          className="p-2 border rounded-lg">
          <option value="Codeforces">Codeforces</option>
          <option value="LeetCode">LeetCode</option>
          <option value="CodeChef">CodeChef</option>
        </select>
      </div>
    </div>
  );
}