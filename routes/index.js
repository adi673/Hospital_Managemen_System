var express = require('express');
var router = express.Router();
const ap = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const authController = require('../controllers/authController');
const db = require('../models/db');
const e = require('express');
const res = require('express/lib/response');
// Middleware
// app.use(bodyParser.urlencoded({ extended: true }));

ap.use(express.urlencoded({ extended: true }));
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.post('/register_patient', (req, res) => {
  var l_name=req.body.lastName;
  var f_name=req.body.firstName;
  var name = f_name + " " + l_name;
  var gender=req.body.gender;
  var conditions=req.body.conditions;
  var surgeries=req.body.surgeries;
  var medications=req.body.medications;
  var address=req.body.address;
  var email=req.body.email;
  var password=req.body.password;
  
  if(medications===undefined){
      medications="none"
    }
    if(conditions===undefined){
      conditions="none"
    }
    if(!surgeries===undefined){
      surgeries="none"
    }

    var sql="INSERT INTO Patient(email,password,name,address,gender) VALUES ?"
    var values = [
      [email,password,name,address,gender]
    ];  
    db.query(sql,[values], function(err, result) {
      if (err) throw err;
      // res.send('Patient Registered');
    });
   
    var sql2="select id from MedicalHistory group by id desc "
    db.query(sql2, function(err, result) {
      if (err) throw err;
      else{
        console.log(result[0].id  )
        let generated_id=result[0].id+1
        let sql3="INSERT INTO MedicalHistory(id,date,conditions,surgeries,medication) VALUES ?"
        let currentDate = new Date().toJSON().slice(0, 10);
        var values2 = [
          [generated_id,currentDate,conditions,surgeries,medications]
        ];
        db.query(sql3,[values2], function(err, result) {
          if (err) throw err;
          else{
            let sql4="INSERT INTO patientsfillhistory(patient,history) VALUES ?"
            var values3 = [
              [email,generated_id]
            ];
            db.query(sql4,[values3], function(err, result) {
              if (err) throw err;
              else{
                res.send('Patient Registered');
              }
            });
          }
          
        });
      } 
    });
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Register.html'));
});

router.post('/login', (req, res) => {
  const role = req.body.role;
  // Here you can process the form data as needed (e.g., save to database, authenticate user, etc.)
  console.log('Role:', role);
 if(role === 'doctor'){
    res.sendFile(path.join(__dirname, '../public/doctor_login.html'));
 } else if(role === 'patient'){
    res.sendFile(path.join(__dirname, '../public/patient_login.html'));
 }else if(role === 'new'){
    res.redirect('/register')
 }
});

router.post('/login_patient', passport.authenticate("patient",{ 
  successRedirect:'',
  failureRedirect: "/",
}),function(req, res){
  var email = req.body.username;
  var password = req.body.password;
  console.log("login patient",email);
  console.log(password);
  const dataToPass = { email_id: email};
  console.log(dataToPass);
 res.redirect(`/dashboard_patient?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
});

router.get('/dashboard_patient', (req, res) =>{
  const passedData = JSON.parse(decodeURIComponent(req.query.data));
  const email_id = passedData.email_id;
    console.log("dashboard patient ",email_id);
    // res.send(email);
    const query = 'SELECT name FROM patient WHERE email = ? ';
    db.query(query, [email_id], (err, results) => {
      if (err) { return done(err); }
      console.log(results[0].name);
      res.render('home', {name: results[0].name, email: email_id})
    });
  
});

router.get('/viewMedicalHistory', (req, res) =>{
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log("Viw Medical History",email_id);
  const query = 'SELECT gender,name,email,address,conditions,surgeries,medication FROM PatientsFillHistory,Patient,MedicalHistory WHERE PatientsFillHistory.history=id AND patient=email AND email =?';
  db.query(query, [email_id], (error, results) => {
    console.log("result",results);
    if (error) {
      // Handle error
      console.error('Error fetching medical history:', error);
      res.status(500).send('Error fetching medical history');
    } else {
      // Render a webpage to display the medical history data
      // res.render('medicalHistory', { medicalHistory: results });
      res.send(results);
    }
 });
});

router.get('/viewAppointment',(req,res)=>{  //added today  04/04/2024
  var email_id=req.query.email_id;
  console.log(email_id)

})

router.get('/scheduleAppointment',(req,res)=>{  //added today 04/04/2024
  var email_id=req.query.email_id;
  console.log(email_id)
})


router.post('/login_doctor', passport.authenticate("doctor",{   //added today 04/04/2024
  successRedirect:'',
  failureRedirect: "/",
  
}) , function(req, res){ 
  var email = req.body.username;
  var password = req.body.password;
  console.log(email);
  console.log(password);
  const dataToPass = { email_id: email};
  console.log(dataToPass);
 res.redirect(`/dashboard_doctor?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
})

router.get('/dashboard_doctor', (req, res) =>{            //added today 04/04/2024
  const passedData = JSON.parse(decodeURIComponent(req.query.data));
  const email_d = passedData.email_id;
    // console.log(email);
    // res.send(email);
    const query = 'SELECT name FROM doctor WHERE email = ? ';
    db.query(query, [email_d], (err, results) => {
      if (err) { return done(err); }
      console.log(results[0].name);
      res.render('DOC_home', {name: results[0].name, email: email_d})
    });
  // res.send('Doctror Dashboard');
});

router.get('/viewAppointments', (req,res)=>{                //added today 04/04/2024
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log(email_id);
});


router.get('/viewPatients?email', (req,res)=>{              //added today 04/04/2024
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log(email_id);
});


router.get('/settings', (req,res)=>{   //added today 04/04/2024
  var email_id=req.query.email;
  console.log("setting",email_id)
  res.render('settings_page', {email: email_id} );
})

router.post('/changePassword', (req,res)=>{  //added today 04/04/2024
  console.log("Requesting DB From")
  var email_id=req.query.email;     //check this works or not on passing it form because of post method
  var old_pass=req.body.oldPassword;
  var new_pass=req.body.newPassword;
  console.log("changePass",email_id,old_pass,new_pass);
  const check_old_pass="SELECT * FROM patient WHERE email=? AND password = ?";
  const put_new_pass="UPDATE patient SET password = ? WHERE password = ?"
  console.log("Requesting DB")
  db.query(check_old_pass, [email_id,old_pass], (err, rows) =>{
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Incorrect old password' });
    }

    db.query(put_new_pass, [new_pass,old_pass], (err) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      //res.redirect('/'); 
      // Redirect to login page on success  AND add flash mesage of sucess and send msg you will be redirected to login page in 3sec
      res.sendFile(path.join(__dirname, '../public/doctor_login.html'));
      // res.json({ success: true, message: 'Password updated successfully' });
    })
  });  
});


router.get('/signout',(req,res)=>{  //added today 04/04/2024    working perfect make it separate for doctor and patient
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.send("logged out") // Redirect to the login page after signout
  });
})

// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated()){
//     console.log('User is authenticated');
//     // return next();
    
//   }
//   res.render('failure') // change later
// } 
//THis isLoggedIn middle ware is not working for /dashboard_patient route and /dashboard_doctor route





module.exports = router;
