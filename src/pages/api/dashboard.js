// pages/api/dashboard.js
import authMiddleware from "@/utils/authMiddleware";
import Request from "@/utils/requestModels";
import connectDB from "@/utils/dbConnect";

connectDB();
const handler = async (req, res) => {
    console.log("Dashboard API: Request received", req.url);

    // This is a server-side API route. Do not use `useRouter` or `useContext` here.
    const dashboardData = {
        message: "Welcome to the Dashboard",
        user: req.user, // Assuming authMiddleware attaches `req.user`
    };

    res.status(200).json(dashboardData);
};

export default authMiddleware(handler);
