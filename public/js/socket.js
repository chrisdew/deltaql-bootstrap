function initSocket(callback) {
  var timeout = false;
      sock = window.sock = new Sock();
      socket_url = '';//'http://81.187.221.93:8000';
      that = this;

  function Sock() {
    this.socket = io.connect(socket_url, {secure: false, reconnect: true });
    var that = this;
 
    this.socket.on('disconnect', function() { 
      console.log("disconnect", this.socket);
    }); 
    this.socket.on('connect', function() {
      that.onConnect();
    });
  };

  Sock.prototype.onConnect = function() {
    console.log("Sock::onConnect");
    callback(null, this.socket);
  };
    
  Sock.prototype.emit = function(channel, message) {
    this.socket.emit(channel, message);
  }
  
  Sock.prototype.on = function(event, fn) {
    this.socket.on(event, fn);
  }
  
  return;
}
