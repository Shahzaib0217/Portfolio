# Discover
Request: remove the "● ONLINE" label from the chat header.
Also reported: the CV page is not working.
- Live `/cv` returns 200 application/pdf (54 KB) through `_redirects`.
- Local dev returns 404 for `/cv`, because the dev server does not apply `_redirects`.
- The user confirmed prod works, so the CV links were left unchanged.
