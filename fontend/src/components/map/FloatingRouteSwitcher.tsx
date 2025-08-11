import React from "react";
import { useTranslation } from 'react-i18next';

interface FloatingRouteSwitcherProps {
  selectedRoute: string | null;
  setSelectedRoute: (route: string) => void;
}

const FloatingRouteSwitcher: React.FC<FloatingRouteSwitcherProps> = ({ selectedRoute, setSelectedRoute }) => {
  const { t } = useTranslation();
  const handleSwitch = () => {
    setSelectedRoute(selectedRoute === 'route1' ? 'route2' : 'route1');
  };
  return (
    <button
      onClick={handleSwitch}
      style={{
        background: '#fff',
        border: 'none',
        borderRadius: '999px',
        width: 100,
        height: 48,
        lineHeight: '48px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 700,
        color: '#222',
        fontSize: 17,
        letterSpacing: 0.5,
        padding: 0,
        textAlign: 'center',
      }}
    >
      {selectedRoute === 'route1' ? t('navbar.route.route1') : t('navbar.route.route2')}
    </button>
  );
};

export default FloatingRouteSwitcher; 