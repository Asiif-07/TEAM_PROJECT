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
import CVBuilder from './pages/CVBuilder.jsx';
import MyCvs from './pages/MyCvs.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import CVTemplates from './pages/CVTemplates.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

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
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      },
      {
        path: 'cv-templates',
        element: <CVTemplates />,
      },
      {
        path: 'cv-builder',
        element: <CVBuilder />,
      },
      {
        path: 'my-cvs',
        element: (
          <RequireAuth>
            <MyCvs />
          </RequireAuth>
        ),
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
