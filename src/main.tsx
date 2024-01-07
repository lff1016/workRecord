import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import NiceModal from '@ebay/nice-modal-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: { controlItemBgHover: '#fff' }
      }}
    >
      <NiceModal.Provider>
        <App />
      </NiceModal.Provider>
    </ConfigProvider>
  </React.StrictMode>
);
