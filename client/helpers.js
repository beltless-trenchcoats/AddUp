exports.parseCookie = function(cookieString) {
  var result = {};
  if (cookieString === '') {
    return result;
  }
  var cookieArray = document.cookie.split('; ');
  for (var i = 0; i < cookieArray.length; i++) {
    result[cookieArray[i].split('=')[0]] = cookieArray[i].split('=')[1];
  }
  return result;
}