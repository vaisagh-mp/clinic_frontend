import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './core/redux/store'
import { BrowserRouter } from 'react-router'
import { base_path } from './environment'
import ALLRoutes from './feature-module/routes/router'
import ThemeRouteHandler from './core/common/theme-route-handler/themeRouteHandler'

// Styles
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../src/style/css/iconsax.css";
import "../src/style/css/feather.css";
import "../node_modules/@tabler/icons-webfont/dist/tabler-icons.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../src/index.scss";

// Import ChatWidget
import ChatWidget from './feature-module/components/pages/chat-bot/ChatWidget.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={base_path}>
        
        <ThemeRouteHandler />
        <ALLRoutes />

        {/* ✅ Chat widget visible globally */}
        <ChatWidget />

      </BrowserRouter>
    </Provider>
  </StrictMode>
)
