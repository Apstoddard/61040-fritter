/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewSubscriptions(fields) {
  fetch(`/api/subscribes?user=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewSubscribers(fields) {
  fetch(`/api/subscribes?circleId=${fields.circleId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createSubscribe(fields) {
  fetch('/api/subscribes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteSubscribe(fields) {
  fetch(`/api/subscribes/${fields.circleId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
