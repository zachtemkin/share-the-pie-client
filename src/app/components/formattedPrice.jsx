const useFormatPrice = (price) => {
  // Check if the price is an integer (no cents)
  if (Math.floor(price) === price) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0, // Avoid showing .00 if no cents
    });
    return formatter.format(price);
  } else {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2, // Ensure cents are always shown if they exist
    });
    return formatter.format(price);
  }
};

const FormattedPrice = ({ value }) => {
  const formattedPrice = useFormatPrice(value);
  return formattedPrice;
};

export default FormattedPrice;
