import { useEffect, useRef, useState } from 'react';

export const useWebRTC = (roomId) => {
  const [peers, setPeers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const peerConnections = useRef({});

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createPeerConnection = (peerId, stream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = event => {
      if (event.candidate) {
        // Send candidate to signaling server
      }
    };

    pc.ontrack = event => {
      setPeers(prev => [...prev, { id: peerId, stream: event.streams[0] }]);
    };

    peerConnections.current[peerId] = pc;
    return pc;
  };

  useEffect(() => {
    const init = async () => {
      const stream = await initializeMedia();
      if (stream) {
        // Connect to signaling server and handle peer connections
      }
    };

    init();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [roomId]);

  return { localStream, peers };
};