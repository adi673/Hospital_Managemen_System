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
  console.log(email);
  console.log(password);
  const dataToPass = { email_id: email};
  console.log(dataToPass);
 res.redirect(`/dashboard_patient?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
});

router.get('/dashboard_patient', (req, res) =>{
  const passedData = JSON.parse(decodeURIComponent(req.query.data));
  const email_d = passedData.email_id;
    // console.log(email);
    // res.send(email);
    const query = 'SELECT name FROM patient WHERE email = ? ';
    db.query(query, [email_d], (err, results) => {
      if (err) { return done(err); }
      console.log(results[0].name);
      res.render('home', {name: results[0].name, email: email_d})
    });
  
});

router.post('/login_doctor', passport.authenticate("doctor",{
  successRedirect:'/dashboard_doctor',
  failureRedirect: "/",
  
}) , function(req, res){ })

router.get('/dashboard_doctor', (req, res) =>{
  res.send('Doctror Dashboard');
});

router.get('/viewMedicalHistory', (req, res) =>{
  var email_id = req.query.email;
  console.log(email_id);
  const query = 'SELECT * FROM Medical_history WHERE email_id = ?';
  connection.query(query, [email_id], (error, results) => {
    if (error) {
      // Handle error
      console.error('Error fetching medical history:', error);
      res.status(500).send('Error fetching medical history');
    } else {
      // Render a webpage to display the medical history data
      res.render('medicalHistory', { medicalHistory: results });
    }
 });
});

router.get('/viewAppointment',(req,res)=>{
  var email_id=req.query.email_id;
  console.log(email_id)

})

router.get('/scheduleAppointment',(req,res)=>{
  var email_id=req.query.email_id;
  console.log(email_id)
})

router.get('/hangePassword', (req,res)=>{
  var email_id=req.query.email_id;
  console.log(email_id)
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
