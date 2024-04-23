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
const moment = require('moment');
const axios = require('axios');
const fetch = require('fetch');

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
 }else if(role === 'admin'){
    res.sendFile(path.join(__dirname, '../public/AdminLogin.html'));
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

router.post('/login_admin', (req, res) => {
  var email = req.body.username;
  var password = req.body.password;
  if(email === 'admin' && password === 'adi673'){
    res.sendFile(path.join(__dirname, '../public/Admin_options.html'));
  }else{
   res.redirect('/');
  }
});

router.get('/Add_Doctor', (req, res) => {

});

router.get('/view_database', (req, res) => {
  const tableName = req.params.tableName;

  // Query to fetch data from the specified table
  const sql1 = "SELECT * FROM Patient;";
  const sql2 = "SELECT * FROM MedicalHistory;";
  const sql3 = "SELECT * FROM Doctor;";
  const sql4 = "SELECT * FROM Appointment;";
  const sql5 = "SELECT * FROM PatientsAttendAppointments;";
  const sql6 = "SELECT * FROM Schedule;";
  const sql7 = "SELECT * FROM PatientsFillHistory;";
  const sql8 = "SELECT * FROM Diagnose;";
  const sql9 = "SELECT * FROM DocsHaveSchedules;";
  const sql10 = "SELECT * FROM DoctorViewsHistory;";

  db.query(sql1, (err, results1) => {
    if (err) {
      console.error(`Error fetching data from table ${tableName}:`, err);
      res.status(500).send(`Error fetching data from table ${tableName}`);
      return;
    }
    db.query(sql2, (err, results2) => {
      if (err) {
        console.error(`Error fetching data from table ${tableName}:`, err);
        res.status(500).send(`Error fetching data from table ${tableName}`);
        return;
      }
      db.query(sql3, (err, results3) => {
        if (err) {
          console.error(`Error fetching data from table ${tableName}:`, err);
          res.status(500).send(`Error fetching data from table ${tableName}`);
          return;
        }
        db.query(sql4, (err, results4) => {
          if (err) {
            console.error(`Error fetching data from table ${tableName}:`, err);
            res.status(500).send(`Error fetching data from table ${tableName}`);
            return;
          }
          db.query(sql5, (err, results5) => {
            if (err) {
              console.error(`Error fetching data from table ${tableName}:`, err);
              res.status(500).send(`Error fetching data from table ${tableName}`);
              return;
            }
            db.query(sql6, (err, results6) => {
              if (err) {
                console.error(`Error fetching data from table ${tableName}:`, err);
                res.status(500).send(`Error fetching data from table ${tableName}`);
                return;
              }
              db.query(sql7, (err, results7) => {
                if (err) {
                  console.error(`Error fetching data from table ${tableName}:`, err);
                  res.status(500).send(`Error fetching data from table ${tableName}`);
                  return;
                }
                db.query(sql8, (err, results8) => {
                  if (err) {
                    console.error(`Error fetching data from table ${tableName}:`, err);
                    res.status(500).send(`Error fetching data from table ${tableName}`);
                    return;
                  }
                  db.query(sql9, (err, results9) => {
                    if (err) {
                      console.error(`Error fetching data from table ${tableName}:`, err);
                      res.status(500).send(`Error fetching data from table ${tableName}`);
                      return;
                    }
                    db.query(sql10, (err, results10) => {
                      if (err) {
                        console.error(`Error fetching data from table ${tableName}:`, err);
                        res.status(500).send(`Error fetching data from table ${tableName}`);
                        return;
                      }
                      res.render('view_table', {data1: results1,data2: results2,data3: results3, data4: results4, data5: results5, data6: results6, data7: results7, data8: results8, data9: results9, data10: results10,table1: "Patient",table2: "MedicalHistory",table3: "Doctor",table4: "Appointment",table5: "PatientsAttendAppointments",table6: "Schedule",table7: "PatientsFillHistory",table8: "Diagnose",table9: "DocsHaveSchedules",table10: "DoctorViewsHistory" });                                         
                    });            
                  });                 
                });             
              });            
            });
          });
        });
      });
    });
  });
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
      console.error('Error fetching medical history:', error);
      res.status(500).send('Error fetching medical history');
    } else {
      const query2 = 'SELECT date, doctor, concerns, symptoms, diagnosis, prescription FROM Appointment A INNER JOIN (SELECT * FROM PatientsAttendAppointments  NATURAL JOIN Diagnose  WHERE patient = ?) AS B ON A.id = B.appt;';
      db.query(query2, [email_id], (error, results2) => {
        console.log("result2",results2);
        if (error) {
          // Handle error
          console.error('Error fetching appointments:', error);
          res.status(500).send('Error fetching appointments');
        } else {
          res.render('viewOneHistory', { medicalHistory: results, appointments: results2 });
        }
      });

    }
 });
});

