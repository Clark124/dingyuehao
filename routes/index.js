var express = require('express');
var router = express.Router();
var sha1 = require('sha1')

var path = require('path')
var util = require('../libs/util')
var wechat_file = path.join(__dirname, '../config/wechat.txt')
var Wechat = require('../wechat/wechat')

var config = {
  wechat: {
    appID: "wx20a5345332e70b9e",
    appSecret: "356aa496a191f22439ee827d330dc51f",
    token: "miaolegemide",
    getAccessToken: function () {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function (data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    }
  }
}





/* GET home page. */
router.get('/', function (req, res, next) {
  var wechat = new Wechat(config.wechat)
  const token = config.wechat.token
  const { signature, nonce, timestamp, echostr } = req.query
  var str = [token, timestamp, nonce].sort().join("")
  var sha = sha1(str)
  if (sha === signature) {
    res.send(echostr)
  } else {
    res.send('wrong')
  }

});

router.post('/',function(req,res){
  console.log(req.body)
})

module.exports = router;
