
import React, { useState, useCallback } from 'react';
import { generateComplexPlan } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ComplexPlanner: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Ingredients: 3 chicken breasts, 1 head of broccoli, 2 carrots, half a bag of spinach, 1 onion, garlic, rice.\n\nDietary restrictions: None.\n\nGenerate a 3-day meal plan for 2 people that uses these ingredients.');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
      setError('Please describe your ingredients and needs.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const plan = await generateComplexPlan(prompt);
      setResult(plan);
    } catch (err) {
      setError('Failed to generate a meal plan. The model may be busy. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-800">Smart Meal Planner</h2>
        <p className="text-emerald-700 mt-1">Let our most powerful AI create a detailed meal plan to minimize waste. Be descriptive!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="List your ingredients, dietary needs, number of people, etc."
            className="w-full p-3 h-60 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors flex items-center justify-center"
          >
            {isLoading ? 'Generating Plan...' : 'Generate Meal Plan'}
          </button>
        </div>
        
        <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 min-h-[200px]">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">Your Meal Plan</h3>
          {isLoading && <LoadingSpinner text="Generating complex plan..."/>}
          {error && <p className="text-red-500">{error}</p>}
          {result && <div className="prose prose-sm max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br />')}}></div>}
        </div>
      </div>
    </div>
  );
};

export default ComplexPlanner;
