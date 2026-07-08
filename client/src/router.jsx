import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { LayoutPage } from './components/layout/layout.jsx';
import HomePage from './pages/Home.jsx';
import PageLoader from './components/layout/PageLoader.jsx';

// Lazy-loaded pages
const AboutPage = lazy(() => import('./pages/About.jsx'));
const Blog = lazy(() => import('./pages/Blog/BlogFeed.jsx'));
const BlogDetails = lazy(() => import('./pages/Blog/PostDetail.jsx'));
const PostEditor = lazy(() => import('./pages/Blog/PostEditor.jsx'));
const Contact = lazy(() => import('./pages/ContactUs.jsx'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorks.jsx'));
const Services = lazy(() => import('./pages/Service.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Signup = lazy(() => import('./pages/auth/Signup.jsx'));
const CVBuilder = lazy(() => import('./pages/dashboard/CVBuilder.jsx'));
const MyCvs = lazy(() => import('./pages/dashboard/MyCvs.jsx'));
const RequireAuth = lazy(() => import('./components/auth/RequireAuth.jsx'));
const CVTemplates = lazy(() => import('./pages/dashboard/CVTemplates.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));
const OAuthGoogleDone = lazy(() => import('./pages/auth/OAuthGoogleDone.jsx'));
const Profile = lazy(() => import('./pages/dashboard/Profile.jsx'));
const BlogProfile = lazy(() => import('./pages/dashboard/BlogProfile.jsx'));
const MyBlogs = lazy(() => import('./pages/dashboard/MyBlogs.jsx'));
const AuthorProfile = lazy(() => import('./pages/Blog/AuthorProfile.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LayoutPage />
      </Suspense>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'blogs', element: <Blog /> },
      { path: 'blogs/:slug', element: <BlogDetails /> },
      { path: 'author/:id', element: <AuthorProfile /> },
      {
        path: 'blogs/create',
        element: (
          <RequireAuth>
            <PostEditor />
          </RequireAuth>
        ),
      },
      {
        path: 'blogs/edit/:slug',
        element: (
          <RequireAuth>
            <PostEditor />
          </RequireAuth>
        ),
      },
      { path: 'contact-us', element: <Contact /> },
      { path: 'services', element: <Services /> },
      { path: 'login', element: <Login /> },
      { path: 'oauth/google-done', element: <OAuthGoogleDone /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
      { path: 'cv-templates', element: <CVTemplates /> },
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
        path: 'blog-profile',
        element: (
          <RequireAuth>
            <BlogProfile />
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
      },
      {
        path: 'my-blogs',
        element: (
          <RequireAuth>
            <MyBlogs />
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
