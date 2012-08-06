var natpmp = require('nat-pmp'),
    natman = exports;


var Nat = exports.Nat = function (options) {
  var client = new natpmp.Client();
  return this;
}

natman.createClient = function (options) {
  var self = this;
  options = options || {};
  options.gateway = options.gateway || "10.0.1.1";
  self.client = new Nat(gateway);
  return self;
};


Nat.prototype.open = function () {
  self.client.on('listening', function(){
    console.log(arguments);
  });
  self.client.connect();
};

Nat.prototype.close   = function () {};
Nat.prototype.destroy = function () {};
Nat.prototype.externalIP = function (callback) {
  return client.externalIp(callback);
};

Nat.prototype.map = function (options, callback) {
  options.private = options.private || 22;
  options.public  = options.public  || 8888;
  options.ttl     = options.ttl     || 3600;
  return client.portMapping({ private: options.private, public: options.public, ttl: options.ttl }, callback);
};