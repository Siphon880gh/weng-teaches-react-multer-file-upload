const express = require("express");
const server = express();
const path = require("path");

// Configure multer to handle file uploads
const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() }); // saves to memory, great for passing off a req.file.buffer to another upload service like AWS S3
// const upload = multer({ dest: path.join(__dirname, '../build/uploads/') }); // saves to file storage but doesnt allow for custom filenames. quick and dirty syntax.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../client/build/uploads'));
    },
    filename: (req, file, cb) => {
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Custom filename of input field name and timestamp
        cb(null, file.originalname); // originalname has filename with extension
    }
});
const upload = multer({ storage: storage });

// Boilerplate: Middleware to parse JSON fetch body and URL-encoded form data
// Boilerplate: Middleware to respond with static files after page is loaded
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "..", "client", "build")));

// Routes
server.post("/uploads", upload.single('file'), async (req, res) => {
    if(req.file === null) {
        return res.status(400).json({error: "No file uploaded from frontend"})
    } else {
        res.json({fileName: req.file.originalname, filePath: `/uploads/${req.file.originalname}`});
    }
});

server.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
});

async function startServer() {
    let port = process.env.PORT || 3001;

    server.listen(port, () => {
        console.log(`Server listening at ${port}`);
    });
}

startServer();