router.get('/viewAppointment',(req,res)=>{  //added today  04/04/2024
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log("papa bolo ",email_id);
  const query =  "SELECT PatientsAttendAppointments.appt AS ID, PatientsAttendAppointments.patient AS user, PatientsAttendAppointments.concerns AS theConcerns, PatientsAttendAppointments.symptoms AS theSymptoms, DATE_FORMAT(Appointment.date, '%d/%m/%Y') AS theDate, Appointment.starttime AS theStart, Appointment.endtime AS theEnd, Appointment.status AS status FROM PatientsAttendAppointments JOIN Appointment ON PatientsAttendAppointments.appt = Appointment.id WHERE PatientsAttendAppointments.patient = ?;";

  db.query(query, [email_id], (error, results) => {
    if (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).send('Error fetching appointments');
    } else { 
      console.log("appointment details",results);
      res.render('viewAppt', { appointments: results });
    }
  });
})

router.get('/diagnosis', (req,res)=>{  //check what happens in front end when multiple rows are forwarded in frontend like multiple diagnosis reports
  var appt_id=req.query.appointment_id;
  console.log("appt_id",appt_id);
  const sql = 'SELECT * FROM Diagnose  WHERE appt=?';
  db.query(sql, [appt_id], (err, results) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    console.log("diagnosis results",results);
     console.log("doc",results[0].doctor)
    const sql2='select name from doctor where email=?';
    db.query(sql2,[results[0].doctor],(err,results1)=>{
      if(err) {
        console.log('Error:', err)
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      console.log("results2",results1[0]);
      res.render('viewDiagnosis', {appointment_id: appt_id, diagnosis: results,doc:results1});
    })
    console.log("diagnosis kutra results",results);
    
  });
  

})

router.get('/deleteAppt',(req,res)=>{
  var u_id=req.query.appointment_id
  console.log("u_id",u_id)
  const sql="SELECT status FROM Appointment WHERE id=?"
  db.query(sql,[u_id],(err,results)=>{
    if(err){
      console.log('Error:',err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    else{
      results = results[0].status
      if(results == "NotDone"){
        const statement1 = 'DELETE FROM Appointment WHERE id=${uid};';
        // console.log(statement);
        db.query(statement1,[u_id], function (error, results1) {
          if (error) throw error;
        });
      }else{
        
        const statement2 = 'DELETE FROM PatientsAttendAppointments  WHERE appt = ?';
        // console.log(statement);
        db.query(statement2,[u_id], function (error, results2) {
          if (error) throw error;
        });
         
      } 
    }
  });
  return
});

router.get('/scheduleAppointment',(req,res)=>{  //added today 04/04/2024
  var email_id=req.query.emaild;
  console.log(email_id)
  const query='SELECT name,email FROM Doctor'
  db.query(query,[],(err,results)=>{
    if(err){
      console.log('Error:',err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    console.log(results);
     res.render('scheduleAppt',{doctors:results, email:email_id});
  });
});

router.get('/Patient_settings', (req,res)=>{   //added today 04/04/2024
  var email_id=req.query.email;
  console.log("setting",email_id)
  res.render('settings_patient', {email: email_id} );
});

router.post('/PasswordPatient', (req,res)=>{  //added today 04/04/2024
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
      res.sendFile(path.join(__dirname, '../public/patient_login.html'));
      // res.json({ success: true, message: 'Password updated successfully' });
    })
  });  
});


