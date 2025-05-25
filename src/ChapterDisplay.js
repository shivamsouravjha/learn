import React, { useState, useRef } from 'react';

const ChapterDisplay = ({ data }) => {
  console.log('ChapterDisplay data:', data);
  const [copied, setCopied] = useState(false);
  const codeSnippetRef = useRef(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  if (!data) {
    return <div style={styles.noData}>No chapter data to display.</div>;
  }

  const renderCodeSnippet = (code) => (
    <div style={styles.codeSnippetContainer}>
      <pre ref={codeSnippetRef} style={styles.codeSnippetPre}>
        <code style={styles.code}>{code}</code>
      </pre>
    </div>
  );

  return (
    <div style={styles.container}>
      {data.sections && data.sections.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Sections</h3>
          <ul style={styles.list}>
            {data.sections.map((section, index) => (
              <li key={index} style={styles.listItem}>
                <h4 style={styles.subsectionTitle}>{section.section_title}</h4>
                {section.section_content.includes('```kotlin') ? (
                  renderCodeSnippet(
                    section.section_content.split('```kotlin')[1].split('```')[0].trim()
                  )
                ) : (
                  <p style={styles.paragraph}>{section.section_content}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.exercises && data.exercises.length > 0 && (
        <section style={styles.exercises}>
          <h3 style={styles.sectionTitle}>Exercises</h3>
          <ul style={styles.list}>
            {data.exercises.map((exercise, index) => (
              <li key={index} style={styles.listItem}>
                <h4 style={styles.subsectionTitle}>{exercise.exercise_title}</h4>
                <p style={styles.paragraph}>{exercise.exercise_description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.examples && data.examples.length > 0 && (
        <section style={styles.examples}>
          <h3 style={styles.sectionTitle}>Examples</h3>
          <ul style={styles.list}>
            {data.examples.map((example, index) => (
              <li key={index} style={styles.listItem}>
                <h4 style={styles.subsectionTitle}>{example.example_title}</h4>
                {example.example_code && example.example_code.startsWith('```kotlin') ? (
                  renderCodeSnippet(
                    example.example_code.split('```kotlin')[1].split('```')[0].trim()
                  )
                ) : (
                  <pre style={styles.pre}><code style={styles.code}>{example.example_code}</code></pre>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.chapter_description && (
        <section style={styles.description}>
          <h3 style={styles.sectionTitle}>Description</h3>
          {data.chapter_description.includes('```kotlin') ? (
            renderCodeSnippet(
              data.chapter_description.split('```kotlin')[1].split('```')[0].trim()
            )
          ) : (
            <p style={styles.paragraph}>{data.chapter_description}</p>
          )}
        </section>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    padding: '25px',
    borderRadius: '8px',
    fontFamily: 'Consolas, monospace',
    lineHeight: '1.6',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    textAlign: 'left',
  },
  noData: {
    color: '#999',
    padding: '20px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '25px',
    padding: '20px',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#252526',
    textAlign: 'left',
  },
  exercises: {
    marginBottom: '25px',
    padding: '20px',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#252526',
    textAlign: 'left',
  },
  examples: {
    marginBottom: '25px',
    padding: '20px',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#252526',
    textAlign: 'left',
  },
  description: {
    marginBottom: '25px',
    padding: '20px',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#252526',
    textAlign: 'left',
  },
  sectionTitle: {
    color: '#569CD6',
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
    marginBottom: '15px',
    fontSize: '1.4em',
    textAlign: 'left',
  },
  subsectionTitle: {
    color: '#CE9178',
    marginTop: '15px',
    marginBottom: '10px',
    fontSize: '1.1em',
    textAlign: 'left',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
    textAlign: 'left',
  },
  listItem: {
    marginBottom: '10px',
    textAlign: 'left',
  },
  paragraph: {
    lineHeight: '1.7',
    textAlign: 'left',
  },
  codeSnippetContainer: {
    position: 'relative',
    marginBottom: '15px',
  },
  codeSnippetPre: {
    margin: '0',
    overflowX: 'auto',
    borderRadius: '5px',
  },
  pre: {
    margin: '10px 0',
    overflowX: 'auto',
    borderRadius: '5px',
  },
  code: {
    display: 'block',
    padding: '15px',
    backgroundColor: '#2D2D2D',
    color: '#D16969',
    borderRadius: '5px',
    overflowX: 'auto',
    fontSize: '0.9em',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    margin: 0, // Reset margin for code within snippet container
  },
  copyButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: '#383838',
    color: '#D4D4D4',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    fontSize: '0.8em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#505050',
    },
    '&:focus': {
      outline: 'none',
    },
  },
};

export default ChapterDisplay;