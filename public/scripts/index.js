// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'list-users': listUsers,
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-email': changeEmail,
  'change-username': changeUsername,
  'change-password': changePassword,
  'change-bio': changeBio,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'view-all-circles': viewAllCircles,
  'view-circles-by-author': viewCirclesByAuthor,
  'view-circles-by-category': viewCirclesByCategory,
  'create-circle': createCircle,
  'edit-circle': editCircle,
  'delete-circle': deleteCircle,
  'view-likes-by-author': viewLikesByAuthor,
  'view-likes-by-freet': viewLikesByFreetId,
  'create-like': createLike,
  'delete-like': deleteLike,
  'view-following': viewFollowing,
  'view-followers': viewFollowers,
  'create-follow': createFollow,
  'delete-follow': deleteFollow,
  'view-subscriptions': viewSubscriptions,
  'view-subscribers': viewSubscribers,
  'create-subscribe': createSubscribe,
  'delete-subscribe': deleteSubscribe
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData.entries());
      const cleanedData = Object.prototype.hasOwnProperty.call(rawData, 'circles') ? {...rawData, circles: formData.getAll('circles')} : rawData;
      handler(cleanedData);
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
