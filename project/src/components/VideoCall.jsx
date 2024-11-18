import React, { useEffect, useRef } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';

export default function VideoCall({ roomId }) {
  const { localStream, peers } = useWebRTC(roomId);
  const localVideoRef = useRef();

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="relative">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg"
        />
        <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          You
        </div>
      </div>
      {peers.map(peer => (
        <div key={peer.id} className="relative">
          <video
            autoPlay
            playsInline
            srcObject={peer.stream}
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            {peer.id}
          </div>
        </div>
      ))}
    </div>
  );
}