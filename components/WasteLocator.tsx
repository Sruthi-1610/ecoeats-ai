
import React, { useState, useCallback } from 'react';
import { findNearbyPlaces } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { GroundingChunk } from '../types';
import { MapPinIcon } from './IconComponents';

const WasteLocator: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [chunks, setChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFindPlaces = useCallback(() => {
    setIsLoading(true);
    setError('');
    setResult('');
    setChunks([]);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await findNearbyPlaces({ latitude, longitude });
          setResult(response.text);
          setChunks(response.chunks);
        } catch (err) {
          setError('Could not fetch nearby places. Please try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        setIsLoading(false);
      }
    );
  }, []);
  
  const renderChunks = () => (
    <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-emerald-800">Sources:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
            {chunks.map((chunk, index) => (
                chunk.maps && (
                    <li key={index}>
                        <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                            {chunk.maps.title}
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
        <h2 className="text-2xl font-bold text-emerald-800">Find Local Resources</h2>
        <p className="text-emerald-700 mt-1">Discover nearby food banks, compost centers, and community fridges.</p>
      </div>

      <div className="text-center">
        <button
          onClick={handleFindPlaces}
          disabled={isLoading}
          className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-full hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors flex items-center justify-center mx-auto gap-2"
        >
          <MapPinIcon />
          {isLoading ? 'Searching...' : 'Use My Location to Find Places'}
        </button>
      </div>
      
      <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 min-h-[200px]">
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">Nearby Locations</h3>
        {isLoading && <LoadingSpinner text="Finding places..."/>}
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

export default WasteLocator;
