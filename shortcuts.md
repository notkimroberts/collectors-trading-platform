<-COPY AND PASTE ALL BELOW INTO TERMINAL TO GET ALL RUNNING->
If need to remote to local branch
git fetch
git checkout branchxyz

heroku git:remote -a collectors-trading-platform 
heroku login 
heroku run npm run migrate 
heroku run npm run seed 
npm start