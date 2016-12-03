var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Unlucky. It appears as though we can't find this page. Our most heartfelt, deepest, and sincere apologies.";
  } else if (status === 500) {
    title = "500, internal app_server error";
    content = "How embarrassing. There's a problem with our app_server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.. Or completely wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

/* GET 'index' page */
module.exports.angularApp = function(req, res){
  res.render('layout', {title: 'Items for bid'})
};
