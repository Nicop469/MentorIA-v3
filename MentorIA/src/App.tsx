import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { initializeStorage } from './services/storageService';

// Pages
import WelcomePage from './pages/WelcomePage';
import CourseSelectionPage from './pages/CourseSelectionPage';
import VARKQuestionnairePage from './pages/VARKQuestionnairePage';
import DiagnosticPage from './pages/DiagnosticPage';
import ResultsPage from './pages/ResultsPage';
import PracticeModePage from './pages/PracticeModePage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import ProfilePage from './pages/ProfilePage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import CourseOnboardingPage from './pages/CourseOnboardingPage';
import TeacherRegistrationPage from './pages/TeacherRegistrationPage';
import ChapterSelectionPage from './pages/ChapterSelectionPage';
import AccountingCourse from './pages/AccountingCourse';

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);
  
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/courses" element={<CourseSelectionPage />} />
          <Route path="/vark/:courseId" element={<VARKQuestionnairePage />} />
          <Route path="/accounting" element={<AccountingCourse />} />
          <Route path="/diagnostic/:courseId" element={<DiagnosticPage />} />
          <Route path="/results/:courseId" element={<ResultsPage />} />
          <Route path="/onboarding/:courseId" element={<CourseOnboardingPage />} />
          <Route path="/chapters/:courseId" element={<ChapterSelectionPage />} />
          <Route path="/practice/:courseId" element={<PracticeModePage />} />
          <Route path="/summary/:sessionId" element={<SessionSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contabilidad" element={<AccountingCourse />} />
          <Route path="/teacher" element={<TeacherDashboardPage />} />
          <Route path="/teacher-registration" element={<TeacherRegistrationPage />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;