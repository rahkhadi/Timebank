import dbConnect from "@/utils/dbConnect";
import multer from "multer";
import Request from "@/utils/requestModels";
import authMiddleware from "@/utils/authMiddleware";

const storage = multer.diskStorage({
    destination: "public/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false, // Disable Next.js body parser
    },
};

async function handler(req, res) {
    await dbConnect();

    if (req.method === "POST") {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                console.error("File upload error:", err);
                return res.status(500).json({ error: "File upload error" });
            }

            const { title, description, timeCoins } = req.body;
            const timeCoinsNumber = parseInt(timeCoins, 10);
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

            if (!title || !description || isNaN(timeCoinsNumber)) {
                return res.status(400).json({ error: "All fields are required" });
            }

            try {
                const newRequest = new Request({
                    title,
                    description,
                    timeCoins: timeCoinsNumber,
                    imageUrl,
                    createdBy: req.user.userId, // Make sure `req.user` is correctly populated
                });

                await newRequest.save();
                return res.status(201).json({ success: true, request: newRequest });
            } catch (error) {
                console.error("Failed to create request:", error);
                return res.status(500).json({ error: "Failed to create request" });
            }
        });
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}

export default authMiddleware(handler);
