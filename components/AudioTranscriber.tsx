
import React, { useState, useRef, useCallback } from 'react';
import { transcribeAudio, generateSpeech } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { MicIcon, PlayIcon } from './IconComponents';

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'finished';

const AudioTranscriber: React.FC = () => {
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [transcribedText, setTranscribedText] = useState('');
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.addEventListener('dataavailable', event => {
                audioChunksRef.current.push(event.data);
            });

            mediaRecorderRef.current.addEventListener('stop', async () => {
                setStatus('processing');
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });

                try {
                    const text = await transcribeAudio(audioFile);
                    setTranscribedText(text);
                    setStatus('finished');
                } catch (err) {
                    console.error('Transcription error:', err);
                    setError('Failed to transcribe audio. Please try again.');
                    setStatus('idle');
                }
            });

            mediaRecorderRef.current.start();
            setStatus('recording');
            setError('');
            setTranscribedText('');
        } catch (err) {
            console.error('Microphone access error:', err);
            setError('Microphone access denied. Please enable it in your browser settings.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && status === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };
    
    // Audio decoding helper functions
    const decode = (base64: string) => {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }

    const decodeAudioData = async (
      data: Uint8Array,
      ctx: AudioContext,
    ): Promise<AudioBuffer> => {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length;
      const buffer = ctx.createBuffer(1, frameCount, 24000); // 1 channel, 24kHz sample rate for TTS
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      return buffer;
    }

    const playSpeech = useCallback(async () => {
        if (!transcribedText) return;
        try {
            const base64Audio = await generateSpeech(transcribedText);
            if (base64Audio) {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const decodedBytes = decode(base64Audio);
                const audioBuffer = await decodeAudioData(decodedBytes, audioContext);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
            }
        } catch (err) {
            console.error('TTS error:', err);
            setError('Could not play audio.');
        }
    }, [transcribedText]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-emerald-800">Voice Note</h2>
                <p className="text-emerald-700 mt-1">Record your available ingredients or ideas, and we'll transcribe them for you.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
                <button
                    onClick={status === 'recording' ? stopRecording : startRecording}
                    disabled={status === 'processing'}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 ${status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                    <MicIcon />
                </button>
                <p className="font-semibold text-lg text-emerald-800">
                    {status === 'idle' && 'Tap to start recording'}
                    {status === 'recording' && 'Recording... Tap to stop'}
                    {status === 'processing' && 'Processing audio...'}
                    {status === 'finished' && 'Recording finished'}
                </p>
            </div>
            
             <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 min-h-[150px]">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Transcription</h3>
                {status === 'processing' && <LoadingSpinner text="Transcribing..."/>}
                {error && <p className="text-red-500">{error}</p>}
                {transcribedText && (
                    <div className="space-y-4">
                        <p className="text-gray-700">{transcribedText}</p>
                        <button onClick={playSpeech} className="flex items-center gap-2 text-sm bg-emerald-100 text-emerald-800 font-semibold px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors">
                            <PlayIcon />
                            Read Aloud
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioTranscriber;
