// create a funtion to remove all special characters except space
export const removeSpecialCharacters = (str: string) => {
  return str.replace(/[^\w\s]/gi, "");
};

export const removeAllSpecialCharacters = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]/g, "");
};
