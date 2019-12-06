exports.handler = function(event, context, callback) {
  // your server-side functionality
  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `apikey ${apiKey}`
    }
  });
  const json = await response.json();
}