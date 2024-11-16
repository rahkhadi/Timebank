import connectDB from '@/utils/dbConnect';
import authMiddleware from '@/utils/authMiddleware';
import Request from '@/utils/requestModel';

// Initialize DB connection
connectDB();

// Handler for GET requests
export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} not allowed`);
    }

    try {
        // Fetch all requests from the database
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
}

// Apply auth middleware
export const config = {
    api: {
        middleware: authMiddleware,
    },
};
