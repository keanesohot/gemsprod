import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import thailandicon from '../settingModal/thailand.svg';
import usaicon from '../settingModal/usa.svg';
import userIcon from '/userIcon.png';
import Swal from 'sweetalert2';

interface FloatingButtonGroupProps {
  onLogout: () => void;
  onDestination: () => void;
  userInfo?: { name?: string; email?: string; role?: string; picture?: string } | null;
  onFeedback: () => void;
}

const FloatingButtonGroup: React.FC<FloatingButtonGroupProps> = ({ onLogout, onDestination, userInfo, onFeedback }) => {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState<'th' | 'en'>(i18n.language === 'en' ? 'en' : 'th');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleLangToggle = () => {
    const newLang = lang === 'en' ? 'th' : 'en';
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // Close menu when click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: t('navbar.logoutDialog.title'),
      text: t('navbar.logoutDialog.text'),
      icon: 'warning',
      confirmButtonText: t('navbar.logoutDialog.confirm'),
      confirmButtonColor: '#8b090c',
      showCancelButton: true,
      cancelButtonText: t('navbar.logoutDialog.cancel'),
      cancelButtonColor: '#e2b644',
      background: '#f9f4d4',
      reverseButtons: true,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`,
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster`,
      },
    });
    if (result.isConfirmed) {
      onLogout();
    }
  };

  // ปุ่มย่อยแต่ละอัน
  const actions = [
    {
      label: lang === 'th' ? 'ไทย' : 'English',
      icon: <img src={lang === 'th' ? thailandicon : usaicon} alt={lang === 'th' ? 'TH' : 'EN'} style={{ width: 24, height: 24, borderRadius: '50%' }} />,
      onClick: handleLangToggle,
      style: { background: '#FFF7D6' },
    },
    {
      label: lang === 'th' ? 'ส่ง Feedback' : 'Feedback',
      icon: <span className="material-icons" style={{ fontSize: 24, color: '#8b090c' }}>feedback</span>,
      onClick: onFeedback,
      style: { background: '#F5F5F5' },
    },
    {
      label: lang === 'th' ? 'เลือกจุดหมาย' : 'Destination',
      icon: <span className="material-icons" style={{ fontSize: 24, color: '#222' }}>place</span>,
      onClick: onDestination,
      style: { background: '#E6F4FF', minWidth: 180, padding: '0 24px', fontSize: 16 },
    },
    {
      label: lang === 'th' ? 'ออกจากระบบ' : 'Logout',
      icon: <span className="material-icons" style={{ fontSize: 24, color: '#b00' }}>logout</span>,
      onClick: handleLogout,
      style: { background: '#FFE5E5', minWidth: 180, padding: '0 24px', fontSize: 16 },
    },
  ];

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 200 }} ref={menuRef}>
      {/* ปุ่มหลัก (avatar/user) */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: '#F5F5F5',
          border: 'none',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          transition: 'box-shadow 0.2s',
        }}
        aria-label="Open menu"
      >
        <img
          src={userInfo?.picture || userIcon}
          alt="user"
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).src = userIcon; }}
        />
      </button>
      {/* ปุ่มย่อย pop-out */}
      <div style={{
        position: 'absolute',
        top: 64,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: open ? 'auto' : 'none',
        minWidth: 220,
      }}>
        {/* User Info */}
        <div style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-10px)',
          transition: `opacity 0.2s, transform 0.2s`,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '0.5rem 0.7rem 0.3rem 0.7rem',
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 180, // ปรับให้เท่ากับปุ่มเมนู
        }}>
          {/* <img ...> ลบ avatar ออกจาก card */}
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }} title={userInfo?.name || (lang === 'th' ? 'ชื่อผู้ใช้' : 'User Name')}>
            {userInfo?.name ? userInfo.name.split(' ')[0] : (lang === 'th' ? 'ชื่อผู้ใช้' : 'User Name')}
          </div>
          <div style={{ color: '#aaa', fontSize: 11, marginBottom: 2 }}>{userInfo?.email || ''}</div>
        </div>
        {actions.map((action, idx) => (
          <button
            key={action.label}
            onClick={() => { action.onClick(); setOpen(false); }}
            style={{
              margin: '8px 0',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-10px)',
              transition: `opacity 0.2s ${0.05 * idx}s, transform 0.2s ${0.05 * idx}s`,
              border: 'none',
              borderRadius: 12,
              minWidth: 180, // ปรับให้เท่ากันทุกปุ่ม
              minHeight: 44,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'flex-start',
              fontWeight: 500,
              fontSize: 16, // ปรับให้เท่ากันทุกปุ่ม
              cursor: open ? 'pointer' : 'default',
              padding: '0 24px', // ปรับให้เท่ากันทุกปุ่ม
              ...action.style,
            }}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingButtonGroup; 