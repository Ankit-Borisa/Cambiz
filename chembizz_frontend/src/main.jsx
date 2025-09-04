import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { SharedStateProvider } from './context/ManageOpenContext.jsx'
import { ActiveContextProvider } from './context/ActiveLink.jsx'
import { NotiContextProvider } from './context/NotificationContext.jsx'
import { DisplayProvider } from './context/PdfViewContext.jsx'
import { DisplayPoProvider } from './context/PoViewContext.jsx'
import { UpdateProfileProvider } from './context/ProfileUpdateContect.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <DisplayProvider>
        <UpdateProfileProvider>
          <DisplayPoProvider>
            <NotiContextProvider>
              <SocketContextProvider>
                <SharedStateProvider>
                  <div className='max-w-[1600px] m-auto'>
                    <App />

                  </div>
                </SharedStateProvider>
              </SocketContextProvider>
            </NotiContextProvider>
          </DisplayPoProvider>
        </UpdateProfileProvider>
      </DisplayProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
