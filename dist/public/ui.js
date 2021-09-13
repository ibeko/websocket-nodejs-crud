"use strict";

var notesList = document.querySelector('#notes');
var savedId = '';

var noteUI = function noteUI(note) {
  var div = document.createElement('div');
  div.innerHTML = "<div class=\"card card-body rounded-0 mb-2 animate__animated animate__fadeInUp\">\n        <div class=\"d-flex justify-content-between\">\n            <h1 class=\"h3 card-title\">".concat(note.title, "</h1>\n            <div>\n                <button class=\"btn btn-danger delete\" data-id=\"").concat(note.id, "\">Sil</button>\n                <button class=\"btn btn-secondary update\" data-id=\"").concat(note.id, "\">G\xFCncelle</button>\n            </div>\n        </div>\n        <p>").concat(note.description, "</p>\n     </div>\n     ");
  var btnDelete = div.querySelector('.delete');
  var btnUpdate = div.querySelector('.update');
  btnDelete.addEventListener('click', function () {
    deleteNote(btnDelete.dataset.id);
  });
  btnUpdate.addEventListener('click', function () {
    getNote(btnUpdate.dataset.id);
  });
  return div;
};

var renderNotes = function renderNotes(notes) {
  notesList.innerHTML = '';
  notes.forEach(function (note) {
    notesList.append(noteUI(note));
  });
};

var appendNote = function appendNote(note) {
  notesList.append(noteUI(note));
};