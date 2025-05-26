import React from 'react';
import { Link } from 'react-router-dom';
import './CourseDisplay.css';

function CourseDisplay({ chapters, language }) {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="no-chapters">
        NO CHAPTERS AVAILABLE!
      </div>
    );
  }
  console.log('CourseDisplay chapterss:', chapters);
  return (
    <div className="course-container">
      <h1 className="course-title">COURSE CONTENT</h1>
      <ul className="chapter-list">
        {chapters.map((chapter, index) => (
          <li key={index} className="chapter-list-item" style={{transform: `rotate(${(Math.random() * 2 - 1)}deg)`}}>
            <Link
              to={`/${language}/chapter/${encodeURIComponent(chapter.chapter_title.toLowerCase().replace(/\s+/g, '-'))}`}
              className="chapter-link"
            >
              {chapter.chapter}. {chapter.chapter_title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDisplay;