"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useDetectDevice from "@/app/hooks/useDetectDevice";
import useChooseServer from "@/app/hooks/useChooseServer";
import styled from "styled-components";
import { useAppContext } from "../../AppContext";
import Container from "@/app/components/container";
import Instructions from "@/app/components/instructions";
import Button from "@/app/components/button";
import Spinner from "@/app/components/spinner";

const SpinnerContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -1.5rem;
`;

const CameraPreview = styled.video`
  z-index: 1;
  top: 0;
  bottom: 0;
  background-size: cover;
  overflow: hidden;
  height: auto;
  min-height: calc(100% - 8rem);
  background: rgba(255, 255, 255, 0.125);
  width: auto;
  object-fit: cover;
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  flex: 1;
  transition: 0.2s all;

  ${(props) =>
    props.$isUploading === true &&
    `
      opacity: 0.25;
      transform: scale(0.8)
    `};
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

      try {
        let data = await uploadDocument(imageData);
        video.srcObject.getTracks()[0].stop();
        setAppState({ sessionId: data.sessionId });
        router.push("/add-handles");
      } catch (error) {
        alert(error);
      }
    }, 200);
  };

  useEffect(() => {
    const hasSessionId =
      (typeof window !== "undefined" &&
        JSON.parse(localStorage.getItem("appState")).sessionId) ||
      false;

    hasSessionId ? router.push("/present-qr") : getVideo();
  }, [getVideo, router]);

  return (
    <Container $isFixedHeight={true}>
      <Instructions>
        {!isUploading ? "Scan a group receipt" : "Please wait"}
      </Instructions>
      {isUploading && (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
      <CameraPreview
        ref={videoRef}
        autoPlay={true}
        muted={true}
        playsInline={true}
        $isUploading={isUploading}
      />
      <Button onClick={takePicture} $size="large" disabled={isUploading}>
        Scan
      </Button>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Container>
  );
};

export default Camera;
