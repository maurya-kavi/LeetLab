import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useSubmissionStore = create((set) => ({
    isLoading:false,
    submissions: [],
    submission:null,
    submissionCount:0,
    submissionSuccessRate:null,
    isSubmissionStatsLoading:false,

    getAllSubmissions: async () => {
        try {
            set({isLoading: true});
            const response = await axiosInstance.get("/submission/get-all-submissions");
            set({ submissions: response.data.submissions });
            toast.success(response.data.message);   
        } catch (error) {
            console.error("Error fetching submissions:", error);
            toast.error("Error fetching submissions");
        }
        finally{
            set({isLoading: false});
        }
    },

    getSubmissionForProblem: async (problemId) => {
        try {
            set({isLoading: true});
            const response = await axiosInstance.get(`/submission/get-submission/${problemId}`);
            set({ submission: response.data.submissions });
        } catch (error) {
            console.error("Error fetching submissions for problem:", error);
            toast.error("Error fetching submissions for problem");
        } finally {
            set({isLoading: false});
        }
    },

    getSubmissionCountForProblem: async (problemId) => {
        set({isSubmissionStatsLoading: true});
        try {
            const response = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`);
            set({
                submissionCount: response.data.count,
                submissionSuccessRate: response.data.successRate,
            });
        } catch (error) {
            console.error("Error fetching submission count for problem:", error);
        } finally {
            set({isSubmissionStatsLoading: false});
        }
    },

    
}));
