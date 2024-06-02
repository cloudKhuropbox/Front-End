import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist();

export const checkedState = atom({
  key: "checkedState",
  default: [],
})

export const searchQueryTerm = atom({
  key: "searchQueryTerm",
  default: '',
})