'use strict'
class VocabularuService {
    search = async (word) => {
        try {
            // Gọi API Glosbe để lấy bản dịch tiếng Việt
            const translated = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|vi`);
            if (!translated.ok) throw new Error(`API error: ${translated.statusText}`);
            const data = await translated.json();
            console.log(data)
            const translatedText = data.responseData.translatedText || 'No translation found';
            const segment = data.matches[0]?.segment || 'No translation found';
            // Gọi API DictionaryAPI.dev để lấy định nghĩa chi tiết
            const sanitizedWord = word.replace(/\s+/g, '');
            const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${sanitizedWord}`);
            if (!dictionaryResponse.ok) throw new Error(`Dictionary API error: ${dictionaryResponse.statusText}`);
            const dictionaryData = await dictionaryResponse.json();
            const phonetics = dictionaryData[0]?.phonetics?.[0]?.text || 'No phonetic information';
            const form = dictionaryData[0]?.meanings?.[0]?.partOfSpeech || 'No phonetic information';

            return {
                word: word.toLowerCase(),
                segment: segment,
                translatedText: translatedText,
                phonetics: phonetics,
                form: form
            };
        } catch (error) {
            console.error('Error fetching word:', error);

            return {
                error: error.message || 'Failed to fetch word details'
            };
        }
    };

}
module.exports = new VocabularuService()