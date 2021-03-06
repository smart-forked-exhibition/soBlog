// Generated by CoffeeScript 1.8.0
(function() {
  var Blog, Cover, async, b32, key, marked, notp, settings, t2;

  Cover = require('../models/Cover.js');

  async = require('async');

  Blog = require('../models/Blog.js');

  notp = require('notp');

  settings = require('../../settings.js');

  t2 = require('thirty-two');

  marked = require('marked');

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  key = settings.googleAuthKey;

  b32 = t2.encode(key);

  console.log("key for googleAuth app: " + b32.toString());

  exports.index = function(req, res) {
    return Cover.readTopAndCount(function(err, cover, count) {
      var hasCover, topBlog, total;
      total = 0;
      hasCover = false;
      topBlog = {};
      if (err) {
        cover = new Cover({
          contentBegin: '崇尚自由，追求简约',
          img: {
            original: "/images/bg.jpg"
          }
        });
      } else {
        ({
          hasCover: true,
          total: count
        });
        cover.content = marked(cover.content);
      }
      Blog.returnTopBlog(function(err, blogs) {
        if (err) {
          blogs = [];
        }
        return res.render('home/index', {
          title: settings.titles.index,
          user: req.session.user,
          cover: cover,
          topblogs: blogs,
          hascover: hasCover,
          total: count,
          isLastPage: total === 1
        });
      });
    });
  };

  exports.about = function(req, res) {
    return Cover.readTopAndCount(function(err, cover, count) {
      var hasCover, topBlog, total;
      total = 0;
      hasCover = false;
      topBlog = {};
      if (err) {
        cover = new Cover({
          contentBegin: '崇尚自由，追求简约',
          img: {
            original: "/images/bg.jpg"
          }
        });
      } else {
        ({
          hasCover: true,
          total: count
        });
        cover.content = marked(cover.content);
      }
      res.render('home/about', {
        title: settings.titles.index,
        user: req.session.user,
        cover: cover,
        total: count
      });
    });
  };

  exports.manage = function(req, res) {
    return Blog.find({}).sort({
      date: -1
    }).exec(function(err, blogs) {
      if (err) {
        blogs = [];
      }
      return Cover.find({}).sort({
        date: -1
      }).exec(function(err, covers) {
        if (err) {
          covers = [];
        }
        return res.render('home/manage', {
          title: settings.titles.manage,
          blogs: blogs,
          covers: covers,
          user: req.session.user
        });
      });
    });
  };

  exports.login = function(req, res) {
    if (req.body.email !== settings.loginUserName || req.body.password !== settings.loginPwd) {
      return res.redirect('/login');
    } else {
      req.session.login = "googleauth";
      return res.redirect("/google-auth");
    }
  };

  exports.googleAuthView = function(req, res) {
    console.log(b32.toString());
    return res.render('home/googleAuth', {
      title: settings.titles.login,
      user: req.session.user
    });
  };

  exports.googleAuth = function(req, res) {
    var code;
    code = req.body.code.trim();
    if (notp.totp.verify(code, key, {})) {
      req.session.user = "lingyong";
      return res.redirect('/manage');
    } else {
      return res.redirect('/google-auth');
    }
  };

  exports.logout = function(req, res) {
    req.session.user = null;
    return res.redirect('/');
  };

  exports.loginView = function(req, res) {
    return res.render('home/login', {
      titlt: settings.titles.login
    });
  };

  exports.checkPwd = function(req, res, next) {
    if (!req.session.login) {
      res.redirect('/login');
    }
    return next();
  };

  exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    }
    return next();
  };

  exports.checkLogout = function(req, res, next) {
    if (req.session.user) {
      return res.redirect('/');
    }
    return next();
  };

}).call(this);

//# sourceMappingURL=home.js.map
