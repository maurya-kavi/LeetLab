import { db } from "../libs/db.js"
import { pollBatchResults, submitBatch, getLanguageName } from "../libs/judge0.lib.js";

const getResultStatus = (result, outputMatches) => {
    const judgeStatus = result.status || {};
    const description = String(judgeStatus.description || "").toLowerCase();
    const message = String(result.message || "").toLowerCase();

    if (description.includes("memory limit") || message.includes("memory limit")) return "Memory Limit Exceeded";
    if (judgeStatus.id === 5 || description.includes("time limit")) return "Time Limit Exceeded";
    if (judgeStatus.id === 6 || description.includes("compilation error")) return "Compilation Error";
    if (judgeStatus.id === 3 || description === "accepted") return outputMatches ? "Accepted" : "Wrong Answer";
    if (description.includes("wrong answer")) return "Wrong Answer";
    if (description.includes("runtime error")) return "Runtime Error";

    return judgeStatus.description || "Execution Error";
};


export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, problemId, mode = "run" } = req.body;
        let { stdin, expected_outputs } = req.body;

        if (!["run", "submit"].includes(mode)) {
            return res.status(400).json({ error: "Mode must be run or submit" });
        }

        if (mode === "submit") {
            const problem = await db.problem.findUnique({ where: { id: problemId }, select: { testcases: true } });
            if (!problem) return res.status(404).json({ error: "Problem not found" });
            const testcases = Array.isArray(problem.testcases) ? problem.testcases : [];
            stdin = testcases.map((testcase) => testcase.input);
            expected_outputs = testcases.map((testcase) => testcase.output);
        }

        const userId = req.user.id;

        //validate test cases
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return res.status(400).json({
                error: "Invalid test cases"
            })
        }

        //2. prapare each test cases for judge0 batch submission
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
        }));

        //3. send batch of submission to judge0 
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        //4. pull judge0 for the result of each test case
        const results = await pollBatchResults(tokens);

        // Normalize Judge0 statuses and compare successful outputs with expected results.
        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout == null ? null : String(result.stdout).trim();
            const expected_output = expected_outputs[i] == null ? "" : String(expected_outputs[i]).trim();
            const status = getResultStatus(result, stdout === expected_output);

            return {
                testCase: i + 1,
                passed: status === "Accepted",
                stdout,
                expected: expected_output,
                stderr: result.stderr || result.message || null,
                compile_output: result.compile_output || null,
                status,
                memory: result.memory == null ? null : `${result.memory} KB`,
                time: result.time == null ? null : `${result.time} s`,
            }

            // console.log(`Test Case #${i + 1}`);
            // console.log(`Input for testcase #${i+1}: ${stdin[i]}`);
            // console.log(`Expected Output for the testcase #${i+1}: ${expected_output}`);
            // console.log(`Actual Output for testcase #${i+1}: ${stdout}`);
            // console.log(`Matched testcase #${i+1}: ${passed}`);
        })

        const allPassed = detailedResults.every((result) => result.passed);
        const submissionStatus = allPassed
            ? "Accepted"
            : detailedResults.find((result) => !result.passed)?.status || "Execution Error";

        if (mode === "run") {
            return res.status(200).json({
                success: true,
                message: "Code ran against the visible test cases.",
                result: {
                    status: submissionStatus,
                    testCases: detailedResults,
                    memory: JSON.stringify(detailedResults.map((result) => result.memory)),
                    time: JSON.stringify(detailedResults.map((result) => result.time)),
                },
            });
        }

        //store submission summary
        const submission = await db.submission.create({
            data: {
                problemId,
                userId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
                stderr: detailedResults.some((r) => r.stderr)
                    ? JSON.stringify(detailedResults.map((r) => r.stderr))
                    : null,
                compileOutput: detailedResults.some((r) => r.compile_output)
                    ? JSON.stringify(detailedResults.map((r) => r.compile_output))
                    : null,
                status: submissionStatus,
                memory: detailedResults.some((r) => r.memory != null)
                    ? JSON.stringify(detailedResults.map((r) => r.memory))
                    : null,
                time: detailedResults.some((r) => r.time != null)
                    ? JSON.stringify(detailedResults.map((r) => r.time))
                    : null
            }
        })

        //if all passed = true mark problem as solved for the user
        if (allPassed) {
            console.log("userId:", userId);
            console.log("problemId:", problemId);

            await db.problemSolved.upsert({
                //upsert means if record doesn't exist create it otherwise update it
                where:{
                    userId_problemId:{
                        userId,
                        problemId
                    },
                },
                update:{},
                create:{
                    user:    { connect: { id: userId } },   // ✅ link existing user
                    problem: { connect: { id: problemId } } // ✅ link existing problem
                }   
            });

        }


        //8 save individual test case result
        const testCaseResults = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: String(result.testCase),
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time,
        }));

        await db.testCaseResult.createMany({
            data: testCaseResults,
        })

        const submissionWithTestCase = await db.submission.findUnique({
            where: {
                id: submission.id,
            },
            include: {
                testCases: true
            }
        })


        res.status(200).json({
            success: true,
            message: "Code Executed!",
            submission: submissionWithTestCase  
        });
    }
    catch (error) {
        console.error("Error executing code:", error.message);
        return res.status(500).json({
            error: "Error While Executing Code"
        });
    }
}
