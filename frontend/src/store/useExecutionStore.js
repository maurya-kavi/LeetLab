import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';



export const useExecutionStore = create((set) => ({
  isExecuting : false,
  submission:null,
  runResult: null,

  executeCode : async (source_code, language_id , stdin , expected_outputs, problemId, mode = "run") => {
    set({ isExecuting: true, ...(mode === "run" ? { runResult: null } : {}) });
    try {
      const response = await axiosInstance.post('/execute-code', {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
        mode,
      });
      if (mode === "submit") {
        set({ submission: response.data.submission, runResult: null });
      } else {
        set({ runResult: response.data.result });
      }
      const result = mode === "submit" ? response.data.submission : response.data.result;
      const status = result?.status;
      if (status === "Accepted") toast.success(mode === "submit" ? "Accepted" : "Run completed: Accepted");
      else toast.error(status || response.data.message);
      return result;

    } catch (error) {
        console.log("Error executing code" , error)
        toast.error(error.response?.data?.error || "Error executing code");
        return null;
    }
    finally{
      set({ isExecuting: false });
    }
  },
}));
