import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const faqData = [
  {
    id: 'panel1',
    question: 'How does the AI + Human review process work?',
    answer:
      'Our AI first analyzes your information, optimizes keywords, and structures your content for maximum impact. Then, industry experts review and refine the AI output, ensuring perfect tone, clarity, and personalization for your specific goals.',
  },
  {
    id: 'panel2',
    question: 'How long does it take to receive my document?',
    answer:
      'Delivery times vary depending on the service package you choose. Typically, you can expect to receive your first draft within 3-5 business days after submitting all necessary information.',
  },
  {
    id: 'panel3',
    question: "What if I'm not satisfied with the result?",
    answer:
      'Your satisfaction is our priority. We offer a revision process where you can provide feedback, and our team will work with you to make necessary adjustments until you are confident in the final product.',
  },
  {
    id: 'panel4',
    question: 'Are your document ATS-friendly?',
    answer:
      'Yes, all our documents are designed to be Applicant Tracking System (ATS) friendly. We ensure correct formatting, keyword optimization, and structure to help your application pass through automated screening systems.',
  },
  {
    id: 'panel5',
    question: 'What information do I need to provide?',
    answer:
      'You will need to provide your current resume (if available), your career goals, target job roles, and any specific achievements or experiences you want to highlight. A short questionnaire will guide you through the process.',
  },
  {
    id: 'panel6',
    question: 'Is my personal information secure?',
    answer:
      'Absolutely. We take data privacy seriously. All your personal information and documents are securely stored and are only accessible by the team members directly involved in working on your services.',
  },
  {
    id: 'panel7',
    question: 'Can you help with specific industries?',
    answer:
      'Yes, our team of writers has experience across a wide range of industries, including technology, finance, healthcare, marketing, and more. We tailor your documents to match industry standards and expectations.',
  },
  {
    id: 'panel8',
    question: 'Do you offer interview coaching?',
    answer:
      'Yes, we offer interview coaching as an add-on service or as part of our comprehensive career packages. Our coaches will help you prepare for various interview formats and provide mock interview sessions with feedback.',
  },
];

const FAQSection = () => {
  // State to manage which accordion is expanded.
  // Initialize with 'panel1' to have the first one open by default.
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    /* =================================================================
      BACKGROUND COLOR CHANGE INSTRUCTION:
      To change the background color of the entire section, modify the 
      'bg-gray-50' class below to your desired Tailwind background color 
      class (e.g., 'bg-white', 'bg-blue-50', 'bg-[#f0f2f5]').
      =================================================================
    */
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-14">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 py-1.5 px-4 rounded-full mb-6">
          <HelpOutlineIcon fontSize="small" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            FAQ
          </span>
        </div>
        
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Frequently <span className="text-blue-600">Asked Questions</span>
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get answers to common questions about our AI-enhanced career services
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((item) => {
          const isExpanded = expanded === item.id;
          return (
            <Accordion
              key={item.id}
              expanded={isExpanded}
              onChange={handleChange(item.id)}
              // MUI sx prop for component-specific styling overrides
              sx={{
                boxShadow: 'none', // Remove default shadow
                border: '1px solid',
                borderColor: isExpanded ? '#bfdbfe' : '#e5e7eb', // blue-200 if expanded, else gray-200
                borderRadius: '12px !important', // Force rounded corners
                overflow: 'hidden',
                '&:before': { display: 'none' }, // Remove default MUI divider line
                transition: 'all 0.3s ease',
                backgroundColor: isExpanded ? '#f8fafc' : '#ffffff',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="text-gray-400" />}
                aria-controls={`${item.id}-content`}
                id={`${item.id}-header`}
                sx={{
                  paddingX: '24px',
                  paddingY: '16px',
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  },
                }}
              >
                <AutoAwesomeIcon
                  className={isExpanded ? 'text-blue-600' : 'text-blue-500'}
                  fontSize="small"
                />
                <Typography
                  variant="h6"
                  component="h3"
                  className={`text-lg font-semibold ${
                    isExpanded ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingX: '24px', paddingBottom: '24px' }}>
                <Typography className="text-gray-600 leading-relaxed pl-10">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;