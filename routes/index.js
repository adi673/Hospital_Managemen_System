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



// router.post('/schedulereq',(req,res)=>{
//   var email_id=req.query.mail_id;
//   var  doc_email=req.body.doctor;
//   var time=req.body.time;
//   var date=req.body.date;
//   var formattedDate = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  
//   console.log("tryschedule", email_id, doc_email, time, formattedDate);
//   let statement = "SELECT * FROM PatientsAttendAppointments, Appointment WHERE patient = ? AND appt = id AND date = ? AND starttime = ?";
//   db.query(statement,[email_id,formattedDate,time],(err,results)=>{
//     if(err){
//       console.error('Error:', err);
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }else{
//       cond1 = results;
//       statement="SELECT * FROM Diagnose d INNER JOIN Appointment a ON d.appt=a.id WHERE doctor= ? AND date=? AND status=? AND ?>= starttime AND ? < endtime";
//       db.query(statement,[doc_email,formattedDate,"NotDone",time,time],(err,results)=>{
//         if(err){
//           console.error('Error:', err);
//           return res.status(500).json({ success: false, message: 'Internal server error' });
//         }else{
//           cond2=results;
//           statement = "SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules  INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id WHERE doctor=? AND day=DAYNAME(?) AND (DATE_ADD(?, INTERVAL +1 HOUR) <= breaktime OR ? >= DATE_ADD(breaktime, INTERVAL +1 HOUR));"
//           db.query(statement,[doc_email,formattedDate,time,time],(err,results)=>{
//            if(err){
//               console.error('Error:', err);
//               return res.status(500).json({ success: false, message: 'Internal server error' });
//             }else{
//               if(results.length){
//                 results = []
//               }
//               else{
//                 results = [1]
//               }
//               console.log(results,cond2);
              
//             }
//           })
//         }  
//       })

      

      
//     }
    
//   })
  
// })

// router.post('/schedulereq',(req,res)=>{
//   var email_id=req.query.mail_id;
//   var  doc_email=req.body.doctor;
//   var time=req.body.time;
//   var date=req.body.date;
//   var formattedDate = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
//   let parsedTime = req.body.time.split(':');
// let startHour = parseInt(parsedTime[0], 10);

// // Calculate the end hour by adding one hour to the start hour
// let endHour = startHour + 1;

// // Ensure the end hour is in the correct format (e.g., with leading zero if needed)
// let formattedEndHour = endHour.toString().padStart(2, '0');

// // Reconstruct the end time string with the calculated end hour and the same minutes
// let endTime = `${formattedEndHour}:${parsedTime[1]}`;
//   console.log("tryschedule", email_id, doc_email, time, formattedDate);

//   let statement1 = "SELECT * FROM PatientsAttendAppointments, Appointment WHERE patient = ? AND appt = id AND date = ? AND starttime = ?";
//   db.query(statement1,[email_id,formattedDate,time],(err,results)=>{
//     if(err){
//       console.error('Error:', err);
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }else{
//       let cond1 = results;

//       let statement2 = "SELECT * FROM Diagnose d INNER JOIN Appointment a ON d.appt=a.id WHERE doctor= ? AND date=? AND status=? AND ?>= starttime AND ? < endtime";
//       db.query(statement2,[doc_email,formattedDate,"NotDone",time,time],(err,results)=>{
//         if(err){
//           console.error('Error:', err);
//           return res.status(500).json({ success: false, message: 'Internal server error' });
//         }else{
//           let cond2=results;

//           let statement3 = "SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules  INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id WHERE doctor=? AND day=DAYNAME(?) AND (DATE_ADD(?, INTERVAL +1 HOUR) <= breaktime OR ? >= DATE_ADD(breaktime, INTERVAL +1 HOUR));";
//           db.query(statement3,[doc_email,formattedDate,time,time],(err,results)=>{
//             if(err){
//               console.error('Error:', err);
//               return res.status(500).json({ success: false, message: 'Internal server error' });
//             }else{
//               let cond3 = results;
//               if(cond3.length > 0){
//                 // Appointment clashes with doctor's schedule
//                 return res.status(200).json({ success: false, message: 'Appointment Clash! Try another doctor or date/time' });
//               } else if (cond1.length > 0) {
//                 // Appointment clashes with patient's existing appointment
//                 return res.status(200).json({ success: false, message: 'Appointment Clash! You already have an appointment at this time.' });
//               } else if (cond2.length > 0) {
//                 // Appointment clashes with doctor's existing appointment
//                 return res.status(200).json({ success: false, message: 'Appointment Clash! Doctor is not available at this time.' });
//               } else {
//                 // Proceed with scheduling the appointment
//                 let statement4 = "INSERT INTO Appointment (date, starttime, endtime, status) VALUES (?, ?, ?, ?)";
//                 db.query(statement4,[formattedDate,time,endTime,"NotDone"],(err,results)=>{
//                   if(err){
//                     console.error('Error:', err);
//                     return res.status(500).json({ success: false, message: 'Internal server error' });
//                   }else{
//                     let apptId = results.insertId;
//                     let statement5 = "INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) VALUES (?, ?, ?, ?)";
//                     db.query(statement5,[apptId,doc_email,"Not Yet Diagnosed","Not Yet Diagnosed"],(err,results)=>{
//                       if(err){
//                         console.error('Error:', err);
//                         return res.status(500).json({ success: false, message: 'Internal server error' });
//                       }else{
//                         return res.status(200).json({ success: true, message: 'Appointment successfully scheduled!' });
//                       }
//                     });
//                   }
//                 });
//               }
//             }
//           });
//         }  
//       });
//     }
//   });
// });



// Check if appointment exists
router.get('/checkIfApptExists', (req, res) => {
  let cond1, cond2, cond3 = ""
  let params = req.query;
  let email = params.email;
  let doc_email = params.docEmail;
  let startTime = params.startTime;
  let date = params.date;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  let sql_start = `CONVERT('${startTime}', TIME)`;
  let statement = `SELECT * FROM PatientsAttendAppointments, Appointment  
  WHERE patient = "${email}" AND
  appt = id AND
  date = ${sql_date} AND
  starttime = ${sql_start}`
  console.log(statement)
  con.query(statement, function (error, results, fields) {
      if (error) throw error;
      else {
          cond1 = results;
          statement=`SELECT * FROM Diagnose d INNER JOIN Appointment a 
          ON d.appt=a.id WHERE doctor="${doc_email}" AND date=${sql_date} AND status="NotDone" 
          AND ${sql_start} >= starttime AND ${sql_start} < endtime`
          console.log(statement)
          con.query(statement, function (error, results, fields) {
              if (error) throw error;
              else {
                  cond2 = results;
                  statement = `SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules 
                  INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
                  WHERE doctor="${doc_email}" AND 
                  day=DAYNAME(${sql_date}) AND 
                  (DATE_ADD(${sql_start},INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`
                  console.log(statement)
                  con.query(statement, function (error, results, fields) {
                      if (error) throw error;
                      else {
                          if(results.length){
                              results = []
                          }
                          else{
                              results = [1]
                          }
                          return res.json({
                              data: cond1.concat(cond2,results)
                          })
                      };
                  });
              };
          });
      };
  });
});

// Schedule appointment
router.get('/schedule', (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  let sql_start = `CONVERT('${time}', TIME)`;
  let sql_end = `CONVERT('${endtime}', TIME)`;
  let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
  VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
      if (error) throw error;
      else {
          let sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
          VALUES (${id}, "${doctor}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;
          console.log(sql_try);
          con.query(sql_try, function (error, results, fields) {
              if (error) throw error;
              else{
                  return res.json({
                      data: results
                  })
              }
          });
      }
  });
});

