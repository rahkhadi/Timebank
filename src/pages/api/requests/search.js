import dbConnect from '@/utils/dbConnect';
import Request from '@/utils/requestModels';

export default async function handler(req, res) {
    console.log("API Route hit:", req.method, req.query); // Debug log
    await dbConnect();

    if (req.method === 'GET') {
        const { query } = req.query;

        try {
            if (!query || query.trim() === '') {
                return res.status(400).json({ error: 'Query parameter is required' });
            }

            const requests = await Request.find({
                title: { $regex: query, $options: 'i' },
            });

            return res.status(200).json(requests);
        } catch (error) {
            console.error('Error fetching search results:', error.message);
            return res.status(500).json({ error: 'Failed to fetch search results' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
