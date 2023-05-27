import { nanoid } from "nanoid";

const id = () => {
  let id = nanoid();
  let x = true;
  let specialCharacter = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  while (x) {
    if (specialCharacter.test(id.charAt(0))) {
      id = nanoid();
    } else {
      x = false;
    }
  }
  return id;
};

export default id;
