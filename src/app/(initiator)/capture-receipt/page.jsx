"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useDetectDevice from "@/app/hooks/useDetectDevice";
import useChooseServer from "@/app/hooks/useChooseServer";
import styled from "styled-components";
import { useAppContext } from "../../AppContext";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  border-radius: 3rem;
  overflow: hidden;
`;

const CaptureButton = styled.button`
  z-index: 2;
  background-color: #ffffff;
  width: 50vw;
  height: 3.5rem;
  border: none;
  border-radius: 0.75rem;
  position: fixed;
  bottom: 2rem;
  transition: all 0.2s;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2),
    0 3px 20px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 1.125rem;
  color: rgba(0, 0, 0, 1);
  font-weight: 600;
  line-height: 1.25rem;

  &:active {
    transform: scale(0.9);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25), 0 1px 1px rgba(0, 0, 0, 0.3);
  }

  @keyframes width-grow {
    0% {
      width: 50vw;
      background: rgba(255, 255, 255, 1);
    }
    100% {
      width: 85vw;
      background: rgba(255, 255, 255, 0.25);
    }
  }

  ${({ isUploading }) =>
    isUploading &&
    `
    mix-blend-mode: overlay;
    animation: width-grow 2s ease-in-out infinite alternate;
  `}
`;

const CameraPreview = styled.video`
  z-index: 1;
  top: 0;
  bottom: 0;
  background-size: cover;
  overflow: hidden;
  height: auto;
  min-height: 100%;
  width: auto;
  object-fit: cover;
`;

const Camera = () => {
  const server = useChooseServer();
  const { isMobile } = useDetectDevice();
  const router = useRouter();
  const { appState, setAppState } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);

  async function uploadDocument(imageData) {
    try {
      const response = await fetch(`${server.api}/parseReceiptImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const getVideo = useCallback(() => {
    const videoObj = isMobile
      ? {
          facingMode: { exact: "environment" },
          width: { ideal: 3264 / 2 },
          height: { ideal: 2448 / 2 },
        }
      : true;

    navigator.mediaDevices
      .getUserMedia({
        video: videoObj,
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("error:", err);
      });
  }, [isMobile]);

  const takePicture = async () => {
    const video = videoRef.current;
    video.pause();
    video.srcObject.getTracks()[0].stop();

    setIsUploading(true);

    setTimeout(async () => {
      const width = 3264 / 2;
      const height = 2448 / 2;
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, width, height);
      const imageData = canvas.toDataURL("image/png");

      let data = await uploadDocument(imageData);
      setAppState({ sessionId: data.sessionId });
      router.push("/add-handles");
    }, 200);
  };

  useEffect(() => {
    appState.sessionId && router.push("/present-qr");
    getVideo();
  }, [appState.sessionId, getVideo, router]);

  return (
    <Container>
      <CameraPreview
        ref={videoRef}
        autoPlay={true}
        muted={true}
        playsInline={true}
      />
      <CaptureButton onClick={takePicture} $isUploading={isUploading}>
        {!isUploading ? "Scan" : "Processing..."}
      </CaptureButton>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Container>
  );
};

export default Camera;
