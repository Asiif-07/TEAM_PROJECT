import React from 'react';
import { Button, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt';

const FeatureSection = () => {
  const interviewTypesFeatures = [
    'Always available support', 'CV questions answered', 'Career guidance',
    'Interview tips', 'Call transcripts provided', 'Seamless human handoff',
    'Always available support', 'CV questions answered', 'Career guidance',
    'Interview tips', 'Call transcripts provided', 'Seamless human handoff',
  ];

  const practiceFeatures = [
    'Realistic conversation flow', 'Industry-specific questions',
    'Real-time feedback', 'Performance scoring',
    'Session recordings', 'Improvement suggestions',
  ];

  const supportFeatures = [
    'Always available support', 'CV questions answered',
    'Career guidance', 'Interview tips',
    'Call transcripts provided', 'Seamless human handoff',
  ];

  return (
    // CHANGE 1: Outer div handles the background color only
    <div className="bg-white font-sans">
      
      {/* CHANGE 2: Inner div handles alignment (matches standard Navbar width) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 rounded-full px-4 py-1 mb-6">
              <FeaturedVideoIcon fontSize="small" />
              <span className="text-sm font-medium">Featured Service</span>
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">AI Interview Coaching</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Practice with our advanced AI interviewer. Get real-time feedback, master all interview types, and boost your confidence.
            </p>
            <div className="flex space-x-4 mb-8">
              <div className="bg-green-200 p-6 rounded-lg flex-1 shadow-sm">
                <FeaturedVideoIcon fontSize="large" className="text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">8 Interviews Types</h3>
                <p className="text-gray-600">Panel, Group Tecnical & more</p>
              </div>
              <div className="bg-blue-100 p-6 rounded-lg flex-1 shadow-sm">
                <AccessTimeIcon fontSize="large" className="text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Available</h3>
                <p className="text-gray-600">Practice anytime any where</p>
              </div>
            </div>
            <div className="flex space-x-4 gap-3">
              <Button variant="contained" color="primary" endIcon={<span>→</span>} className="bg-blue-600 hover:bg-blue-700 px-6  py-3">
                Trt AI Interview
              </Button>
              <Button variant="outlined" className="px-6 py-3 text-blue-600 border-blue-600 hover:bg-blue-50">
                Learn more
              </Button>
            </div>
          </div>

          {/* Right Content (Interview Types Box) */}
          <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-xl p-8 shadow-lg mt-8 lg:mt-0">
            <h3 className="text-2xl font-bold mb-6">Interview Types Covered:</h3>
            <div className="grid grid-cols-2 gap-y-4">
              {interviewTypesFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircleIcon fontSize="small" className="text-blue-400 mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* AI Interview Practice Card */}
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <BoltIcon fontSize="large" className="text-blue-400 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-blue-600">AI Interview Practice</h3>
                <p className="text-gray-600">Practice with our advanced AI interviewer anytime, anywhere</p>
              </div>
            </div>
            <List>
              {practiceFeatures.map((feature, index) => (
                <ListItem key={index} disablePadding className="mb-2">
                  <ListItemIcon className="min-w-min mr-3">
                    <CheckCircleIcon fontSize="small" className="text-blue-600" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </div>

          {/* 24/7 AI Support Card */}
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <BoltIcon fontSize="large" className="text-blue-400 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-blue-600">24/7 AI Support</h3>
                <p className="text-gray-600">Call our AI assistant anytime for instant help and guidance</p>
              </div>
            </div>
            <List>
              {supportFeatures.map((feature, index) => (
                <ListItem key={index} disablePadding className="mb-2">
                  <ListItemIcon className="min-w-min mr-3">
                    <CheckCircleIcon fontSize="small" className="text-blue-600" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div> {/* End of inner container */}
    </div>
  );
};

export default FeatureSection;