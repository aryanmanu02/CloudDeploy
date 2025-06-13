Here is your complete and polished README.md including:

✅ Full EC2 Deployment Steps

✅ GitHub Actions + Secrets Setup

✅ Project Directory Structure

✅ Learnings, features, and live URL info

markdown
Copy
Edit
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

pages/
├── _app.js
├── _document.js
├── index.js
└── api/
├── health.js
├── upload.js
└── products/
├── index.js # GET all, POST new
└── [id].js # PUT, DELETE specific product

utils/
├── mongodb.js # MongoDB Atlas connector
└── s3.js # AWS S3 client config

.github/
└── workflows/
└── deploy.yml # GitHub Actions workflow for EC2 deploy

yaml
Copy
Edit

---

## ⚙️ EC2 Deployment Steps

### 1. SSH into EC2

```bash
ssh -i "path/to/key.pem" ubuntu@<EC2_PUBLIC_IP>
2. Install Node.js & PM2
bash
Copy
Edit
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
3. Clone & Setup App
bash
Copy
Edit
git clone https://github.com/aryanmanu02/TalantonCore-assign.git
cd TalantonCore-assign

# Add env vars
nano .env.production
env
Copy
Edit
MONGODB_URI=your_mongodb_uri
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret
NODE_ENV=production
Then:

bash
Copy
Edit
npm install
npm run build
pm2 start npm --name "next-app" -- start
pm2 save
4. Set Up NGINX Reverse Proxy
bash
Copy
Edit
sudo nano /etc/nginx/sites-available/next-app
Paste this:

nginx
Copy
Edit
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
Then:

bash
Copy
Edit
sudo ln -sf /etc/nginx/sites-available/next-app /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
🤖 GitHub Actions CI/CD
Located at .github/workflows/deploy.yml
Automatically:

Connects to EC2 via SSH

Pulls latest code

Installs dependencies

Builds app

Restarts with PM2

Reloads NGINX

✅ GitHub Secrets Setup
Go to GitHub Repo → Settings → Secrets → Actions, and add:

Name	Description
EC2_HOST	ubuntu@<EC2_PUBLIC_IP>
EC2_SSH_KEY	Private key contents (.pem)
MONGODB_URI	MongoDB Atlas URI
AWS_REGION	e.g. ap-south-1
AWS_S3_BUCKET	Your S3 bucket name
AWS_ACCESS_KEY_ID	IAM user's access key ID
AWS_SECRET_ACCESS_KEY	IAM user's secret key

🧠 Learnings & Challenges
✅ Correct routing is critical — dynamic routes like [id].js require /products/:id, not ?id=

✅ pm2 save ensures persistence on reboot

✅ npm run build is required every time you pull updated frontend/backend code

✅ Always do a hard reload (Ctrl+Shift+R) to avoid browser caching old builds

✅ GitHub Actions won't trigger unless pushing to main (or configured branch)

🌐 Live Demo
bash
Copy
Edit
http://<your-ec2-public-ip>
👨‍💻 Author
Made with ❤️ by Aryan Manu
