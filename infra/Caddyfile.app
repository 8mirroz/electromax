{
  email {$ACME_EMAIL}
}

{$APP_DOMAIN} {
  encode zstd gzip
  reverse_proxy app:3000
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "SAMEORIGIN"
    Referrer-Policy "strict-origin-when-cross-origin"
  }
}

{$N8N_DOMAIN} {
  encode zstd gzip
  reverse_proxy n8n:5678
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
  }
}
