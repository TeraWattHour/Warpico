const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateUserCode = (): string => {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }
  return code;
};
