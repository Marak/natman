var natpmp = require('nat-pmp'),
    natupnp = require('nat-upnp'),
    netroute = require('netroute');
    flatiron = require('flatiron'),
    os = require('os'),
    colors = require('colors'),
    app = flatiron.app,
    natman = exports;

var Nat = exports.Nat = function (options) {
  this.clients = {
    pmp: natpmp.connect(options.gateway),
    upnp: natupnp.createClient()
  };
  return this;
}

natman.createNat = function (options, callback) {
  options = options || {};
  options.gateway = options.gateway || netroute.getGateway();
  options.private = options.private || 22;
  options.public  = options.public  || 8888;
  options.ttl     = options.ttl     || 3600;
  var nat = new Nat(options);
  nat.open(options);
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

  function onConnect(client, external) {
    var portInfo = {
      private: options.private,
      public: options.public,
      ttl: client === self.clients.upnp ? 0 : options.ttl
    };
    app.log.info('Connected to WAN address: '.green +
                 external.magenta)
    app.log.warn('Mapping '.yellow + external.magenta +
                 ':'.magenta + options.public.toString().magenta +
                 ' => '.yellow + 'localhost:'.magenta +
                 options.private.toString().magenta);

    return client.portMapping(portInfo, function(err, info){
      if(err) {
        app.log.error(err);
        return callback(err);
      }

      // UPNP Returns server's response in info object
      if (!info.public) info = options;

      if(Number(options.public) !== Number(info.public)) {
        app.log.error(external.magenta + ':'.magenta +
                      options.public.toString().magenta + ' unavailable'.red);
        app.log.warn('Auto-assigning public port...'.yellow);
        app.log.info('Mapped '.green + external.magenta +
                     ':'.magenta + info.public.toString().magenta +
                     ' => '.green + 'localhost:'.magenta +
                     options.private.toString().magenta);
      }
      app.log.info('NAT established.'.green);
      app.log.warn('To stop forwarding, you may have to restart any exposed services'.yellow);
      app.log.info('Press CTRL-C to stop the NAT...');

      process.once('SIGINT', function() {
        client.portUnmapping(portInfo, function() {
          // Ignore errors for now
          process.exit(0);
        });
      });

      return callback(err, info);
    });
  }

  var once = false,
      waiting = Object.keys(this.clients).length;

  Object.keys(this.clients).forEach(function(key) {
    var client = self.clients[key];

    client.externalIp(function(err, external) {
      waiting--;
      if(once) return;

      // Ignore errors if we have reserve choices
      if(err && waiting > 0) return;

      // Invoke callback only once
      once = true;

      if(err) {
        app.log.error(err);
        return callback(err);
      }

      if (typeof external === 'string') {
        onConnect(client, external);
      } else {
        onConnect(client, external.ip.join('.'));
      }
    });
  });
};
