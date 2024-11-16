import dbConnect from '@/utils/dbConnect';
import multer from 'multer';
import Request from '@/utils/requestModels';

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false, // Disable Next.js body parser
    },
};

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'File upload error' });
            }

            const { title, description, timeCoins } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

            if (!title || !description || !timeCoins) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            try {
                const newRequest = new Request({
                    title,
                    description,
                    timeCoins,
                    imageUrl,
                });
                await newRequest.save();
                res.status(201).json(newRequest);
            } catch (error) {
                console.error('Error saving request:', error);
                res.status(500).json({ error: 'Failed to create request' });
            }
        });
    } else if (req.method === 'GET') {
        try {
            const requests = await Request.find({});
            res.status(200).json(requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
            res.status(500).json({ error: 'Failed to fetch requests' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
