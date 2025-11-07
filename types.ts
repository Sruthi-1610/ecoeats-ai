
export enum AppView {
  ImageAnalyzer = 'Image Analyzer',
  WasteLocator = 'Waste Locator',
  ChatBot = 'AI Assistant',
  ComplexPlanner = 'Meal Planner',
  InfoHub = 'Facts Hub',
  AudioTranscriber = 'Voice Note',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        text: string;
      }[];
    }[];
  };
}
