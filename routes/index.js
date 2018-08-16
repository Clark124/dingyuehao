var express = require('express');
var router = express.Router();
var sha1 = require('sha1')

var config = {
  wechat:{
    appID:"wx20a5345332e70b9e",
    appSecret:"356aa496a191f22439ee827d330dc51f",
    token:"miaolegemide"
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  const token = config.wechat.token
  const {signatuire,nonce,timestamp,ecostr} = req.query
  var str = [token,timestamp,nonce].sort().join("")
  var sha = sha1(str)
  if(sha===signatuire){
    res.send(ecostr)
  }else{
    res.send('wrong')
  }
});

module.exports = router;
