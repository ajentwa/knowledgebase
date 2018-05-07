const express = require('express');
const router = express.Router();

// Article model
let Article = require('../models/article');
// User model
let User = require('../models/user');

// GET articles listing
router.get('/', ensureAuthenticated, function(req, res, next) {
  Article.find({}, function(err, articles){
    if(err) throw err;
    res.render('articles/index',{
      title: 'Articles List',
      articles:articles,
      year: new Date().getFullYear()
    });
  }).sort({_id:-1});
});

// GET single article
router.get('/article/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      if(err) throw err;
      res.render('articles/article',{
        article:article,
        author:user.name,
        year: new Date().getFullYear()
      });
    });
  });
});

// Add Article Form
router.get('/add', ensureAuthenticated, function(req, res, next) {
    res.render('articles/add',{
      title: 'Add Article',
      year: new Date().getFullYear()
  });
});

// Add Article Process
router.post('/add', function(req, res, next) {
  req.check('title', 'Title is required').notEmpty();
  // req.check('author', 'Author is required').notEmpty();
  req.check('body', 'Body is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors) {
    res.render('articles/add', {
      title: 'Add Article',
      errors: errors
    });
  }else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function(err){
      if(err) {
        console.log(err);
        return;
      }else{
        req.flash('success', 'Article Added successfully')
        res.redirect('/articles');
      }
    });
  }
});

// Edit Article Form
router.get('/edit/:id', ensureAuthenticated, function(req, res, next) {
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      if(article.author != req.user._id){
        req.flash('danger', 'Not Authorized');
        res.redirect('/');
      }
      res.render('articles/edit',{
        title: 'Edit Article',
        article: article,
        author: user.name,
        year: new Date().getFullYear()
      });
    });
  });
});

// Edit Article Process
router.post('/update/:id', function(req, res, next) {
  let article = {};
  article.title = req.body.title;
  article.author = req.user._id;
  article.body = req.body.body;

  let id = {_id:req.params.id}

  Article.update(id, article, function(err){
    if(err) {
      console.log(err);
      return;
    }else{
      req.flash('success', 'Article Updated successfully')
      res.redirect('/articles');
    }
  });
});

// Delete Article
router.get('/delete/:id', function(req, res, next) {
  if(!req.user._id) {
    res.status(500).send();
  }

  let id = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(id, function(err){
        if(err) {
          console.log(err);
        }else{
          req.flash('danger', 'Article Deleted successfully')
          res.redirect('/articles');
        }
      });
    }
  });
});

// Access control
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else{
    req.flash('danger', 'Please Login');
    res.render('users/login');
  }
}

module.exports = router;
