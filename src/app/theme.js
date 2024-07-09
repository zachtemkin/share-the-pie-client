export const motion = {
  fadeInPageDuration: 250, // How long it takes for a page to fade in
  delayBetweenPages: 250, // Must be the greater or equal to fadeInPageDuration
  delayToShowCamera: 1250, // Delay before showing the camera preview on capture-receipt page
  delayToShowContainer: 250, // Delay before showing the main container on a page
  defaultTransitionDuration: 250, // Default duration for transitions, like scaling a button when pressed
  showQRCodeDuration: 800, // Duration for fading in the QR code on present-qr page
};

export const basicTheme = {
  darkSurfaceColor: "rgba(255,255,255,0.125)",
  lightSurfaceColor: "rgba(255,255,255,1)",
  surfaceBorderRadius: "2rem",
  surfacePadding: "1.25rem",
  connectedColor: "#00C708",
  motion, // Pass through motion object so it can be used in the styled-components
};
