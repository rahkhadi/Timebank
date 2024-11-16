import dbConnect from '@/utils/dbConnect';
import authMiddleware from '@/utils/authMiddleware';
import Request from '@/utils/requestModels';

const handler = async (req, res) => {
    await dbConnect();

    if (req.method === 'POST') {
        const { userId } = req.user; // Ensure `authMiddleware` sets `req.user`
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: 'Request ID is required' });
        }

        try {
            const request = await Request.findById(requestId);

            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            // Mark the request as accepted by the user
            request.acceptedBy = userId;
            await request.save();

            res.status(200).json({ success: true, message: 'Request accepted successfully' });
        } catch (error) {
            console.error('Error accepting request:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

export default authMiddleware(handler); // Wrap the handler with authMiddleware
