# 🚀 TalantonCore - Fullstack CRUD App

A full-stack CRUD application built with **Next.js**, **MongoDB Atlas**, and **AWS S3**, deployed to an **AWS EC2 Ubuntu instance** with **NGINX** and **PM2**, and continuously deployed via **GitHub Actions**.

---

## 📦 Features

- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Image upload to AWS S3
- ✅ MongoDB Atlas for remote data storage
- ✅ GitHub Actions for CI/CD to EC2
- ✅ NGINX reverse proxy on port 80
- ✅ PM2 for persistent Node.js process management

---

## 🗂️ Project Structure

📂 pages/
├── _app.js
├── _document.js
├── index.js
└── api/
    ├── health.js
    ├── upload.js
    └── products/
        ├── index.js     # GET all, POST new
        └── [id].js      # PUT, DELETE specific product

📂 utils/
├── mongodb.js          # MongoDB Atlas connector
└── s3.js               # AWS S3 client config

📂 .github/
└── workflows/
    └── deploy.yml      # GitHub Actions workflow for EC2 deploy



## ⚙️ EC2 Deployment Steps

1. SSH into EC2
```bash
ssh -i "path/to/key.pem" ubuntu@<EC2_PUBLIC_IP>
```

2. Install Node.js & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

3. Clone & Setup App
```bash
git clone https://github.com/aryanmanu02/TalantonCore-assign.git
cd TalantonCore-assign
nano .env.production
```

Add the following environment variables:

```bash
MONGODB_URI=your_mongodb_uri
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret
NODE_ENV=production
```

Then install dependencies and start the app:

```bash
npm install
npm run build
pm2 start npm --name "next-app" -- start
pm2 save
```


4. Set Up NGINX Reverse Proxy

Create a new NGINX config:
```bash
sudo nano /etc/nginx/sites-available/next-app
```

Paste the following configuration:

```bash
server {
    listen 80;
    server_name <YOUR_PUBLIC_IP>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site and reload NGINX:
```bash
sudo ln -sf /etc/nginx/sites-available/next-app /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 🔁 GitHub Actions - CI/CD Deployment

CI/CD is handled using GitHub Actions. On every push to `main`, the app is deployed to your EC2 instance.

📄 **Workflow File Location:**  
`.github/workflows/deploy.yml`

### 🚀 This workflow automatically:

- 🔐 Connects to EC2 via SSH  
- 📥 Pulls the latest code from GitHub  
- 📦 Installs dependencies  
- 🏗️ Builds the Next.js app  
- 🔁 Restarts the app using PM2  
- 🔄 Reloads NGINX to apply changes


## ✅ GitHub Secrets Setup

To set up secrets for CI/CD:

🔧 Go to:  
`GitHub → Repository → Settings → Secrets → Actions`

### 🔐 Add the following secrets:

| Name                    | Description                          |
|-------------------------|--------------------------------------|
| `EC2_HOST`              | `ubuntu@<EC2_PUBLIC_IP>`             |
| `EC2_SSH_KEY`           | Contents of your `.pem` private key |
| `MONGODB_URI`           | MongoDB Atlas URI                    |
| `AWS_REGION`            | e.g. `ap-south-1`                    |
| `AWS_S3_BUCKET`         | Your S3 bucket name                  |
| `AWS_ACCESS_KEY_ID`     | IAM access key ID                    |
| `AWS_SECRET_ACCESS_KEY` | IAM secret access key                |



## 🧠 Learnings & Challenges

- ✅ Correct route format matters — dynamic `[id].js` requires `/products/:id`, **not** `?id=`
- ✅ `pm2 save` ensures the app restarts automatically after an EC2 reboot
- ✅ You must run `npm run build` after every code update for changes to reflect
- ✅ Perform a **hard reload** (Ctrl + Shift + R) in the browser after deployment to clear cache
- ✅ GitHub Actions only triggers on **push to `main`** (or whichever branch is configured)

## 🌐 Live Demo

👉 [http://<your-ec2-public-ip>](http://<your-ec2-public-ip>)

---

## 👨‍💻 Author

Made by **Aryan Nimkar**












