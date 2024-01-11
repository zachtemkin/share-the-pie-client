"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useDetectDevice from "../../hooks/useDetectDevice";
import styled from "styled-components";

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
  width: 5rem;
  height: 5rem;
  border: none;
  border-radius: 5rem;
  position: fixed;
  bottom: 3rem;
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
  const [imageData, setImageData] = useState("");
  const { isMobile } = useDetectDevice();
  const router = useRouter();

  async function uploadDocument(imageData) {
    try {
      const response = await fetch("https://localhost:4000/parseReceiptImage", {
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
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState("");

  const getVideo = () => {
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
  };

  const takePicture = () => {
    const width = 3264 / 2;
    const height = 2448 / 2;
    let video = videoRef.current;
    let canvas = canvasRef.current;

    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    let imageData = canvas.toDataURL("image/png");
    setImage(imageData);

    setImageData(imageData);
  };

  useEffect(() => {
    getVideo();
  }, []);

  useEffect(() => {
    if (imageData) {
      uploadDocument(imageData);
      router.push("/add-handles");
    }
  }, [imageData, router]);

  return (
    <Container>
      <CameraPreview
        ref={videoRef}
        autoPlay={true}
        muted={true}
        playsInline={true}
      />
      <CaptureButton onClick={takePicture} />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Container>
  );
};

export default Camera;
