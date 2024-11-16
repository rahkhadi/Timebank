import dbConnect from '@/utils/dbConnect';
import Request from '@/utils/requestModels';

export default async function handler(req, res) {
    await dbConnect();

    const { page = 1, limit = 10 } = req.query;

    if (req.method === 'GET') {
        try {
            const requests = await Request.find()
                .populate({
                    path: 'creator',
                    select: 'firstName lastName email',
                    options: { strictPopulate: false },
                })
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const totalRequests = await Request.countDocuments();

            res.status(200).json({
                requests,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalRequests / limit),
                totalRequests,
            });
        } catch (error) {
            console.error('Error fetching requests:', error.message);
            res.status(500).json({ error: 'Failed to fetch requests' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
