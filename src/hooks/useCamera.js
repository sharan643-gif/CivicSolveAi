// JanSetu AI Inspect — Camera Hook
// Handles permissions, stream management, frame capture at 1 FPS, torch control

import { useState, useRef, useCallback, useEffect } from 'react';

export function useCamera() {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' = rear, 'user' = front
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const latestFrameRef = useRef(null);

  // Compress a video frame to JPEG base64
  const captureFrame = useCallback((quality = 0.6, maxWidth = 640) => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

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

    // Compress to JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const base64 = dataUrl.split(',')[1];
    return { base64, mimeType: 'image/jpeg', width, height };
  }, []);

  // Start camera
  const startCamera = useCallback(async (preferRear = true) => {
    setError(null);

    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported in this browser. Please use Chrome or Edge.');
        return false;
      }

      // Request camera with preferred facing mode
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

      // Attach to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Check torch capability
      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        const capabilities = track.getCapabilities?.() || {};
        setHasTorch(!!capabilities.torch);

        // Apply facing mode to track settings if supported
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

  // Start 1 FPS frame capture loop
  const startFrameCapture = useCallback((onFrame, fps = 1) => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }

    // Capture immediately on start
    const frame = captureFrame();
    if (frame) {
      latestFrameRef.current = frame;
      onFrame?.(frame);
    }

    frameIntervalRef.current = setInterval(() => {
      const frame = captureFrame();
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

  // Capture a single high-quality still
  const captureStill = useCallback(() => {
    return captureFrame(0.85, 1280); // Higher quality for evidence
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
