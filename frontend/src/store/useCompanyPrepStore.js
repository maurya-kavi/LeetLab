import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useCompanyPrepStore = create((set) => ({
  plans: [],
  currentPlan: null,
  isLoading: false,
  isSaving: false,

  getPlans: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/company-prep/plans");
      set({ plans: response.data.plans || [] });
    } catch (error) {
      console.error("Error fetching company prep plans:", error);
      toast.error(error.response?.data?.error || "Unable to load preparation plans.");
    } finally {
      set({ isLoading: false });
    }
  },

  generatePlan: async (values) => {
    try {
      set({ isSaving: true });
      const response = await axiosInstance.post("/company-prep/generate", values);
      set((state) => ({ currentPlan: response.data.plan, plans: [response.data.plan, ...state.plans] }));
      toast.success("Preparation plan generated.");
      return response.data.plan;
    } catch (error) {
      console.error("Error generating company prep plan:", error);
      toast.error(error.response?.data?.error || "Unable to generate preparation plan.");
      return null;
    } finally {
      set({ isSaving: false });
    }
  },
}));
