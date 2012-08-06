# natman

[Network Address Translation](http://en.wikipedia.org/wiki/Network_address_translation) management tool built on node.js

### natman forwards external public ports to internal ports without touching the router.


## Installation

     npm install natman -g
     
## Usage

     natman open <internal private port> <requested public port>

**Example:** Open internal port 22 to the world

     natman open 22

*Note: If no requested public port is specified, public port will be auto-assigned*

**Example:** Open internal port 22 to the world on port 800

    natman open 22 8000

## Built in services

For convenience, Natman comes with a configurable list of built in services. You can customize this list by modifying the "natman.json" file.

Simple type: `natman open <service> <requested public port>`.

     natman open ssh
     natman open http
     natman open https
     natman open ftp

## Specify Network Gateway

Natman attempts to guess which network to use. If it guesses wrong, use the `-g` flag to specify a gateway.

**Example:**

     natman open ssh -g 192.168.10.1

## Thanks

To [TooTallNate](https://github.com/TooTallNate/) for making the node [nat-pmp](https://github.com/TooTallNate/node-nat-pmp) module and to [Flatiron](http://github.com/flatiron) for making this easy to build.

# TODO
 - Add ability to run multiple instances of CLI tool at once
 - Add better support for determining the local network interface gateway
