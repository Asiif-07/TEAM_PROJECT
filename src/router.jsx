import { createBrowserRouter } from 'react-router-dom';
import { LayoutPage } from './components/layout/layout.jsx';
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import BlogCard from './components/ui/BlogCard.jsx';
import BlogDetails from './pages/Blog_Details.jsx';
import Contact from './pages/ContactUs.jsx';
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
      {
        path: 'blog/:id',
        element: <BlogCard />,
      },
      {
        path: 'blog/details/:id',
        element: <BlogDetails />,
      },  
      {
        path: 'contact-us',
        element: <Contact />,
      },
    ],
  },
]);

export default router;
