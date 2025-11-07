
import React from 'react';
import { AppView } from '../types';
import { CameraIcon, MapPinIcon, MessageSquareIcon, BrainCircuitIcon, BookOpenIcon, MicIcon } from './IconComponents';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: AppView.ImageAnalyzer, label: 'Fridge Scan', icon: <CameraIcon /> },
    { view: AppView.WasteLocator, label: 'Find Nearby', icon: <MapPinIcon /> },
    { view: AppView.ChatBot, label: 'AI Assistant', icon: <MessageSquareIcon /> },
    { view: AppView.ComplexPlanner, label: 'Meal Plan', icon: <BrainCircuitIcon /> },
    { view: AppView.InfoHub, label: 'Facts Hub', icon: <BookOpenIcon /> },
    { view: AppView.AudioTranscriber, label: 'Voice Note', icon: <MicIcon /> },
  ];

  return (
    <nav className="p-2 border-b border-emerald-200">
      <div className="flex flex-wrap justify-center gap-1 md:gap-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm md:px-4 md:py-2.5 md:text-base font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
              ${currentView === item.view 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-transparent text-emerald-700 hover:bg-emerald-100'
              }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Header;
