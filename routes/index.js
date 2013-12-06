
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Nodejs im Frontend mit Angular.js' });
};