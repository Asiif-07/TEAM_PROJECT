import React from 'react';
import { Box, Typography } from '@mui/material';

export default function KoreanTemplate({ data }) {
  const { personalInfo = {}, experience = [], education = [] } = data || {};
  
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (img.secure_url) return img.secure_url;
    if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
    return null;
  };
  const profileImageUrl = getImageUrl(personalInfo.profileImage);

  const thStyle = { border: '1px solid black', padding: '8px', backgroundColor: '#f3f4f6', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' };
  const tdStyle = { border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '13px' };

  return (
    <Box sx={{ minHeight: '297mm', width: '210mm', bgcolor: 'white', mx: 'auto', p: 8, fontFamily: '"Malgun Gothic", "Batang", serif', color: 'black' }}>
      <Typography variant="h3" align="center" sx={{ letterSpacing: '15px', mb: 6, fontWeight: 'bold' }}>이 력 서</Typography>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '30px' }}>
        <tbody>
          <tr>
            <td rowSpan={4} style={{ width: '130px', border: '1px solid black', textAlign: 'center', backgroundColor: '#f9fafb', color: '#9ca3af', height: '160px', padding: 0, overflow: 'hidden' }}>
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography variant="caption" sx={{ p: 1, display: "block" }}>사진<br/>(Photo)</Typography>
              )}
            </td>
            <td style={thStyle}>성 명</td>
            <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '15px', fontWeight: 'bold', fontSize: '16px' }} colSpan={3}>{personalInfo.name}</td>
          </tr>
          <tr>
            <td style={{...thStyle, width: '100px'}}>연 락 처</td>
            <td style={{...tdStyle, textAlign: 'left', paddingLeft: '15px'}}>{personalInfo.phone}</td>
            <td style={{...thStyle, width: '100px'}}>이 메 일</td>
            <td style={{...tdStyle, textAlign: 'left', paddingLeft: '15px'}}>{personalInfo.email}</td>
          </tr>
          <tr><td style={thStyle}>지 원 분 야</td><td style={{...tdStyle, textAlign: 'left', paddingLeft: '15px'}} colSpan={3}>{personalInfo.title}</td></tr>
          <tr><td style={thStyle}>링 크</td><td style={{...tdStyle, textAlign: 'left', paddingLeft: '15px'}} colSpan={3}>{personalInfo.linkedin || personalInfo.github || '-'}</td></tr>
        </tbody>
      </table>

      <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: '15px' }}>■ 학력사항 (Education)</Typography>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '30px' }}>
        <thead><tr><th style={{...thStyle, width: '25%'}}>재 학 기 간</th><th style={thStyle}>학 교 명 및 전 공</th></tr></thead>
        <tbody>
          {education.map((edu, idx) => (<tr key={idx}><td style={tdStyle}>{edu.year}</td><td style={tdStyle}>{edu.institute} - {edu.degree}</td></tr>))}
          {education.length === 0 && <tr><td style={tdStyle}>&nbsp;</td><td style={tdStyle}>&nbsp;</td></tr>}
        </tbody>
      </table>

      <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: '15px' }}>■ 경력사항 (Experience)</Typography>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black', marginBottom: '40px' }}>
        <thead><tr><th style={{...thStyle, width: '25%'}}>근 무 기 간</th><th style={{...thStyle, width: '25%'}}>직 장 명</th><th style={thStyle}>담 당 업 무</th></tr></thead>
        <tbody>
          {experience.map((exp, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{exp.duration}</td><td style={tdStyle}>{exp.company}</td>
              <td style={{...tdStyle, textAlign: 'left', paddingLeft: '15px'}}><strong>{exp.role}</strong><br/><span style={{fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-wrap'}}>{exp.description}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}