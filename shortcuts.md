<-COPY AND PASTE ALL BELOW INTO TERMINAL TO GET ALL RUNNING->
If need to remote to local branch
git fetch
git checkout branchxyz

heroku git:remote -a collectors-trading-platform 
heroku login 
heroku run npm run migrate 
heroku run npm run seed 
npm start



*don't use this code:
<div id="message">
  <h3>Password must contain the following:</h3>
  <p id="letter" class="invalid">A <b>lowercase</b> letter</p>
  <p id="capital" class="invalid">A <b>capital (uppercase)</b> letter</p>
  <p id="number" class="invalid">A <b>number</b></p>
  <p id="length" class="invalid">Minimum <b>8 characters</b></p>
</div>