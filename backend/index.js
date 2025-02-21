const express = require("express");
const cors = require("cors");
const app = express();

app.use(
    cors({
        origin: ["https://bajaj-assessment-frontend-seven.vercel.app","http:localhost:5173"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/bfhl", (req, res) => {
    try {
        return res.json({
            operation_code: 1,
        });
    } catch (error) {
        console.error("Error in GET /demo:", error);
        res.status(500).json({ is_success: false, message: "Internal Server Error" });
    }
});

app.post("/bfhl", (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid data format" });
        }

        const numbers = data.filter((item) => !isNaN(item));
        const alphabets = data.filter((item) => isNaN(item));

        const highestAlphabet = alphabets.length > 0 ? [alphabets.sort()[alphabets.length - 1]] : [];

        const response = {
            is_success: true,
            user_id: "digant_raj_12042005",
            email: "22bcs10225@cuchd.in",
            roll_number: "22BCS10225",
            numbers: numbers.length > 0 ? numbers : [],
            alphabets: alphabets.length > 0 ? alphabets : [],
            highest_alphabet: highestAlphabet,
        };

        res.json(response);
    } catch (error) {
        console.error("Error in POST /demo:", error);
        res.status(500).json({ is_success: false, message: "Internal Server Error" });
    }
});

app.listen(4000, () => {
    console.info("Server is started at port 4000");
});
