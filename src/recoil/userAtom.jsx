import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
    storage: localStorage,
  }
)

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
