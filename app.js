const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);


/////////////////////Request traget to all articles////////////////////////////////
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundarticle){
    if(!err){
      res.send(foundarticle);
    }else{
      res.send(err);
    }

  });
})
.post(function(req, res){

    const newarticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newarticle.save(function(err){
      if(!err){
        res.send("Successfully added a new article");
      }else{
        res.send(err);
      }
    });
})
.delete(function(req, res){

  Article.deleteMany(function(err){
        if(!err){
          res.send("Successfully Deleted All Articles");
        }else{
          res.send(err);
        }

  });
});

/////////////////////Request traget to specific articles////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundarticle){
        if(foundarticle){
          res.send(foundarticle);
        }else{
            res.send(err);
        }

  });
})
.put(function(req, res){

  Article.update(
    {title:   req.params.articleTitle},
    {title:   req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully Updated");
      }else{
        res.send(err);
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title:   req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err)
      {
          res.send("Successfully Updated");
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req, res){

  Article.deleteOne(
    {title:   req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully Deleted");
      }
    }
  );

});



app.listen(3000, function(req, res){

  console.log("Server Running on Port 3000");

});
