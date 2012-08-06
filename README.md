# natman

Forward public external ports to internal local area network ports without touching your router.


## Installation

     npm install natman -g
     
## Usage

     natman open <internal private port> <requested public port>

**Example:** Open internal SSH port to public port 8000

     natman open 22 8000

**Example:** Open internal SSH port to public port 8000
     
     
     
## Built in services

For connivence, Natman comes with a configurable list of built in services. You can customize this list by modifying the "natman.json" file.

Simple type `natman open <service>` and `natman close <service>`.

     natman open ssh
     natman open http
     natman open https

# TODO

 - Make natman able to run as background processes
 - Add automated support for determining the local network interface gateway