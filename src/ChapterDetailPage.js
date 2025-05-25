import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChapterDisplay from './ChapterDisplay'; // Assuming this component exists

function ChapterDetailPage({ chapterDetailsCache, setChapterDetailsCache }) {
    const { chapterTitle, language } = useParams();
    const normalizedChapterTitle = decodeURIComponent(chapterTitle).toLowerCase().replace(/\s+/g, '-');
    const storedChapterInfoKey = `chapter-${language}-${normalizedChapterTitle}`;

    const chapterKey = decodeURIComponent(chapterTitle).toLowerCase().replace(/\s+/g, '-');
    const [chapterDetails, setChapterDetails] = useState(chapterDetailsCache[storedChapterInfoKey] || null);
    const [loadingDetails, setLoadingDetails] = useState(!chapterDetailsCache[storedChapterInfoKey]);
    const [detailsError, setDetailsError] = useState(null);
    const fetchController = useRef(new AbortController());
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
    useEffect(() => {
        console.log(`[Effect START] ChapterDetailPage for: ${storedChapterInfoKey}`);

        // If data is already in cache, use it immediately and stop loading.
        if (chapterDetailsCache[storedChapterInfoKey]) {
            console.log(`[Cache HIT] ChapterDetailPage: Using CACHED details for ${storedChapterInfoKey}`);
            setChapterDetails(chapterDetailsCache[storedChapterInfoKey]);
            setLoadingDetails(false);
            setDetailsError(null);
            // No need to fetch, so return early
            return;
        }

        // If not in cache, start fetching
        setLoadingDetails(true); // Ensure loading state is true if not from cache
        setDetailsError(null); // Clear any previous errors
        console.log(`[Cache MISS] ChapterDetailPage: Fetching NEW details for ${storedChapterInfoKey}.`);

        // Create a new AbortController for this fetch cycle
        const currentController = new AbortController();
        fetchController.current = currentController; // Store it in the ref

        const fetchChapterDetails = async () => {
            try {
                // Fetch chapter metadata from localStorage
                const storedChapterInfo = localStorage.getItem(storedChapterInfoKey);
                console.log(`[localStorage] Stored chapter info for ${storedChapterInfoKey}:`, storedChapterInfo);

                let chapterNumber = '';
                let chapterDescriptionFromStorage = '';

                if (storedChapterInfo) {
                    const parsedInfo = JSON.parse(storedChapterInfo);
                    chapterNumber = parsedInfo.chapter_number || ''; // Ensure it's a string, default to empty
                    chapterDescriptionFromStorage = parsedInfo.chapter_description || ''; // Ensure it's a string, default to empty
                    console.log(`[localStorage] Parsed Description: "${chapterDescriptionFromStorage}"`);
                } else {
                    console.warn(`[localStorage] Chapter metadata not found for ${storedChapterInfoKey}. Proceeding with empty values.`);
                    // Optionally, you might want to stop here if metadata is critical
                    // or fetch metadata from a separate endpoint if it's missing.
                }

                // Construct the API URL
                const apiUrl = new URL('https://unittest.fly.dev/details');
                apiUrl.searchParams.append('language', language);
                // Use the original (non-normalized) chapterTitle if your API expects it for title search
                // Otherwise, use normalizedChapterTitle if that's what the API expects for ID/lookup
                apiUrl.searchParams.append('chapter_title', (chapterTitle));
                apiUrl.searchParams.append('chapter_number', (chapterNumber));
                apiUrl.searchParams.append('chapter_description', (chapterDescriptionFromStorage));

                console.log('[API Call] Fetching chapter details from:', apiUrl.toString());

                const response = await fetch(apiUrl.toString(), { signal: currentController.signal });

                if (!response.ok) {
                    // Check for specific non-OK statuses if needed, e.g., 404 for not found
                    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText || 'Unknown Error'}`);
                }

                const data = await response.json();
                console.log('[API Response] Successfully fetched details:', data);

                // Update state and cache
                setChapterDetails(data);
                setChapterDetailsCache(prevCache => ({ ...prevCache, [storedChapterInfoKey]: data }));

            } catch (error) {
                // Check if the error was due to an abort signal
                if (error.name === 'AbortError') {
                    console.warn(`[Fetch Aborted] Chapter details fetch for ${storedChapterInfoKey} was aborted.`);
                    // Don't set an error if it was a clean abort
                } else {
                    console.error(`[Fetch Error] Chapter details for ${storedChapterInfoKey}:`, error);
                    setDetailsError(error.message);
                }
            } finally {
                setLoadingDetails(false); // Always stop loading when fetch completes or fails
                console.log(`[Effect END] ChapterDetailPage for: ${storedChapterInfoKey}`);
            }
        };

        fetchChapterDetails();

        // Cleanup function for useEffect
        return () => {
            console.log(`[Cleanup] Aborting fetch for ${storedChapterInfoKey}`);
            fetchController.current.abort(); // Abort any ongoing fetch if component unmounts or deps change
        };
    }, [storedChapterInfoKey, chapterDetailsCache, setChapterDetailsCache, chapterTitle, language]); // Added chapterTitle and language for completeness, though storedChapterInfoKey is derived from them.


    if (loadingDetails) {
        return (
            <div className="loading-container">
            <img src="/loading.gif" alt="Loading..." />
            <div>Loading {language} course content...</div>
            <div style={loadingStyles.loadingText}>Loading {language} course content...</div>
            <div style={loadingStyles.processingMessage}>We're processing your request, please wait.</div>
          </div>
        )
    }

    if (detailsError) {
        return <div>Error loading chapter details: {detailsError}</div>;
    }

    if (!chapterDetails) {
        return <div>Chapter details not found for {storedChapterInfoKey}.</div>;
    }

    return (
        <div>
            <h2>{chapterDetails.chapter_title || chapterKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
            {console.log('ChapterDetailPage: Rendering chapter details:', chapterDetails)}
            <ChapterDisplay data={chapterDetails} />
        </div>
    );
}

export default ChapterDetailPage;