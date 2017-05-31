var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    method      = require("method-override")
    app         = express();

mongoose.connect('mongodb://node_exercise:123Qwerty@ds143980.mlab.com:43980/node_exercise');

// Middleware
app.use(method("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs"); // Set view use ejs

var blogkuSchema = new mongoose.Schema({
  title       : String,
  image       : String,
  description : String
});

var Blog = mongoose.model("Blog", blogkuSchema); //variable untuk memanggil schema

// Create Data
// Blog.create(
//   {
//     title : "Test post 2",
//     image : "http://www.photosforclass.com/download/7894627946",
//     description: "Test Desc 2"
//   },
//   function(error, blog){
//     if(error){console.log(error)}
//     else{console.log(blog)}
//   }
// );

//Homepage
app.get("/", function(req, res){
  res.redirect("/blogku");
});

app.get("/blogku", function(req, res){
  Blog.find({}, function(err, data){
    if(err){console.log(err)}
    else {
      res.render("index", {blogs: data});
    }
  });
});

//New Route
app.get("/blogku/new", function(req, res){
  res.render("new");
});

//Crate Route
app.post("/blogku", function(req, res){
  var title = req.body.title;
  var image = req.body.image;
  var description = req.body.description;

  var newPost = {title: title, image: image, description: description};

  Blog.create(newPost, function(err, newPost){
      if(err){
        console.log(err)
      }else{
        res.redirect("/");
      }
  });
});

//Show Route
app.get("/blogku/:id", function(req, res){

  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
    }else{
      res.render("show", {blog: foundBlog});
    }
  });
});

//Edit Route
app.get("/blogku/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
    }else{
      res.render("edit", {blog: foundBlog});
    }
  });
});

//Update Route
app.put("/blogku/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
    if(err){
      console.log(err)
    }else{
      res.redirect(req.params.id);
    }
  });
});

//Delete Route
app.delete("/blogku/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err)
    }else {
      res.redirect("/blogku");
    }
  });
});


app.listen(3000, function(){
  console.log("Server starting");
});
