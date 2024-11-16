// src/pages/api/requests/[id].js
import dbConnect from '@/utils/dbConnect';
import Request from '@/utils/requestModels';

export default async function handler(req, res) {
    const { id } = req.query;

    await dbConnect();

    if (req.method === 'GET') {
        try {
            const request = await Request.findById(id);
            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }
            res.status(200).json(request);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
