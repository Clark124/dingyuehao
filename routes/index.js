var express = require('express');
var router = express.Router();
var sha1 = require('sha1')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var path = require('path')
var util = require('../libs/util')
var wechat_file = path.join(__dirname, '../config/wechat.txt')

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
  accessToken: prefix + 'token?grant_type=client_credential'

}

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
      return util.writeFileAsync(wechat_file,data)
    }
  }
}

function Wechat(opts) {
  var that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken
  this.getAccessToken().then(function (data) {
    try {
      data = JSON.parse(data)
    }
    catch (e) {
      return that.updateAccessToken(data)
    }
    if (that.isValidAccessToken(data)) {
      Promise.resolve(data)
    } else {
      return that.updateAccessToken(data)
    }
  }).then(function (data) {
    that.access_token = data.access_token
    that.expires_in = data.expires_in
    that.saveAccessToken(data)
  })
}

Wechat.prototype.isValidAccessToken = function (data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }
  var access_token = data.access_token
  var expires_in = data.expires_in
  var now = (new Date().getTime())
  if (now < expires_in) {
    return true
  } else {
    return false
  }
}

Wechat.prototype.updateAccessToken = function (data) {
  var appID = this.appID
  var appSecret = this.appSecret
  var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
  console.log(url)
  return new Promise(function (resolve, reject) {
    request({ url: url, json: true }).then(function (res) {
      console.log(res)
      var data = res[1]
      var now = (new Date().getTime())
      var expires_in = now + (data.expires_in - 20) * 1000
      data.expires_in = expires_in
      resolve(data)
    })
  })


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

module.exports = router;
