import { create } from "zustand";

type StatusType = "Idle" | "Loading" | "Loaded" | "Error";

interface WorkcenterState {
  status: StatusType;
  setStatus: (status: StatusType) => void;

  substratePartNo: string | null;
  setSubstratePartNo: (partNo: string) => void;
}

export const useWorkcenterStore = create<WorkcenterState>((set) => ({
  status: "Idle", // initial status
  setStatus: (status) => set({ status }),

  substratePartNo: null,
  setSubstratePartNo: (partNo) => set({ substratePartNo: partNo }),
}));
