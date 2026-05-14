const chatSocket = io('/chat', {
  extraHeaders: {
    'Authorization': 'Bearer <your access token here>'
  }
});