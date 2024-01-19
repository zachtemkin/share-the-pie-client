const getReceiptData = async (sessionId, server) => {
  try {
    const response = await fetch(`${server.api}/getReceiptData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (response && !response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default getReceiptData;
