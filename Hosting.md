## 🧩 1. SSH into Your Server

```bash```
<!-- ssh -i "clinic-react.pem" ubuntu@3.110.189.17 --> 

2. Navigate to the Frontend Directory
cd ~/frontend


3. Pull the Latest Changes from GitHub
git pull origin main


4. Install Dependencies
npm install

5. Build the Project
npm run build


6. Clear the Old Files from Nginx Web Directory
sudo rm -rf /var/www/vhosts/react-frontend/*


7. Copy the New Build Files to Nginx Directory
sudo cp -R dist/* /var/www/vhosts/react-frontend/


# To Update changes in project
`sudo nginx -t && sudo systemctl restart nginx`