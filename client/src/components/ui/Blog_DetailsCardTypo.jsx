import React from "react";
import { Avatar, Button, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import typoPic from "../../assets/blogDetailsPic/Container.png";

const BlogDetailsCardTypo = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* =========================================================
            1. HERO IMAGE SECTION
           ========================================================= */}
        <div className="w-full h-[400px] md:h-[500px] mb-8 overflow-hidden rounded-3xl">
          <img
            src={typoPic}
            alt="Team meeting"
            className="w-full h-full object-cover"
          />
        </div>

        {/* =========================================================
            2. META DATA & SOCIAL BAR
           ========================================================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-10 gap-6">
          {/* LEFT: Author & Date */}
          <div className="flex items-center gap-12">
            {/* Author */}
            <div className="flex flex-col gap-1">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wide">
                Written by
              </span>
              <div className="flex items-center gap-2">
                <Avatar
                  src="https://i.pravatar.cc/150?img=9"
                  alt="Annet Blanco"
                  sx={{ width: 24, height: 24 }}
                />
                <span className="text-gray-900 font-semibold text-sm">
                  Annet Blanco
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wide">
                Updated on
              </span>
              <span className="text-gray-900 font-semibold text-sm">
                July 21, 2025
              </span>
            </div>
          </div>

          {/* RIGHT: Social Share Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: "none",
                borderColor: "#E5E7EB",
                color: "#4B5563",
                fontSize: "0.875rem",
                borderRadius: "8px",
                padding: "6px 16px",
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Copy link
            </Button>

            {/* Social Icons with light gray borders */}
            {[
              <TwitterIcon />,
              <FacebookIcon />,
              <LinkedInIcon />,
              <WhatsAppIcon />,
            ].map((icon, index) => (
              <IconButton
                key={index}
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "8px",
                  color: "#4B5563",
                  "&:hover": {
                    backgroundColor: "#F9FAFB",
                    borderColor: "#D1D5DB",
                  },
                }}
              >
                {React.cloneElement(icon, { sx: { fontSize: 20 } })}
              </IconButton>
            ))}
          </div>
        </div>

        {/* =========================================================
            3. MAIN CONTENT GRID
           ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- LEFT COLUMN: TYPOGRAPHY / CONTENT (Span 8) --- */}
          <div className="lg:col-span-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Understanding the Purpose of Asking Questions
            </h1>

            {/* ================================================================================
              *** CONTENT EXPANSION COMMENT ***
              If you want to increase the typography (add more text), simply copy-paste 
              the paragraph block below or add new HTML tags (h2, h3, ul, li) right here.
              ================================================================================
            */}

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              When you're preparing for a job interview, one of the most
              important components is having a successful interview is a two-way
              conversation, not just an employer's evaluation of your skills.
              Thoughtful questions help you assess the company's culture, team
              dynamics, and professional development opportunities while
              demonstrating your genuine interest in the role. They also allow
              you to clarify job expectations, technical skills required, and
              growth potential. Preparing relevant questions before the
              interview will help you position yourself as a proactive and
              informed candidate, ensuring the job aligns with your career
              goals.
            </p>

            <h2
              id="types"
              className="text-2xl font-bold text-gray-900 mb-4 mt-10 scroll-mt-24"
            >
              Types of Questions to Consider
            </h2>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Company Insights
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Asking the right questions can separate you from other candidates.
              Consider categorizing your questions into strategic buckets such
              as role-specific responsibilities, team structure, and company
              vision...
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Culture & Professional Growth
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Understanding company culture and career development opportunities
              is essential for long-term job satisfaction. Ask about company
              events or training programs with "How does the company support
              employee growth?" or "What initiatives are in place to foster
              work-life balance?" Career advisors often recommend asking
              behavioral questions to understand management styles, such as "Can
              you describe how employees receive feedback during performance
              reviews?
            </p>

            <h1
              id="categories"
              className="text-3xl font-bold text-gray-900 mb-6 leading-tight scroll-mt-24"
            >
              Breaking Down Common Categories
            </h1>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Management Style
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Understanding how leadership operates is essential for job
              satisfaction and career success. Insightful queries such as "How
              would you describe the leadership style within the company?" or
              "How is feedback provided to employees?" can help you determine if
              the company fosters a collaborative environment. If you're
              preparing for a phone interview, consider asking about
              communication expectations and how teams interact.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Career Growth & Development
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Companies that invest in employee development often provide
              mentorship programs, training, and leadership skills workshops.
              Asking "What opportunities for growth and advancement does the
              company offer?" or "Can you provide examples of projects that have
              helped employees develop professionally?" demonstrates your
              ambition and interest in long-term success.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Salary & Role Expectations
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              While salary expectations may be discussed later in the hiring
              process, understanding job requirements upfront is crucial. A mock
              interview with a career advisor can help refine your approach when
              asking about "What skills are most valued for success in this
              role?" or "How does this position positively impact the company’s
              objectives?"
            </p>

            <h2
              id="tailoring"
              className="text-2xl font-bold text-gray-900 mb-4 mt-10 scroll-mt-24"
            >
              Tailoring Your Questions to Fit
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Every interview is unique, and the best way to leave a lasting
              impression is by tailoring your questions to fit the specific
              company and role. Pay attention to the conversation and adjust
              your inquiries accordingly. For example, if innovation is a key
              focus, you could ask, "How does the company foster creativity and
              encourage employees to bring new ideas?" This approach
              demonstrates strong interview skills and genuine engagement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
              Assessing Workplace Quality & Culture
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Beyond responsibilities and key skills, company culture
              significantly impacts job satisfaction. During the interview
              process, consider asking about soft skills that contribute to
              success, such as teamwork and leadership. A question like "What
              type of employees tend to thrive in this environment?" can give
              you a better understanding of the company's expectations and
              support systems.
            </p>

            <h2
              id="growth"
              className="text-2xl font-bold text-gray-900 mb-4 mt-10 scroll-mt-24"
            >
              Seeking Insights on Growth
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Growth encompasses both personal career advancement and the
              company's expansion. Asking insightful interview questions such
              as, "What are the potential career paths for someone in this
              role?" demonstrates your ambition and commitment to long-term
              success within the organization. This also signals to employers
              that you are invested in growing alongside the company. To further
              highlight your enthusiasm for professional development, consider
              asking about training programs and upskilling opportunities. For
              instance, "Are there structured mentorship programs or continuing
              education options to help employees refine their skills?" This
              type of common interview question not only showcases your
              willingness to improve your expertise, but also aligns with the
              company's commitment to investing in its workforce. Additionally,
              incorporating company values into your job search strategy is
              essential. You might ask, "How does the company support employees
              in aligning their personal career goals with the company's
              mission?" This ensures that your aspirations match the
              organization's vision, making it clear that you're not just
              looking for any job, but one where you can flourish and contribute
              meaningfully.
            </p>

            <h2
              id="conclusion"
              className="text-2xl font-bold text-gray-900 mb-4 mt-10 scroll-mt-24"
            >
              Conclusion: Making the Most of Your Interview
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Preparing a solid list of questions to ask in an interview is a
              strategic move that can set you apart from other candidates.
              Asking insightful questions help you not only gather important
              information about the company and the role but also showcase your
              enthusiasm and critical thinking skills. Always remember to tailor
              your questions to the specific context of the interview,
              prioritize the most important ones, and avoid common mistakes that
              can detract from your professionalism. With thoughtful
              preparation, your questions can lead to a more engaging and
              productive interview experience, ultimately helping you secure the
              job that best fits your career aspirations. Additionally,
              optimizing your resume with our curriculum.ai can further enhance
              your chances of success. Remember, the right questions can
              transform a standard interview into a meaningful conversation that
              benefits both you and your potential employer.
            </p>

            {/* END OF CONTENT AREA */}
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR / OUTLINE (Span 4) --- */}
          <div className="hidden lg:block lg:col-span-4 pl-8">
            <div className="sticky top-10">
              <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-6">
                Outline of this article
              </h3>

              <ul className="space-y-4">
                {[
                  { id: "types", label: "Types of Questions to Consider" },
                  {
                    id: "categories",
                    label: "Breaking Down Common Categories",
                  },
                  { id: "tailoring", label: "Tailoring Your Questions to Fit" },
                  { id: "growth", label: "Seeking Insights on Growth" },
                  {
                    id: "conclusion",
                    label: "Conclusion: Making the Most of Your Interview",
                  },
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.id}`} // <--- THIS LINKS TO THE ID
                      className="text-sm text-gray-500 hover:text-blue-600 block transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsCardTypo;
