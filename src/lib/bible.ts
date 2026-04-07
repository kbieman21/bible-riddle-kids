export async function getVerse(reference: string, translation = 'web') {
  const baseUrl = import.meta.env.VITE_BIBLE_API_BASE || 'https://bible-api.com';
  
  try {
    const res = await fetch(
      `${baseUrl}/${encodeURIComponent(reference)}?translation=${translation}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    return {
      reference: data.reference,
      text: data.text,
      translation: data.translation_id || translation,
    };
  } catch (error) {
    console.error('Bible API error:', error);
    return {
      reference,
      text: 'Verse could not be loaded. Please check your internet connection.',
      translation: translation,
    };
  }
}