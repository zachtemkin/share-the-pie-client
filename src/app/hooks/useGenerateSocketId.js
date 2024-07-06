const generateSocketId = () => {
  const date = Date.now().toString().slice(-8);
  const random = Math.floor(10000000 + Math.random() * 90000000).toString();

  return `${random}-${date}`;
};

export default generateSocketId;
