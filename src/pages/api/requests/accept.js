import dbConnect from '@/utils/dbConnect';
import authMiddleware from '@/utils/authMiddleware';
import Request from '@/utils/requestModels';
import Notification from '@/utils/notificationModel';
import mongoose from 'mongoose';

const handler = async (req, res) => {
    await dbConnect();

    if (req.method === 'POST') {
        const { userId } = req.user; // User accepting the request
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: 'Request ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ error: 'Invalid request ID format' });
        }

        try {
            const request = await Request.findById(requestId);

            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            // Mark the request as accepted
            request.acceptedBy = userId;
            await request.save();

            // Create a notification for the request creator
            const notification = new Notification({
                user: request.createdBy,
                message: `Your request has been accepted by ${req.user.name}`, // Customize message as needed
            });
            await notification.save();

            res.status(200).json({ success: true, message: 'Request accepted successfully' });
        } catch (error) {
            console.error('Error accepting request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

export default authMiddleware(handler);