// Generate UID for appointment
router.get('/genApptUID', (req, res) => {
  let statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;'
  con.query(statement, function (error, results, fields) {
      if (error) throw error;
      else {
          let generated_id = results[0].id + 1;
          return res.json({ id: `${generated_id}` });
      };
  });
});

// Schedule appointment request
router.post('/schedulereq', async (req, res) => {
  try {
      const { theTime, endTime, theDate, theDoc, theConcerns, theSymptoms } = req.body;

      // Check if appointment exists
      const apptExistsResponse = await fetch(`http://localhost:3001/checkIfApptExists?startTime=${theTime}&date=${theDate}&docEmail=${theDoc}`);
      const apptExistsData = await apptExistsResponse.json();
      const apptExists = apptExistsData.data[0];

      if (apptExists) {
          return res.status(400).json({ message: "Appointment Clash! Try another doctor or date/time" });
      }

      // Generate appointment UID
      const uidResponse = await fetch('http://localhost:3001/genApptUID');
      const uidData = await uidResponse.json();
      const gen_uid = uidData.id;

      // Schedule appointment
      const scheduleResponse = await fetch(`http://localhost:3001/schedule?time=${theTime}&endTime=${endTime}&date=${theDate}&concerns=${theConcerns}&symptoms=${theSymptoms}&id=${gen_uid}&doc=${theDoc}`);

      if (!scheduleResponse.ok) {
          throw new Error("Failed to schedule appointment");
      }

      return res.json({ message: "Appointment successfully scheduled!" });
  } catch (error) {
      console.error("Error scheduling appointment:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});





router.post('/schedulereq', (req, res) => {
  var email_id = req.query.mail_id;
  var doc_email = req.body.doctor;
  var time = req.body.time;
  var date = req.body.date;
  var formattedDate = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');

  console.log("Request received - tryschedule:", email_id, doc_email, time, formattedDate);

  // Parse hr string to int and add one hour to start hour
  let startHour = parseInt(time.split(':')[0], 10);
  let endHour = startHour + 1;
  let endTime = `${endHour}:00`;

  console.log("End Time:", endTime);
  console.log("Date:", formattedDate);
  console.log("Time:", time);

  // Check if the doctor email exists in the doctor table
  let checkDoctorQuery = "SELECT * FROM doctor WHERE email = ?";
  db.query(checkDoctorQuery, [doc_email], (err, doctorResults) => {
      if (err) {
          console.error('Error checking doctor email:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (doctorResults.length === 0) {
          console.error('1Doctor email does not exist:', doc_email);
          return res.status(400).json({ success: false, message: '2Doctor email does not exist' });
      }

      // Insert values into Diagnose table
      let insertStatement = "INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) VALUES (?, ?, ?, ?)";
      db.query(insertStatement, ['Replace with value', doc_email, 'Replace with diagnosis', 'Replace with prescription'], (err, results) => {
          if (err) {
              // Check if the error is due to foreign key constraint violation
              if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                  console.error('1Doctor email does not exist in the doctor table:', doc_email);
                  // Handle the error appropriately (e.g., return a response indicating failure)
                  return res.status(400).json({ success: false, message: 'Doctor email does not exist' });
              } else {
                  console.error('Error inserting into Diagnose table:', err);
                  return res.status(500).json({ success: false, message: 'Internal server error' });
              }
          } else {
              console.log('Successfully inserted into Diagnose table:', results);
              // Respond with success message
              return res.status(200).json({ success: true, message: 'Appointment scheduled successfully!' });
          }
      });
  });
});


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
