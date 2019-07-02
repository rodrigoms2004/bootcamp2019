import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();

// {
//   "fieldname": "file",
//   "originalname": "we eat batman.jpg",
//   "encoding": "7bit",
//   "mimetype": "image/jpeg",
//   "destination": "/home/rodrigo/Documents/NodeJS/Bootcamp/modulos02_03/tmp/uploads",
//   "filename": "5a64e237e2d413e71598e57026cee4e1.jpg",
//   "path": "/Bootcamp/modulos02_03/tmp/uploads/5a64e237e2d413e71598e57026cee4e1.jpg",
//   "size": 559959
// }
