import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: {
    isLoggedIn: false,
    user: null,
  },
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof window !== "undefined") {
        const savedAuth = localStorage.getItem("authState");
        if (savedAuth) {
          setSelf(JSON.parse(savedAuth));
        }

        onSet((newAuth) => {
          localStorage.setItem("authState", JSON.stringify(newAuth));
        });
      }
    },
  ],
});
