import { createBrowserRouter } from 'react-router-dom';
import { LayoutPage } from './components/layout/layout.jsx';
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import BlogCard from './components/blog/BlogCard.jsx';
import BlogDetails from './pages/Blog_Details.jsx';
import Contact from './pages/ContactUs.jsx';
import HowItWorksPage from './pages/HowItWorks.jsx';
import Services from './pages/Service.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import CVBuilder from './pages/dashboard/CVBuilder.jsx';
import MyCvs from './pages/dashboard/MyCvs.jsx';
import RequireAuth from './components/auth/RequireAuth.jsx';
import CVTemplates from './pages/dashboard/CVTemplates.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import OAuthGoogleDone from './pages/auth/OAuthGoogleDone.jsx';
import Profile from './pages/dashboard/Profile.jsx';

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
        path: 'blogs',
        element: <Blog />,
      },
      {
        path: 'blogs/:id',
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
        path: 'oauth/google-done',
        element: <OAuthGoogleDone />,
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
        element: (
          <RequireAuth>
            <CVBuilder />
          </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
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
