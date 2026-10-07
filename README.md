
# Devtinder Frontend
- Create the react+vite app
- Remove the unnecessary Code
- install the tailwind css
- install daisyUi
- Add the navbar component from the daisyUi
- Create the seperate Navbar.jsx file and render in the App.jsx
- install the react-router-dom
- Create the BrowserRouter > Routes > Parent Route(Body) > login ,profile route(child Routes).
- Create the Outlet
- Create the seperate Footer.js component and rendered in the Body.jsx Component.

- Created the sample Routing Pages

- Modify the Footer

- Created The Basic Signup Component

- Create the login Page
- Install the Axios
- Cors -install The Cors in Backend add Middleware with the configuration -origin,Crediantials:true
- Whenever you are Making API Calls so pass Axios =>{withCrendiatials:true}
- install react-redux + @reduxjs/toolkit
- Configure store =>Provider => Createslice =>add reducer to the Store 
- Add the redux Dev tools Chrome Extension 
- Login and check if the data was coming or not 
- Navbar should update as Corresponds to the LoggedIn User
- Refactor the code by adding the Constants

- Modify the Feed Page

- Revisit the code Once

- You should not beAcess the other Routes Without the Login 
- If token is not present Redirect User to the Login Page
- LOGOUT Feature
- PROFILE 

- Create the Edit Profile Feature
- Show toast Message when user Update the profile
- New Page - see all my Connections
- New Page - see all my Requests

- send -interested/ignored Request API with user card removed After the action
- Signup page 
- End to End Testing




# DEPLOYEMENT
- signup on AWS 
- Launch The instance
- devTinder-secret.pem 
- connect with the ssh -i "devTinder-secret.pem" ubuntu@ec2-52-66-247-(dash).ap-south-1.compute.amazonaws.com Command
- install the exact version of my node(v24.13.1) in the virtual ubuntu server
- Git clone frontend and Backend Project
- Frontend
   - npm install -install the dependencies
   - npm run build
   - sudo apt update 
   - sudo apt install ngnix
   - sudo systemctl start nginx -for starting the ngnix server
   - sudo systemctl enable nginx 
   - copy files from dist(build files) to /var/www/html/
   - sudo scp -r dist/* /var/www/html/

- Backend
  - Add the MongoDB connectionurl in the virtual server by creating the .env file inside it.
  - Add the EC2 public IP in the mongoDB network Acess
  - npm install pm2 -g -(for running the backend application 24/7)
  - pm2 start npm -- start
  - pm2 start npm --name "devTinderbackend" -- start -(for giving the custome name to the pm2 log)
  - pm2 logs
  - pm2 list, pm2 flush <name>,pm2 stop <name>,pm2 delete <name> 
  
# NGNIX CONFIG
- make localhost:7777 - localhost(or)IP/api/
    Frontend = http://43.204.96.49/
    Backend  = http://43.204.96.49:7777/

    Domain name = devtinder.com  ⇒  43.204.96.49

    Frontend = devtinder.com
    Backend  = devtinder.com:7777  ⇒  devtinder.com/api
  - ngnix configure -sudo nano /etc/nginx/sites-available/default
  - location /api/ {
        proxy_pass http://127.0.0.1:7777/;
        ................code.........

    }
  - sudo systemctl reload nginx  -(Reload/Restart after the changes)

  -Modify the BASEURL in the frontend project to  "/api"

# Adding the custom Domain Name
  - Purchased Domain Name from the goDaddy
  - Signup the CloudFlare and add the domain name into it then it gives the nameservers
  - Change the Nameservers on godaddy and point it to the CloudFlare
  - Wait for sometime till your NameServers are Updated
  - After the updated Create the DNS "A" record and map in that with the domain name and the IP Address
  - Enable the SSL for the Website 

    
