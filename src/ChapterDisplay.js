import React, { useState, useRef } from 'react';
import './ChapterDisplay.css';

const ChapterDisplay = ({ data }) => {
  console.log('ChapterDisplay data:', data);
  const [copied, setCopied] = useState(false);
  const codeSnippetRef = useRef(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) {
    return <div className="no-data">NO CHAPTER DATA TO DISPLAY!</div>;
  }

  const renderCodeSnippet = (code) => (
    <div className="code-snippet-container">
      <pre className="code-snippet-pre">
        <code className="code">{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="chapter-container">
      {data.sections && data.sections.length > 0 && (
        <section className="section">
          <h3 className="section-title">SECTIONS</h3>
          <ul className="list">
            {data.sections.map((section, index) => (
              <li key={index} className="list-item">
                <h4 className="subsection-title">{section.section_title}</h4>
                {section.section_content.includes('```kotlin') ? (
                  renderCodeSnippet(
                    section.section_content.split('```kotlin')[1].split('```')[0].trim()
                  )
                ) : (
                  <p className="paragraph">{section.section_content}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.exercises && data.exercises.length > 0 && (
        <section className="section exercises">
          <h3 className="section-title">EXERCISES</h3>
          <ul className="list">
            {data.exercises.map((exercise, index) => (
              <li key={index} className="list-item">
                <h4 className="subsection-title">{exercise.exercise_title}</h4>
                <p className="paragraph">{exercise.exercise_description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.examples && data.examples.length > 0 && (
        <section className="section examples">
          <h3 className="section-title">EXAMPLES</h3>
          <ul className="list">
            {data.examples.map((example, index) => (
              <li key={index} className="list-item">
                <h4 className="subsection-title">{example.example_title}</h4>
                {example.example_code && example.example_code.startsWith('```kotlin') ? (
                  renderCodeSnippet(
                    example.example_code.split('```kotlin')[1].split('```')[0].trim()
                  )
                ) : (
                  <pre className="pre"><code className="code">{example.example_code}</code></pre>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.chapter_description && (
        <section className="section description">
          <h3 className="section-title">DESCRIPTION</h3>
          {data.chapter_description.includes('```kotlin') ? (
            renderCodeSnippet(
              data.chapter_description.split('```kotlin')[1].split('```')[0].trim()
            )
          ) : (
            <p className="paragraph">{data.chapter_description}</p>
          )}
        </section>
      )}
    </div>
  );
};

export default ChapterDisplay;