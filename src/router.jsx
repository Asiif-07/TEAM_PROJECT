import { createBrowserRouter } from 'react-router-dom';
import { LayoutPage } from './components/layout/layout.jsx';
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import BlogCard from './components/ui/BlogCard.jsx';
import BlogDetails from './pages/Blog_Details.jsx';
import Contact from './pages/ContactUs.jsx';
import HowItWorksPage from './pages/HowItWorks.jsx';
import Services from './pages/Service.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
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
        path: 'how-it-works',
        element: <HowItWorksPage />,
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
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
