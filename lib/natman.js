var natpmp = require('nat-pmp'),
    flatiron = require('flatiron'),
    os = require('os'),
    colors = require('colors'),
    app = flatiron.app,
    natman = exports;

var Nat = exports.Nat = function (options) {
  this.client = new natpmp.Client(options.gateway);
  return this;
}

natman.createNat = function (options, callback) {
  options = options || {};
  options.gateway = options.gateway || natman.guessGateway();
  options.private = options.private || 22;
  options.public  = options.public  || 8888;
  options.ttl     = options.ttl     || 3600;
  var nat = new Nat(options);
  nat.open(options);
};

//
// Since the code to actually figure this out doesn't exist in node yet
//
// see: https://groups.google.com/forum/?fromgroups#!topic/nodejs-dev/QbcnxS0_yyg
//
natman.guessGateway = function () {
  var network = os.networkInterfaces(),
      guess = '10.0.0.1';

  Object.keys(network).forEach(function(interfaces){
    network[interfaces].forEach(function(interface){
      if(!interface.internal && interface.family === "IPv4") {
        guess = interface.address.split('.');
        guess[guess.length -1] = "1";
        guess = guess.join('.');
      }
    });
  })

  return guess;
};

Nat.prototype.open = function (options, callback) {
  this.map(options, callback);
};

Nat.prototype.map = function (options, callback) {
  var self = this;
  callback = callback || function () {};
  app.log.info('Creating NAT...'.green);
  app.log.warn('Using gateway: '.yellow + options.gateway.magenta);
  app.log.help('You can manually specify a gateway with -g argument'.cyan)
  app.log.warn('Attempting to connect... '.yellow);
  self.client.externalIp(function(err, external) {
    if(err) {
      app.log.error(err);
      return callback(err);
    }
    app.log.info('Connected to WAN address: '.green + external.ip.join('.').magenta)
    app.log.warn('Mapping '.yellow + external.ip.join('.').magenta + ':'.magenta + options.public.toString().magenta + " => ".yellow + 'localhost:'.magenta + options.private.toString().magenta);
    return self.client.portMapping({ private: options.private, public: options.public, ttl: options.ttl }, function(err, info){
      if(err) {
        app.log.error(err);
        return callback(err);
      }
      if(Number(options.public) !== Number(info.public)) {
        app.log.error(external.ip.join('.').magenta + ':'.magenta + options.public.toString().magenta + ' unavailable'.red);
        app.log.warn('Auto-assigning public port...'.yellow);
        app.log.info('Mapped '.green + external.ip.join('.').magenta + ':'.magenta + info.public.toString().magenta + " => ".green + 'localhost:'.magenta + options.private.toString().magenta);
      }
      app.log.info('NAT established.'.green);
      app.log.info('Press CTRL-C to stop the NAT...')
      return callback(err, info);
    });
  });
};