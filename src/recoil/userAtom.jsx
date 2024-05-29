import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "localStorage",
  storage: localStorage,
});

export const userState = atom({
  key: "userState",
  default: {
    userId: null,
    userName: null,
    token: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: true,
  effects_UNSTABLE: [persistAtom],
});
