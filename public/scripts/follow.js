/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFollowing(fields) {
  fetch(`/api/follows?following=${fields.following}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowers(fields) {
  fetch(`/api/follows?followers=${fields.followers}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFollow(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
  fetch(`/api/follows/${fields.user}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
