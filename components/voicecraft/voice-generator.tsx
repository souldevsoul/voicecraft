"use client"

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@mantine/core';
import { Slider } from '@mantine/core';
import { Select } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { VoiceSelector } from './voice-selector';
import { AudioPlayer } from './audio-player';
import { GenerationProgress } from './generation-progress';
import { Mic, Sparkles, Download, Volume2, Gauge, Music } from 'lucide-react';

// Constants
const MAX_CHARACTERS = 10000;

// Available emotions for Minimax Speech-02-Turbo
const EMOTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'angry', label: 'Angry' },
  { value: 'excited', label: 'Excited' },
  { value: 'calm', label: 'Calm' },
  { value: 'serious', label: 'Serious' },
  { value: 'friendly', label: 'Friendly' },
];

// Preset voices (system voices from Minimax)
const PRESET_VOICES = [
  {
    id: 'Wise_Woman',
    name: 'Wise Woman',
    language: 'en-US',
    gender: 'female' as const,
    description: 'Mature, professional female voice',
    previewUrl: undefined,
    isCloned: false,
  },
  // More voices can be added as they become available from Minimax
];

interface VoiceGeneratorProps {
  className?: string;
}

export function VoiceGenerator({ className }: VoiceGeneratorProps) {
  // State
  const [text, setText] = React.useState('');
  const [selectedVoiceId, setSelectedVoiceId] = React.useState('Wise_Woman');
  const [emotion, setEmotion] = React.useState('auto');
  const [speed, setSpeed] = React.useState(1.0);
  const [pitch, setPitch] = React.useState(0);
  const [volume, setVolume] = React.useState(1.0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  // Character count
  const characterCount = text.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Handle voice generation
  const handleGenerate = async () => {
    // Validation
    if (!text.trim()) {
      notifications.show({
        title: 'Text Required',
        message: 'Please enter some text to generate speech',
        color: 'red',
      });
      return;
    }

    if (isOverLimit) {
      notifications.show({
        title: 'Text Too Long',
        message: `Text exceeds the maximum limit of ${MAX_CHARACTERS} characters`,
        color: 'red',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedAudioUrl(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Call API
      const response = await fetch('/api/voices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: selectedVoiceId,
          emotion,
          speed,
          pitch,
          volume,
          audioFormat: 'mp3',
          sampleRate: 48000,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Voice generation failed');
      }

      const data = await response.json();

      if (data.success && data.audioUrl) {
        setGeneratedAudioUrl(data.audioUrl);

        notifications.show({
          title: 'Success!',
          message: 'Voice generated successfully',
          color: 'green',
        });
      } else {
        throw new Error('No audio URL returned');
      }
    } catch (error: any) {
      console.error('Generation error:', error);

      notifications.show({
        title: 'Generation Failed',
        message: error.message || 'An error occurred during voice generation',
        color: 'red',
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!generatedAudioUrl) return;

    const link = document.createElement('a');
    link.href = generatedAudioUrl;
    link.download = `voicecraft-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      title: 'Download Started',
      message: 'Your audio file is being downloaded',
      color: 'blue',
    });
  };

  return (
    <div className={className}>
      <Card variant="outlined" hover="none" className="p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 border-4 border-black">
              <Mic className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase">Voice Generator</h2>
              <p className="text-sm text-gray-600">Create professional voice content with AI</p>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Text to Speech
            </label>
            <Textarea
              placeholder="Enter the text you want to convert to speech..."
              value={text}
              onChange={handleTextChange}
              minRows={6}
              maxRows={12}
              styles={{
                input: {
                  borderWidth: '2px',
                  borderColor: isOverLimit ? '#ef4444' : '#000000',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                },
              }}
              disabled={isGenerating}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Maximum {MAX_CHARACTERS.toLocaleString()} characters
              </p>
              <p className={`text-sm font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-700'}`}>
                {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Voice Selection */}
          <VoiceSelector
            voices={PRESET_VOICES}
            selectedVoiceId={selectedVoiceId}
            onVoiceSelect={(voice) => setSelectedVoiceId(voice.id)}
            showFilters={false}
          />

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion */}
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Emotion
                </div>
              </label>
              <Select
                data={EMOTIONS}
                value={emotion}
                onChange={(value) => setEmotion(value || 'auto')}
                disabled={isGenerating}
                styles={{
                  input: {
                    borderWidth: '2px',
                    borderColor: '#000000',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  },
                }}
              />
            </div>

            {/* Speed */}
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Speed: {speed.toFixed(1)}x
                </div>
              </label>
              <Slider
                value={speed}
                onChange={setSpeed}
                min={0.5}
                max={2.0}
                step={0.1}
                marks={[
                  { value: 0.5, label: '0.5x' },
                  { value: 1.0, label: '1x' },
                  { value: 1.5, label: '1.5x' },
                  { value: 2.0, label: '2x' },
                ]}
                disabled={isGenerating}
                color="yellow"
                styles={{
                  markLabel: {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  },
                }}
              />
            </div>

            {/* Pitch */}
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Pitch: {pitch > 0 ? '+' : ''}{pitch}
                </div>
              </label>
              <Slider
                value={pitch}
                onChange={setPitch}
                min={-12}
                max={12}
                step={1}
                marks={[
                  { value: -12, label: '-12' },
                  { value: 0, label: '0' },
                  { value: 12, label: '+12' },
                ]}
                disabled={isGenerating}
                color="yellow"
                styles={{
                  markLabel: {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  },
                }}
              />
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Volume: {volume.toFixed(1)}
                </div>
              </label>
              <Slider
                value={volume}
                onChange={setVolume}
                min={0}
                max={10}
                step={0.1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
                disabled={isGenerating}
                color="yellow"
                styles={{
                  markLabel: {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  },
                }}
              />
            </div>
          </div>

          {/* Progress */}
          {isGenerating && (
            <GenerationProgress
              status="processing"
              progress={progress}
              steps={[
                {
                  id: 'process-text',
                  label: 'Processing text',
                  progress: progress >= 30 ? 100 : (progress / 30) * 100,
                  status: progress >= 30 ? 'completed' : 'processing'
                },
                {
                  id: 'generate-audio',
                  label: 'Generating audio',
                  progress: progress >= 60 ? 100 : Math.max(0, ((progress - 30) / 30) * 100),
                  status: progress >= 60 ? 'completed' : progress >= 30 ? 'processing' : 'queued'
                },
                {
                  id: 'finalize',
                  label: 'Finalizing',
                  progress: progress >= 90 ? 100 : Math.max(0, ((progress - 60) / 30) * 100),
                  status: progress >= 90 ? 'completed' : progress >= 60 ? 'processing' : 'queued'
                },
              ]}
            />
          )}

          {/* Generate Button */}
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim() || isOverLimit}
            >
              {isGenerating ? 'Generating...' : 'Generate Voice'}
            </Button>
          </div>

          {/* Audio Player */}
          {generatedAudioUrl && !isGenerating && (
            <div className="space-y-4">
              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold uppercase">Generated Audio</h3>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>

              <AudioPlayer
                audioUrl={generatedAudioUrl}
                title="Generated Voice"
                waveformColor="primary"
                showDownload
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
