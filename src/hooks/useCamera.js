// JanSetu AI Inspect — Camera Hook (Optimized)
// Handles permissions, stream management, frame capture, torch control
// Optimizations: smaller frames for faster API calls, dark frame detection, reusable canvas

import { useState, useRef, useCallback, useEffect } from 'react';

// Minimum brightness threshold to skip dark/blurry frames (0-255)
const MIN_BRIGHTNESS = 30;
// Minimum variance to detect blur (lower = blurrier)
const MIN_VARIANCE = 15;

export function useCamera() {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analysisCanvasRef = useRef(null); // Reusable canvas for analysis frames
  const streamRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const latestFrameRef = useRef(null);
  const frameStatsRef = useRef({ total: 0, skipped: 0 });

  // Analyze frame brightness and blur (fast approximation)
  const checkFrameQuality = useCallback((ctx, width, height) => {
    try {
      // Sample a small center region (1/4 of frame) for speed
      const sampleW = Math.floor(width / 2);
      const sampleH = Math.floor(height / 2);
      const startX = Math.floor(width / 4);
      const startY = Math.floor(height / 4);
      const imageData = ctx.getImageData(startX, startY, sampleW, sampleH);
      const data = imageData.data;
      const pixels = sampleW * sampleH;

      let sum = 0;
      let sumSq = 0;
      // Sample every 4th pixel for speed
      for (let i = 0; i < data.length; i += 16) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sum += brightness;
        sumSq += brightness * brightness;
      }
      const sampledPixels = Math.floor(pixels / 4);
      const mean = sum / sampledPixels;
      const variance = sumSq / sampledPixels - mean * mean;

      return { brightness: mean, variance, isGood: mean >= MIN_BRIGHTNESS && variance >= MIN_VARIANCE };
    } catch {
      return { brightness: 128, variance: 50, isGood: true }; // Assume good if can't check
    }
  }, []);

  // Compress a video frame to JPEG base64
  // quality: 0.4 for scanning (fast), 0.65 for evidence (quality)
  // maxWidth: 480 for scanning (fast upload), 1024 for evidence
  const captureFrame = useCallback((quality = 0.4, maxWidth = 480, skipQualityCheck = false) => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    // Reuse analysis canvas if available, else use main canvas
    const canvas = analysisCanvasRef.current || canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });

    // Calculate dimensions maintaining aspect ratio
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);

    // Quality check (skip dark/blurry frames unless explicitly bypassed)
    if (!skipQualityCheck) {
      const quality = checkFrameQuality(ctx, width, height);
      if (!quality.isGood) {
        frameStatsRef.current.skipped++;
        return null;
      }
    }

    frameStatsRef.current.total++;
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const base64 = dataUrl.split(',')[1];
    return { base64, mimeType: 'image/jpeg', width, height };
  }, [checkFrameQuality]);

  // Start camera
  const startCamera = useCallback(async (preferRear = true) => {
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported in this browser. Please use Chrome or Edge.');
        return false;
      }

      const constraints = {
        video: {
          facingMode: preferRear ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsActive(true);
      setPermissionState('granted');

      // Reset frame stats
      frameStatsRef.current = { total: 0, skipped: 0 };

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Create reusable analysis canvas (offscreen)
      if (!analysisCanvasRef.current) {
        try {
          analysisCanvasRef.current = document.createElement('canvas');
        } catch {
          // Fallback to main canvas
        }
      }

      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        const capabilities = track.getCapabilities?.() || {};
        setHasTorch(!!capabilities.torch);
        const settings = track.getSettings?.() || {};
        if (settings.facingMode) {
          setFacingMode(settings.facingMode);
        }
      }

      return true;
    } catch (err) {
      console.warn('[useCamera] Start error:', err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please enable camera permissions in your browser settings.');
        setPermissionState('denied');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application. Please close other apps using the camera.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
      return false;
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsActive(false);
    setTorchOn(false);
    setHasTorch(false);
    latestFrameRef.current = null;
  }, []);

  // Switch camera (front/rear)
  const switchCamera = useCallback(async () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    stopCamera();
    await startCamera(newFacing === 'environment');
  }, [facingMode, stopCamera, startCamera]);

  // Toggle torch
  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const newTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: newTorch }]
      });
      setTorchOn(newTorch);
    } catch (err) {
      console.warn('[useCamera] Torch not supported:', err.message);
      setHasTorch(false);
    }
  }, [torchOn]);

  // Start frame capture loop
  // fps: frames per second to capture
  // analysisMode: true = small/fast frames for API, false = larger frames for display
  const startFrameCapture = useCallback((onFrame, fps = 1, analysisMode = true) => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }

    const quality = analysisMode ? 0.4 : 0.65;
    const maxWidth = analysisMode ? 480 : 640;

    // Capture immediately on start
    const frame = captureFrame(quality, maxWidth, !analysisMode);
    if (frame) {
      latestFrameRef.current = frame;
      onFrame?.(frame);
    }

    frameIntervalRef.current = setInterval(() => {
      const frame = captureFrame(quality, maxWidth, !analysisMode);
      if (frame) {
        latestFrameRef.current = frame;
        onFrame?.(frame);
      }
    }, 1000 / fps);
  }, [captureFrame]);

  // Stop frame capture
  const stopFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  // Capture a single high-quality still (for evidence)
  const captureStill = useCallback(() => {
    return captureFrame(0.85, 1024, true); // Higher quality, skip quality check
  }, [captureFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFrameCapture();
      stopCamera();
    };
  }, [stopFrameCapture, stopCamera]);

  return {
    // State
    stream,
    isActive,
    facingMode,
    hasTorch,
    torchOn,
    error,
    permissionState,
    frameStats: frameStatsRef.current,

    // Refs (for attaching to <video>)
    videoRef,
    canvasRef,

    // Actions
    startCamera,
    stopCamera,
    switchCamera,
    toggleTorch,
    startFrameCapture,
    stopFrameCapture,
    captureStill,
    captureFrame,
    latestFrameRef,
  };
}
