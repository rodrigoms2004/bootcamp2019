import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// podem ser usados DigitalOcean Spaces ou AWS S3
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        return callback(null, res.toString('hex') + extname(file.originalname)); // null = erro
      });
    },
  }),
};
