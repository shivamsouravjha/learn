import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams
} from 'react-router-dom';

import CourseDisplay from './CourseDisplay';
import ChapterDetailPage from './ChapterDetailPage';
import './App.css';

function LanguageSelector({ onSelect }) {
  const navigate = useNavigate();
  const languages = ['kotlin', 'python3', 'golang', 'c', 'c++', 'javascript'];

  const handleSelect = (lang) => {
    onSelect(lang);
    navigate(`/${lang}`);
  };

  return (
    <div className="language-buttons">
      {languages.map((lang) => (
        <button key={lang} onClick={() => handleSelect(lang)}>
          {lang.charAt(0).toUpperCase() + lang.slice(1)}
        </button>
      ))}
    </div>
  );
}

function CoursePage({ chapterDetailsCache, setChapterDetailsCache }) {
  const { language } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [chaptersError, setChaptersError] = useState(null);
  const loadingStyles = {
    loadingContainer: {
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
    },
    loadingText: { // Renamed for clarity, since 'div' is not a valid key
      color: '#333',
      marginTop: '10px',
      fontSize: '1.2em',
    },
    processingMessage: {
      fontStyle: 'italic',
      color: '#666',
      marginTop: '5px',
    },
  };
  console.log('CoursePage rendered with language:', language); // ADD THIS LINE

  useEffect(() => {
    if (!language) return;

    const fetchInitialData = async () => {
      setLoadingChapters(true);
      setChaptersError(null);
      setChapters([]);

      const storedChapters = localStorage.getItem(`${language}-courseChapters`);
      if (storedChapters) {
        setChapters(JSON.parse(storedChapters));
        setLoadingChapters(false);
        return;
      }

      try {
        const response = await fetch(`https://unittest.fly.dev/suggest?language=${language}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched course chapters:', data);
        setChapters(data);
        localStorage.setItem(`${language}-courseChapters`, JSON.stringify(data));

        data.forEach(chapter => {
          console.log(`Storing chapter chapter-${language}-${chapter.chapter_title.toLowerCase().replace(/\s+/g, '-')} in localStorage`);
          localStorage.setItem(`chapter-${language}-${chapter.chapter_title.toLowerCase().replace(/\s+/g, '-')}`, JSON.stringify({
            chapter_number: chapter.chapter,
            chapter_title: chapter.chapter_title,
            chapter_description: chapter.chapter_description,
          }));
        });

        setLoadingChapters(false);
      } catch (error) {
        setChaptersError(error.message);
        setLoadingChapters(false);
      }
    };

    fetchInitialData();
  }, [language]);

  if (loadingChapters) return (
    <div className="loading-container">
      <img src="/loading.gif" alt="Loading..." />
      <div>Loading {language} course content...</div>
      <div style={loadingStyles.loadingText}>Loading {language} course content...</div>
      <div style={loadingStyles.processingMessage}>We're processing your request, please wait.</div>

    </div>
  );
  if (chaptersError) return <div>Error loading {language} course content: {chaptersError}</div>;
  console.log('ds:', chapters);
  return <CourseDisplay chapters={chapters} language={language} />;
}

function AppContent({ setSelectedLanguage, chapterDetailsCache, setChapterDetailsCache }) {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<>
            <header className="App-header">
              <h1>Programming Courses</h1>
            </header>

            <LanguageSelector onSelect={setSelectedLanguage} />
            <div>Please select a language to start learning.</div>
          </>
          } />
          <Route path="/:language" element={
            <CoursePage
              chapterDetailsCache={chapterDetailsCache}
              setChapterDetailsCache={setChapterDetailsCache}
            />
          } />
          <Route path="/:language/chapter/:chapterTitle" element={
            <ChapterDetailPage
              chapterDetailsCache={chapterDetailsCache}
              setChapterDetailsCache={setChapterDetailsCache}
            />
          } />
        </Routes>
      </main>
    </>
  );
}

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [chapterDetailsCache, setChapterDetailsCache] = useState({});

  return (
    <div className="App">
      <Router>
        <AppContent
          setSelectedLanguage={setSelectedLanguage}
          chapterDetailsCache={chapterDetailsCache}
          setChapterDetailsCache={setChapterDetailsCache}
        />
      </Router>
    </div>
  );
}


export default App;