server {
  listen 80;

  server_name gcp-app.local;

  location /admin {
    proxy_pass http://localhost:8000;
  }

  location / {
    # proxy_pass http://gcp-app.local:80;
    proxy_pass http://localhost:3000;
  }
}