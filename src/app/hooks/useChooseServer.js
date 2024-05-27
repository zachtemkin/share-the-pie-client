function useChooseServer() {
  let server = {};

  if (process.env.NODE_ENV === "development") {
    server.socket = "wss://leo.local:4858";
    server.api = "https://leo.local:4000";
  } else {
    server.socket = "wss://sharethepie.app:4858";
    server.api = "https://api.sharethepie.app";
  }

  return server;
}

export default useChooseServer;