router.post('/schedulereq', (req, res) => {
  var email_id = req.query.mail_id;
  var date = req.body.date;
  const dateString = new Date(date);
  const dayOfWeekNumber = dateString.getDay();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeekName = days[dayOfWeekNumber];
  var time = req.body.time;
  var doc = req.body.doctor;
  var concerns = req.body.concerns;
  var symptoms = req.body.symptoms;


  console.log('sc', typeof(email_id));
  console.log("try schedule",email_id,dateString,time,concerns,symptoms,doc,dayOfWeekName,doc);

  let statement = `SELECT * FROM PatientsAttendAppointments 
  INNER JOIN Appointment ON PatientsAttendAppointments.appt = Appointment.id  
  WHERE patient = "${email_id}" 
  AND date = '${date}' 
  AND starttime = '${time}'`;

  db.query(statement, (err, results1) => { // Changed `res` to `results1` to avoid overshadowing
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error on first query" });
    }
    console.log("result1", results1);

    statement = `SELECT * FROM Diagnose d INNER JOIN Appointment a 
    ON d.appt = a.id WHERE doctor = "${doc}" AND date = "${date}" AND status = "NotDone" 
    AND '${time}' >= starttime AND '${time}' < endtime`;

    db.query(statement, (error, results2) => { // Changed `res2` to `results2`
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error on second query" });
      }
      console.log("result2", results2);

      let doc2 = doc.trim(); 
      statement = `SELECT doctor, starttime, endtime, breaktime, day 
      FROM DocsHaveSchedules 
      INNER JOIN Schedule ON DocsHaveSchedules.sched = Schedule.id
      WHERE  day = "${dayOfWeekName}"
      AND '${time}' >= starttime
      AND '${time}' < endtime AND doctor = '${doc2}'
      AND NOT ('${time}' >= breaktime AND '${time}' < ADDTIME(breaktime, '1:00:00'));`;
      console.log(`Doctor email: '${doc2}'`); 
      db.query(statement,(error, results3) => { // Renamed `fields` to `results3` for consistency
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Database error on third query" });
        }
        console.log("doc", doc2);
        console.log("result3", results3);

        

        console.log(results1.length, results2.length, results3.length);
        if (results1.length > 0 || results2.length > 0 || results3.length === 0) {
          console.log("Conflicts exist, return all results indicating the conflicts");
        } else {
          console.log("No conflicts, '1' or similar could mean 'available'");
          let statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;'
          db.query(statement, function (error, results, fields) {
          if (error) throw error;
          else {
            let generated_id = results[0].id + 1;
            console.log("id",generated_id);
            // return res.json({ id: `${generated_id}` });
            // var sql_end = CONVERT('${time}', TIME) + INTERVAL 1 HOUR;
            let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
            VALUES (${generated_id}, '${date}', '${time}', CONVERT('${time}', TIME) + INTERVAL 1 HOUR, "NotDone")`;
            console.log(sql_try);
            db.query(sql_try, function (error, results, fields) {
              if (error){ 
                throw error;
              }else{
                let sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                VALUES (${generated_id}, "${doc2}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;
                console.log(sql_try);
                db.query(sql_try, function (error, results, fields) {
                  if (error) throw error;
                  else{
                    let sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
                    VALUES ("${email_id}", ${generated_id}, "${concerns}", "${symptoms}")`;
                    console.log(sql_try);
                    db.query(sql_try, function (error, results, fields) {
                      if (error) throw error;
                      else{
                        req.flash('success', 'Appointment scheduled successfully!');
                        res.redirect(`/viewAppointment?email=${email_id}`);
                      }
                    });
                  }
                });
              }  
            });  
          };
  });
        }
      });
    });
  });
});



// router.post('/schedulereq',(req,res)=>{
//   var email_id=req.query.mail_id;
//   var date=req.body.date;
//   const dateString = new Date(date);
//   const dayOfWeekNumber = dateString.getDay();
//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const dayOfWeekName = days[dayOfWeekNumber];
//   var time=req.body.time;
//   var doc=req.body.doctor;
//   var concerns=req.body.concerns;
//   var symptoms=req.body.symptoms;
//   console.log('sc',typeof(email_id));
//   console.log("try schedule",email_id,dateString,time,concerns,symptoms,doc,dayOfWeekName);
 
// });







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

router.get('/viewAppointments', (req, res)=>{                //added today 04/04/2024
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log(email_id);
  let statement = "SELECT a.id, DATE_FORMAT(a.date, '%d/%m/%Y') AS date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms FROM Appointment a, PatientsAttendAppointments psa, Patient p WHERE a.id = psa.appt AND psa.patient = p.email AND a.id IN (SELECT appt FROM Diagnose WHERE doctor= ?);";
  db.query(statement, [email_id], (err,results)=>{
    if (err) {
      console.error('Error:', err);
    }else{
       console.log(results);
      // res.render('docViewAppt',{appointments: results});
      res.render('docViewAppt',{appointments: results});
    }
  })
  
});

