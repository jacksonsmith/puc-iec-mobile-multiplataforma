// src/components/BottomTabBar.tsx
// Tab bar fixa no rodapé — visível só no mobile (max-width: 768px via CSS).

import { styles } from './BottomTabBar.styles';

export type Tab = 'home' | 'search' | 'favorites';

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  favoritesCount: number;
};

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',      label: 'Início',     icon: '🏠' },
  { id: 'search',    label: 'Buscar',     icon: '🔍' },
  { id: 'favorites', label: 'Favoritos',  icon: '★' },
];

export function BottomTabBar({ activeTab, onTabChange, favoritesCount }: Props) {
  return (
    <nav className="bottom-tab-bar" aria-label="Navegação principal">
      {TABS.map(({ id, label, icon }) => {
        const isActive = activeTab === id;
        const color = isActive ? '#01b4e4' : '#607d8b';
        return (
          <div key={id} style={styles.tabWrapper}>
            <button
              onClick={() => onTabChange(id)}
              style={{ ...styles.tab, color }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <span style={styles.icon}>{icon}</span>
              <span>{label}</span>
            </button>
            {id === 'favorites' && favoritesCount > 0 && (
              <span style={styles.badge}>{favoritesCount}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
