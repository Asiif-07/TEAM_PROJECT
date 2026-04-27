const getData = (t) => [
  { title: t("AI Human Touch"), text: t("AI Human Touch Desc") },
  { title: t("Fast Turnaround"), text: t("Fast Turnaround Desc") },
  { title: t("GDPR Compliant"), text: t("GDPR Compliant Desc") },
  { title: t("ATS-Optimized"), text: t("ATS-Optimized Desc") },
  { title: t("Quality Guarantee"), text: t("Quality Guarantee Desc") },
];

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();
  const data = getData(t);
  const navigate = useNavigate();
  return (
    <section className="max-w-[1293px] mx-auto p-8 ">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-[32px]">

        {data.map((item, i) => (
          <div
            key={i}
            className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-[10px]
                ${i < 3 ? "md:col-span-2" : "md:col-span-3"}`}
          >
            <div className="bg-blue-50 p-2 rounded-lg mb-6">
              <img src="/assets/images/Background.jpg" alt="icon" className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.text}</p>

            <button
              onClick={() => navigate('/cv-templates')}
              className="mt-auto text-blue-500 text-sm font-semibold flex items-center hover:gap-2 transition-all"
            >
              {t("Learn More Features")} <span className="ml-1">→</span>
            </button>
          </div>
        ))}

      </div>
    </section>
  );
}