router.get('/showDignosisPage',(req,res)=>{
  var appt_id = req.query.appt_id;
  console.log(appt_id);
  res.render('diagnose_page', {appointment_id: appt_id});
});


// router.post('/submitDiagnosis', (req, res) => {  // Changed from router.get to router.post
//   var id = req.query.id;  // Access id from req.body
//   console.log("submitDiagnosis", id);
//   var diagnosis = req.body.diagnosis;  // Access diagnosis from req.body
//   var prescription = req.body.prescription;  // Access prescription from req.body
//   console.log("submitDiagnosis", id, diagnosis, prescription);
//   var statement = "UPDATE Diagnose SET diagnosis=?, prescription=?  WHERE appt=?;";
//   console.log(statement)
//   db.query(statement,[diagnosis,prescription,id],function (error, results) {
//     if (error) throw error;
//     else {
//       let statement = `UPDATE Appointment SET status="Done" WHERE id=${id};`;
//       console.log(statement)
//       db.query(statement, function (error, results, fields){
//         if(error) {
//            throw error;
//         }else{
//           let statement = "select email doctor as email from Diagnose where appt = ?";
//           db.query(statement,[id],function(error,results){
//             if(error){
//               throw error;
//             }else{
//               let email = results[0].email;
//               res.redirect('/viewAppointments?email='+email);
                
              
//             }
//           });
//           console.log("Diagnosis submitted");
//           res.redirect('/viewAppointments');
//         }
          
//       });
//      }
//   });
// });  dont delete this before testing below one 


router.post('/submitDiagnosis', (req, res) => {
  var id = req.query.id;
  var diagnosis = req.body.diagnosis;
  var prescription = req.body.prescription;
  
  var updateDiagnosisQuery = "UPDATE Diagnose SET diagnosis=?, prescription=?  WHERE appt=?;";
  db.query(updateDiagnosisQuery, [diagnosis, prescription, id], function (error, results) {
      if (error) {
          console.error("Error updating diagnosis:", error);
          res.status(500).send("Error updating diagnosis.");
          return;
      }

      var updateAppointmentQuery = "UPDATE Appointment SET status='Done' WHERE id=?";
      db.query(updateAppointmentQuery, [id], function (error, results) {
          if (error) {
              console.error("Error updating appointment status:", error);
              res.status(500).send("Error updating appointment status.");
              return;
          }

          var getEmailQuery = "SELECT email_doctor AS email FROM Diagnose WHERE appt=?";
          db.query(getEmailQuery, [id], function (error, results) {
              if (error) {
                  console.error("Error fetching email:", error);
                  res.status(500).send("Error fetching email.");
                  return;
              }

              var email = results[0].email;
              res.redirect('/viewAppointments?email=' + email);
          });
      });
  });
});


router.get('/viewPatients?email', (req,res)=>{              //added today 04/04/2024
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log(email_id);
});

router.get('/Doc_settings', (req,res)=>{   //added today 04/04/2024
  var email_id=req.query.email;
  console.log("setting",email_id)
  res.render('settings_doc', {email: email_id} );
})

router.post('/changePasswordDoc', (req,res)=>{  //added today 04/04/2024
  console.log("Requesting DB From")
  var email_id=req.query.email;     //check this works or not on passing it form because of post method
  var old_pass=req.body.oldPassword;
  var new_pass=req.body.newPassword;
  console.log("changePass",email_id,old_pass,new_pass);
  const check_old_pass="SELECT * FROM doctor WHERE email=? AND password = ?";
  const put_new_pass="UPDATE doctor SET password = ? WHERE password = ?"
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
      res.sendFile(path.join(__dirname, '../public/patient_login.html'));
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

// router.get('/gobackPatientDashboard',(req,res)=>{  //added today 04/04/2024 
//   var email_id=req.query.email;
//   res.redirect(`/dashboard_patient?data=${encodeURIComponent(JSON.stringify({email_id:email_id}))}`);
// });

// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated()){
//     console.log('User is authenticated');
//     // return next();
    
//   }
//   res.render('failure') // change later
// } 
//THis isLoggedIn middle ware is not working for /dashboard_patient route and /dashboard_doctor route





module.exports = router;
