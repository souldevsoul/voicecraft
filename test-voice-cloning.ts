/**
 * VoiceCraft Voice Cloning Test Script
 *
 * This script tests the complete voice cloning flow:
 * 1. Upload audio to Replicate
 * 2. Clone voice and get voice_id
 * 3. Generate speech using cloned voice
 * 4. Verify the audio output
 */

import Replicate from 'replicate';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const AUDIO_FILE_PATH = '/Users/rentamac/Downloads/sample-pack-links-in-bio-sampled-stuff-288267.mp3';

// Test configuration
const TEST_CONFIG = {
  voiceName: 'Test Voice Clone',
  testText: 'Hello! This is a test of my cloned voice. How does it sound? Pretty amazing, right?',
  userId: 'test_user_' + Date.now(),
};

async function uploadAudioToReplicate(audioPath: string): Promise<string> {
  console.log('\n📤 Step 1: Uploading audio file to Replicate...');

  // Read the audio file
  const audioBuffer = fs.readFileSync(audioPath);
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

  // Upload to Replicate
  const file = await replicate.files.create(audioBlob as any);

  console.log('✅ Audio uploaded successfully!');
  console.log('   File ID:', file.id);
  console.log('   URLs:', file.urls);

  return file.urls.get;
}

async function testVoiceCloning(audioUrl: string) {
  console.log('\n🎤 Step 2: Cloning voice with Replicate...');
  console.log('   Audio URL:', audioUrl);

  const output: any = await replicate.run(
    "minimax/voice-cloning:fff8a670880f066d3742838515a88f7f0a3ae40a4f2e06dae0f7f70ba63582d7",
    {
      input: {
        voice_file: audioUrl,
        model: "speech-02-turbo",
        accuracy: 0.7,
        need_noise_reduction: true,
        need_volume_normalization: true,
      }
    }
  );

  console.log('✅ Voice cloned successfully!');
  console.log('   Voice ID:', output.voice_id);
  console.log('   Full output:', JSON.stringify(output, null, 2));

  return output.voice_id;
}

async function testVoiceGeneration(voiceId: string, text: string) {
  console.log('\n🔊 Step 3: Generating speech with cloned voice...');
  console.log('   Voice ID:', voiceId);
  console.log('   Text:', text);

  const output = await replicate.run(
    "minimax/speech-02-turbo:e2e8812b45eefa93b20990418480fe628ddce470f9b72909a175d65e288ff3d5",
    {
      input: {
        text: text,
        voice_id: voiceId,
        emotion: "happy",
        speed: 1.0,
        pitch: 0,
        volume: 1.0,
        audio_format: "mp3",
        sample_rate: 32000,
      }
    }
  );

  console.log('✅ Speech generated successfully!');
  console.log('   Audio URL:', output);

  return output;
}

async function testViaAPI() {
  console.log('\n🌐 Step 4: Testing via VoiceCraft API endpoints...');

  const baseUrl = 'http://localhost:3000';

  // First, upload audio to Replicate to get URL
  const audioUrl = await uploadAudioToReplicate(AUDIO_FILE_PATH);

  // Test 1: Clone voice via API
  console.log('\n   4.1: Testing POST /api/voices/clone');
  const cloneResponse = await fetch(`${baseUrl}/api/voices/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: TEST_CONFIG.userId,
      name: TEST_CONFIG.voiceName,
      description: 'Test voice clone via API',
      audioFileUrl: audioUrl,
      model: 'speech-02-turbo',
      accuracy: 0.7,
      noiseReduction: true,
      normalizeVolume: true,
      language: 'en-US',
    })
  });

  if (!cloneResponse.ok) {
    const error = await cloneResponse.json();
    console.error('❌ Clone API failed:', error);
    throw new Error('Clone API failed');
  }

  const cloneData = await cloneResponse.json();
  console.log('   ✅ Clone API success:', {
    id: cloneData.voice.id,
    voiceId: cloneData.voice.voiceId,
    name: cloneData.voice.name,
  });

  // Test 2: Generate speech via API
  console.log('\n   4.2: Testing POST /api/voices/generate with custom voice');
  const generateResponse = await fetch(`${baseUrl}/api/voices/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: TEST_CONFIG.testText,
      userId: TEST_CONFIG.userId,
      voiceId: cloneData.voice.voiceId,
      emotion: 'happy',
      speed: 1.0,
    })
  });

  if (!generateResponse.ok) {
    const error = await generateResponse.json();
    console.error('❌ Generate API failed:', error);
    throw new Error('Generate API failed');
  }

  const generateData = await generateResponse.json();
  console.log('   ✅ Generate API success:', {
    audioUrl: generateData.audioUrl,
    isCustomVoice: generateData.metadata.isCustomVoice,
    voiceName: generateData.metadata.voiceName,
  });

  // Test 3: List voices via API
  console.log('\n   4.3: Testing GET /api/voices/my-clones');
  const listResponse = await fetch(
    `${baseUrl}/api/voices/my-clones?userId=${TEST_CONFIG.userId}`,
    { method: 'GET' }
  );

  if (!listResponse.ok) {
    const error = await listResponse.json();
    console.error('❌ List API failed:', error);
    throw new Error('List API failed');
  }

  const listData = await listResponse.json();
  console.log('   ✅ List API success:', {
    totalVoices: listData.voices.length,
    voices: listData.voices.map((v: any) => ({ id: v.id, name: v.name })),
  });

  return {
    clonedVoice: cloneData.voice,
    generatedAudio: generateData.audioUrl,
    voiceList: listData.voices,
  };
}

async function runCompleteTest() {
  console.log('🚀 VoiceCraft Voice Cloning - Complete Integration Test\n');
  console.log('=' .repeat(60));

  try {
    // Check if REPLICATE_API_TOKEN is set
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN not set in environment');
    }

    console.log('✅ Replicate API token found');
    console.log('📁 Audio file:', AUDIO_FILE_PATH);
    console.log('📊 File size:', fs.statSync(AUDIO_FILE_PATH).size, 'bytes');

    // Test 1: Direct Replicate API calls
    console.log('\n' + '='.repeat(60));
    console.log('TEST 1: Direct Replicate API Integration');
    console.log('='.repeat(60));

    const audioUrl = await uploadAudioToReplicate(AUDIO_FILE_PATH);
    const voiceId = await testVoiceCloning(audioUrl);
    const audioOutput = await testVoiceGeneration(voiceId, TEST_CONFIG.testText);

    console.log('\n✅ Direct Replicate test completed!');
    console.log('   Voice ID:', voiceId);
    console.log('   Generated Audio:', audioOutput);

    // Test 2: VoiceCraft API endpoints
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: VoiceCraft API Endpoints');
    console.log('='.repeat(60));

    const apiResults = await testViaAPI();

    console.log('\n✅ API test completed!');
    console.log('   Cloned Voice ID:', apiResults.clonedVoice.voiceId);
    console.log('   Generated Audio:', apiResults.generatedAudio);
    console.log('   Total Voices:', apiResults.voiceList.length);

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n📋 Summary:');
    console.log('   ✅ Audio upload to Replicate');
    console.log('   ✅ Voice cloning via Replicate');
    console.log('   ✅ Speech generation with custom voice');
    console.log('   ✅ POST /api/voices/clone endpoint');
    console.log('   ✅ POST /api/voices/generate endpoint');
    console.log('   ✅ GET /api/voices/my-clones endpoint');
    console.log('\n🔗 Generated Audio URLs:');
    console.log('   Direct:', audioOutput);
    console.log('   Via API:', apiResults.generatedAudio);
    console.log('\n✨ Integration is fully working!\n');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the test
runCompleteTest();
