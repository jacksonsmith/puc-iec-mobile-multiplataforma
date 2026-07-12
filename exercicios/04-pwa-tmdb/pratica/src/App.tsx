// src/App.tsx — shell da aplicação

import { useState } from 'react';
import { useFavorites } from './hooks/useFavorites';
import { HomeScreen } from './screens/HomeScreen';
import { BottomTabBar, type Tab } from './components/BottomTabBar';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { isFavorite, toggle, count } = useFavorites();

  return (
    <>
      <HomeScreen
        activeTab={activeTab}
        isFavorite={isFavorite}
        toggleFavorite={toggle}
        count={count}
      />
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={count}
      />
    </>
  );
}
