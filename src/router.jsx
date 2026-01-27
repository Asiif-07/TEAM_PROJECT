import { createBrowserRouter } from 'react-router-dom';
import { LayoutPage } from './components/layout/layout.jsx';
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import Blog from './pages/Blog.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
    ],
  },
]);

export default router;
