import React from 'react';
import { Link } from 'react-router-dom';

function CourseDisplay({ chapters, language }) {
  if (!chapters || chapters.length === 0) {
    return <div>No chapters available.</div>;
  }
    console.log('CourseDisplay chapterss:', chapters);
  return (
    <div style={styles.container}>
      <h1>Course Content</h1>
      <ul style={styles.chapterList}>
        {chapters.map((chapter, index) => (
          <li key={index} style={styles.chapterListItem}>
            <Link
              to={`/${language}/chapter/${encodeURIComponent(chapter.chapter_title.toLowerCase().replace(/\s+/g, '-'))}`}
              style={styles.chapterLink}
            >
              {chapter.chapter}. {chapter.chapter_title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  chapterList: {
    listStyleType: 'none',
    padding: 0,
  },
  chapterListItem: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  chapterLink: {
    textDecoration: 'none',
    color: '#333',
    display: 'block',
  },
};

export default CourseDisplay;