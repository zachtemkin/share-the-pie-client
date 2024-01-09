"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useDetectDevice from "../../hooks/useDetectDevice";
import Webcam from "react-webcam";
import io from "socket.io-client";
import styled from "styled-components";

const Camera = () => {
  const [imageData, setImageData] = useState("");
  const { isMobile } = useDetectDevice();
  const router = useRouter();

  const uploadDocument = async (imageData) => {
    const socket = io("ws://leo.local:3000/");
    const receiptImage = JSON.stringify({ data: imageData });
    socket.emit("receiptCaptured", receiptImage);
    console.log("ran upload document");
  };

  // References for video and canvas elements
  // const videoRef = useRef(null);
  // const canvasRef = useRef(null);
  // const [image, setImage] = useState("");

  // Function to get the camera feed
  // const getVideo = () => {
  //   const videoObj = isMobile
  //     ? {
  //         facingMode: { exact: "environment" },
  //         width: { ideal: 3264 / 2 },
  //         height: { ideal: 2448 / 2 },
  //       }
  //     : {
  //         facingMode: { exact: "user" },
  //         width: { ideal: 3264 / 2 },
  //         height: { ideal: 2448 / 2 },
  //       };

  //   navigator.mediaDevices
  //     .getUserMedia({
  //       // video: {
  //       //   facingMode: {
  //       //     exact: "environment",
  //       //   },
  //       //   width: { ideal: 3264 / 2 },
  //       //   height: { ideal: 2448 / 2 },
  //       // },
  //       video: videoObj,
  //     })
  //     .then((stream) => {
  //       let video = videoRef.current;
  //       video.srcObject = stream;
  //       video.play();
  //     })
  //     .catch((err) => {
  //       console.error("error:", err);
  //     });
  // };

  // Function to take a picture
  // const takePicture = () => {
  //   const width = 3264 / 2;
  //   const height = 2448 / 2;
  //   let video = videoRef.current;
  //   let canvas = canvasRef.current;

  //   canvas.width = width;
  //   canvas.height = height;

  //   let ctx = canvas.getContext("2d");
  //   ctx.drawImage(video, 0, 0, width, height);

  //   let imageData = canvas.toDataURL("image/png");
  //   setImage(imageData);

  //   setImageData(imageData);
  // };

  // useEffect(() => {
  //   getVideo();
  // }, []);

  useEffect(() => {
    if (imageData) {
      uploadDocument(imageData);
      router.push("/add-handles");
    }
  }, [imageData, router]);

  const CaptureButton = styled.button`
    background-color: #fff;
    width: 80px;
    height: 80px;
    border: none;
    border-radius: 40px;
  `;

  const Camera = () => {
    const webcamRef = useRef(null);

    const videoConstraints = isMobile
      ? {
          facingMode: { exact: "environment" },
          width: { ideal: 3264 / 2 },
          height: { ideal: 2448 / 2 },
        }
      : {
          facingMode: "user",
          width: { ideal: 3264 / 2 },
          height: { ideal: 2448 / 2 },
        };

    const capture = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageData(imageSrc);
    };

    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          videoConstraints={videoConstraints}
          style={{ width: "100%", height: "100%" }}
        />
        <CaptureButton onClick={capture} />
      </div>
    );
  };

  return (
    <div className='cameraContainer'>
      {/* <video
        ref={videoRef}
        className='camera'
        autoPlay=''
        muted=''
        playsInline=''></video>
      <CaptureButton className='shutter' onClick={takePicture}></CaptureButton>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas> */}
      <Camera />
    </div>
  );
};

export default Camera;
