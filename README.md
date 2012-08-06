# natman

### natman forwards external public ports to internal ports without touching the router.

*It's a [Network Address Translation](http://en.wikipedia.org/wiki/Network_address_translation) Management tool built on node.js*



## Installation

     npm install natman -g

<img src="http://raw.github.com/Marak/natman/master/screenshots/natman-start.png"></img>

## Usage

     natman open <internal private port> <requested public port>

<img src="http://raw.github.com/Marak/natman/master/screenshots/natman-open.png"></img>

**Open internal port 8000 to the world**

     natman open 8000

*Note: If no requested public port is specified, public port will be auto-assigned*

**Open internal port 8000 to the world on port 9000**

    natman open 8000 9000

*Note: If the requested public port is not available, one will be auto-assigned*

## Built in services

For convenience, Natman comes with a configurable list of built in services. You can customize this list by modifying the [natman.json](https://github.com/Marak/natman/blob/master/config/natman.json) file.

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
 - Improve CLI Experience

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

**nananananananana Natman!*