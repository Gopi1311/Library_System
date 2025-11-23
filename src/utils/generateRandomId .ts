 export const generateIsbn = () => {
  return (
    "978" + Date.now().toString().slice(-7) + Math.floor(Math.random() * 1000)
  );
};

