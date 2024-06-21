const express = require('express');
const mongoose = require('mongoose');
const jsonBodyParser = require('body-parser').json();
const app = express();
const port = process.env.PORT || 3000;


const DB = "mongodb+srv://fares:sFEPwtCB0SiSDQs2@cluster0.8ebamfc.mongodb.net/?retryWrites=true&w=majority"

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },

})


const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(DB).then(() => {
    console.log("Database connection Successful");
}).catch((err) => console.log(err));


app.use(jsonBodyParser)


const blogsRouter = express.Router()



blogsRouter.post("/create", async (req, res) => {
    console.log(req.body);

    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.author,
    })
    await blog.save()
    res.send({
        success: true,
        data: blog,
    })
})

blogsRouter.get("/getBlogs", async (req, res) => {


    Blog.find().then((blogs) => {

        res.send({
            success: true,
            data: blogs,
        })
    
    })
})

blogsRouter.get("/myBlogs", async (req, res) => {

    Blog.find({
        author: req.headers.author
    }).then((blog) => {
        
        res.send({
            success: true,
            data: blog,
        })
    })
})

blogsRouter.delete("/delete", async (req, res) => {
    // print(req.headers.id)
    Blog.findByIdAndDelete(req.headers.id).then((blog) => {
        
        res.send({
            success: true,
            data: blog,
            message: "Blog deleted successfully"
        })    
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err.message)
    })
})



app.use("/api/blogs", blogsRouter)

app.use("/", (req, res) => {
    const ipAddress = req.ip || req.connection.remoteAddress;
    console.log("User IP Address:", ipAddress);
    res.send("Welcome to the blog api")
})

app.listen(port, () => {    
    console.log(`Server is running at http://localhost:${port}`);
  });
