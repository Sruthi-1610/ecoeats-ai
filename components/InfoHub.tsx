
import React, { useState, useCallback } from 'react';
import { getFoodWasteFacts } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { GroundingChunk } from '../types';

const InfoHub: React.FC = () => {
    const [query, setQuery] = useState<string>('What are the latest statistics on food waste in the US?');
    const [result, setResult] = useState<string>('');
    const [chunks, setChunks] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = useCallback(async () => {
        if (!query) {
            setError('Please enter a question.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        setChunks([]);
        try {
            const response = await getFoodWasteFacts(query);
            setResult(response.text);
            setChunks(response.chunks);
        } catch (err) {
            setError('Failed to fetch facts. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [query]);
    
    const renderChunks = () => (
      <div className="mt-4 pt-4 border-t border-emerald-200">
          <h4 className="font-semibold text-emerald-800">Sources:</h4>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              {chunks.map((chunk, index) => (
                  chunk.web && (
                      <li key={index}>
                          <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                              {chunk.web.title}
                          </a>
                      </li>
                  )
              ))}
          </ul>
      </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-emerald-800">Food Waste Facts Hub</h2>
                <p className="text-emerald-700 mt-1">Get up-to-date information powered by Google Search.</p>
            </div>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about food waste..."
                    className="flex-grow p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 min-h-[200px]">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Information</h3>
                {isLoading && <LoadingSpinner text="Searching the web..."/>}
                {error && <p className="text-red-500">{error}</p>}
                {result && (
                    <div>
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br />')}}></div>
                      {chunks.length > 0 && renderChunks()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoHub;
