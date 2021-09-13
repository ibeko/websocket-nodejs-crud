"use strict";

var _express = _interopRequireDefault(require("express"));

var _socket = require("socket.io");

var _http = _interopRequireDefault(require("http"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var notes = [];
var app = (0, _express["default"])();

var server = _http["default"].createServer(app);

var io = new _socket.Server(server);
app.use(_express["default"]["static"](__dirname + '/public'));
io.on('connection', function (socket) {
  console.log('new connection: ' + socket.id);
  socket.emit('server:loadnotes', notes);
  socket.on('client:newnote', function (newNotes) {
    var note = _objectSpread(_objectSpread({}, newNotes), {}, {
      id: (0, _uuid.v4)()
    });

    notes.push(note);
    io.emit('server:newnote', note);
  });
  socket.on('client:deletenote', function (noteId) {
    notes = notes.filter(function (note) {
      return note.id !== noteId;
    });
    /**
     * socket ile işlem yaparsak geçerli client sayfasında işlem oluyor.
     * io ile işlem yaparsak tüm clientlerde işlem oluyor
     */
    // socket.emit('server:loadnotes', notes)

    io.emit('server:loadnotes', notes);
  });
  socket.on('client:getnote', function (noteId) {
    var note = notes.find(function (note) {
      return note.id === noteId;
    });
    socket.emit('server:selectednote', note);
  });
  socket.on('client:updatenote', function (updatedNote) {
    notes = notes.map(function (note) {
      if (note.id === updatedNote.id) {
        note.title = updatedNote.title, note.description = updatedNote.description;
      }

      return note;
    });
    socket.emit("server:loadnotes", notes);
  });
});
server.listen(3000);
console.log('Server on port: ', 3000);