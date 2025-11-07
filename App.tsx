
import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import ImageAnalyzer from './components/ImageAnalyzer';
import WasteLocator from './components/WasteLocator';
import ChatBot from './components/ChatBot';
import ComplexPlanner from './components/ComplexPlanner';
import InfoHub from './components/InfoHub';
import AudioTranscriber from './components/AudioTranscriber';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ImageAnalyzer);

  const renderView = () => {
    switch (currentView) {
      case AppView.ImageAnalyzer:
        return <ImageAnalyzer />;
      case AppView.WasteLocator:
        return <WasteLocator />;
      case AppView.ChatBot:
        return <ChatBot />;
      case AppView.ComplexPlanner:
        return <ComplexPlanner />;
      case AppView.InfoHub:
        return <InfoHub />;
      case AppView.AudioTranscriber:
        return <AudioTranscriber />;
      default:
        return <ImageAnalyzer />;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900/10 text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="text-center mb-10">
           <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 tracking-tight">Tackling Food Waste, Securing Our Future</h1>
           <p className="mt-4 text-lg text-emerald-700 max-w-2xl mx-auto">Your AI companion for a sustainable kitchen.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-emerald-900/20">
          <Header currentView={currentView} setCurrentView={setCurrentView} />
          <div className="p-4 sm:p-6 md:p-8">
            {renderView()}
          </div>
        </div>
        
        <footer className="text-center mt-12 text-emerald-700/80">
          <p>Built with Gemini & React by a world-class senior frontend engineer.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
