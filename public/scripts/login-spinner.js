// Spinner used for the login in page this is used after the twitch auth callback
function loginSpinner() {
  setTimeout(function() {
    window.location = "/whitelist"
  }, 2000)
}


loginSpinner()