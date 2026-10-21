import {db} from "../libs/db.js";

export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await db.submission.findMany({
            where:{
                userId:userId
            },
            include: { testCases: true },
            orderBy: { createdAt: "desc" },
        })

        res.status(200).json({
            success:true,
            message:"Submission Fetched Successfully",
            submissions
        })
    } catch (error) {
        console.error("Fetch Submissions Error:", error)
        res.status(500).json({error:"Failed to fetch submissions"}) 

    }

}  

export const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;
        const submissions = await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            },
            include: { testCases: true },
            orderBy: { createdAt: "desc" },
        })
        res.status(200).json({
            success:true,
            message:"Submission Fetch successfully",
            submissions,
        })
    } catch (error) {
        console.error("Fetch Submissions Error:", error)
        res.status(500).json({error:"Failed to fetch submissions"});
    }
}  



export const getAllTheSubmissionsForTheProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const [totalCount, acceptedCount] = await Promise.all([
            db.submission.count({ where: { problemId } }),
            db.submission.count({ where: { problemId, status: "Accepted" } }),
        ]);

        res.status(200).json({
            success:true,
            message:"Submission stats fetched successfully",
            count:totalCount,
            acceptedCount,
            successRate: totalCount === 0 ? 0 : Math.round((acceptedCount / totalCount) * 100),
        })
    } catch (error) {
        console.log("Fetch Submissions error:" , error)
        res.status(500).json({error:"Failed to fetch submissions"});
    }
} 

