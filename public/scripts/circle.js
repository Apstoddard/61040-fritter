/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllCircles(fields) {
  fetch('/api/circles')
    .then(showResponse)
    .catch(showResponse);
}

function viewCirclesByAuthor(fields) {
  fetch(`/api/circles?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewCirclesByCategory(fields) {
  fetch(`/api/circles?category=${fields.category}`)
    .then(showResponse)
    .catch(showResponse);
}

function createCircle(fields) {
  fetch('/api/circles', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editCircle(fields) {
  fetch(`/api/circles/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteCircle(fields) {
  fetch(`/api/circles/${fields.circleId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
