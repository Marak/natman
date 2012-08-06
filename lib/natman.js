var natpmp = require('nat-pmp'),
    natman = exports;

var Nat = exports.Nat = function (options) {
  this.client = new natpmp.Client(options.gateway);
  return this;
}

natman.createNat = function (options, callback) {
  options = options || {};
  options.gateway = options.gateway || "10.0.1.1";
  var nat = new Nat(options);
  nat.open(options);
};

Nat.prototype.open = function (options, callback) {
  options = options || {};
  this.map(options, callback);
};

Nat.prototype.close   = function () {};
Nat.prototype.destroy = function () {};

Nat.prototype.map = function (options, callback) {
  var self = this;
  callback = callback || function () {};
  options.private = options.private || 22;
  options.public  = options.public  || 8888;
  options.ttl     = options.ttl     || 3600;
  console.log("OPEN THE NAT", options)
  self.client.externalIp(function(err, external) {
    if(err) {
      return callback(err);
    }
    return self.client.portMapping({ private: options.private, public: options.public, ttl: options.ttl }, function(err, info){
      console.log("OPENED", { public: info.public, private: info.internal }, external.ip.join('.'))
      return callback(err, info);
    });
  });
};