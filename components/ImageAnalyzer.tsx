
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CameraIcon } from './IconComponents';

const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('What recipes can I make with these ingredients?');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult('');
      setError('');
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError('Please select an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const analysisResult = await analyzeImage(imageFile, prompt);
      setResult(analysisResult);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-800">Fridge Scan</h2>
        <p className="text-emerald-700 mt-1">Upload a photo of your fridge or pantry to get recipe ideas.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label htmlFor="file-upload" className="cursor-pointer block w-full p-4 text-center border-2 border-dashed border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors">
            {imagePreview ? (
              <img src={imagePreview} alt="Selected preview" className="mx-auto max-h-60 rounded-md" />
            ) : (
              <div className="flex flex-col items-center justify-center text-emerald-600">
                <CameraIcon />
                <span className="mt-2 font-semibold">Click to upload an image</span>
                <span className="text-sm">PNG, JPG, WEBP</span>
              </div>
            )}
          </label>
          <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What can I make with these items?"
            className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !imageFile}
            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors flex items-center justify-center"
          >
            {isLoading ? 'Analyzing...' : 'Get Recipe Ideas'}
          </button>
        </div>
        
        <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 min-h-[200px]">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">Suggestions from AI</h3>
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-red-500">{error}</p>}
          {result && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br />')}}></div>}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
