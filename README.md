# ExcaliDraw - Nextjs Application

## features

- This application supports oauthentication provided by google as well as traditional credential login.
- The web socket establishes connections only with authenticated user for realtime communication.

## challenges Faced

- Faced issues decrypting the token in web socket server which was recieved from auth.js library
  - Solution: Built a custom decoder function helped solve the issue.
  