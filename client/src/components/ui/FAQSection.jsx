import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FAQSection = () => {
  const { t } = useTranslation();
  const faqData = [
    {
      id: 'panel1',
      question: t("FAQ Question 1"),
      answer: t("FAQ Answer 1"),
    },
    {
      id: 'panel2',
      question: t("FAQ Question 2"),
      answer: t("FAQ Answer 2"),
    },
    {
      id: 'panel3',
      question: t("FAQ Question 3"),
      answer: t("FAQ Answer 3"),
    },
    {
      id: 'panel4',
      question: t("FAQ Question 4"),
      answer: t("FAQ Answer 4"),
    },
    {
      id: 'panel5',
      question: t("FAQ Question 5"),
      answer: t("FAQ Answer 5"),
    },
    {
      id: 'panel6',
      question: t("FAQ Question 6"),
      answer: t("FAQ Answer 6"),
    },
    {
      id: 'panel7',
      question: t("FAQ Question 7"),
      answer: t("FAQ Answer 7"),
    },
    {
      id: 'panel8',
      question: t("FAQ Question 8"),
      answer: t("FAQ Answer 8"),
    },
  ];
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
            {t("FAQ Badge")}
          </span>
        </div>
        
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {t("Frequently")} <span className="text-blue-600">{t("Asked Questions")}</span>
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("FAQ Desc")}
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