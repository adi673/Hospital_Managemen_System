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

// app.use(bodyParser.urlencoded({ extended: true }));

ap.use(express.urlencoded({ extended: true }));
router.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'));
  res.render('index');
});


router.post('/register_patient', (req, res) => {
  var l_name = req.body.lastName;
  var f_name = req.body.firstName;
  var name = f_name + " " + l_name;
  var gender = req.body.gender;
  var conditions = req.body.conditions || "none";
  var surgeries = req.body.surgeries || "none";
  var medications = req.body.medications || "none";
  var address = req.body.address;
  var email = req.body.email;
  var password = req.body.password;

  var sql = "INSERT INTO Patient(email, password, name, address, gender) VALUES ?";
  var values = [[email, password, name, address, gender]];

  db.query(sql, [values], function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        req.flash('error', 'A patient with this email already exists.'); // Add flash message for error
        res.redirect('Register'); // Redirect or render depending on your app structure
      } else {
        req.flash('error', 'Failed to register patient due to a database error.');
        res.redirect('Register');
      }
    }

    // Proceed with next SQL operation if no error
    var sql2 = "SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1";
    db.query(sql2, function(err, result) {
      if (err) {
        req.flash('error', 'Failed to retrieve medical history.');
        res.redirect('Register');
      }

      let generated_id = result[0].id + 1;
      let currentDate = new Date().toJSON().slice(0, 10);
      let sql3 = "INSERT INTO MedicalHistory(id, date, conditions, surgeries, medication) VALUES ?";
      var values2 = [[generated_id, currentDate, conditions, surgeries, medications]];

      db.query(sql3, [values2], function(err, result) {
        if (err) {
          req.flash('error', 'Failed to create medical history.');
          res.redirect('Register');
        }

        let sql4 = "INSERT INTO patientsfillhistory(patient, history) VALUES ?";
        var values3 = [[email, generated_id]];

        db.query(sql4, [values3], function(err, result) {
          if (err) {
            req.flash('error', 'Failed to link patient with medical history.');
            res.redirect('Register');
          }
          
          req.flash('success', 'Registered patient successfully!');
          res.render('patient_login');
        });
      });
    });
  });
});



router.get('/register', (req, res) => {
  res.render('Register');
});


router.post('/login', (req, res) => {
  const role = req.body.role;
  // Here you can process the form data as needed (e.g., save to database, authenticate user, etc.)
  console.log('Role:', role);
 if(role === 'doctor'){
    // res.sendFile(path.join(__dirname, '../public/doctor_login.html'));
    res.render('doctor_login');
 } else if(role === 'patient'){
    // res.sendFile(path.join(__dirname, '../public/patient_login.html'));
    res.render('patient_login');
 }else if(role === 'new'){
    res.redirect('/register')
 }else if(role === 'admin'){
    // res.sendFile(path.join(__dirname, '../public/AdminLogin.html'));
    res.render('AdminLogin');
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
  //req.flash('success', 'logged in successfully!');
 res.redirect(`/dashboard_patient?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
});


router.post('/login_admin', (req, res) => {
  var email = req.body.username;
  var password = req.body.password;
  if(email === 'admin' && password === 'adi673'){
    req.flash('success', 'logged in successfully!');
    res.render('Admin_options');
    // res.sendFile(path.join(__dirname, '../public/Admin_options.html'));
  }else{
    req.flash('error', 'Invalid username or password!');
   res.redirect('/');
  }
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


router.get('/Add_Doctor', (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/MakeDoc.html'));
  res.render('MakeDoc');
});


// router.post('/submitDoctorForm', (req, res) => { 
//   let params = req.body;
//   let name = params.name + " " + params.lastname;
//   let email = params.email;
//   let password = params.password;
//   let gender = params.gender;
//   let schedule = params.schedule;
//   console.log(params);
//   let sql_statement = `INSERT INTO Doctor (email, gender, password, name) 
//                        VALUES ` + `("${email}", "${gender}", "${password}", "${name}")`;
//   console.log(sql_statement);
//   db.query(sql_statement, function (error, results, fields) {
//     if (error) throw error;
//     else {
//       let sql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) 
//                        VALUES ` + `(${schedule}, "${email}")`;
//       console.log(sql_statement);
//       db.query(sql_statement, function(error){
//         if (error) throw error;
//         else {
//           req.flash('success', 'Doctor created successfully!');
//           res.render('Admin_options');
//           // res.sendFile(path.join(__dirname, '../public/Admin_options.html'));
//         }
//       })
//     };
//   });
// });


router.post('/submitDoctorForm', (req, res) => {
  let params = req.body;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  console.log(params);
  // Use parameterized queries to prevent SQL injection
  let sql = "INSERT INTO Doctor (email, gender, password, name) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [email, gender, password, name], function (error, results) {
    if (error) {
      console.error(error); // Log error for debugging
      if (error.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry specifically
        req.flash('error', 'Cannot create doctor: the email address is already registered.');
        return res.redirect('/submitDoctorForm'); // Redirect back to form
      } else {
        req.flash('error', 'Failed to create doctor due to a database error.');
        return res.redirect('/submitDoctorForm');
      }
    }

    // If doctor is created successfully, proceed with creating the schedule entry
    let sql2 = "INSERT INTO DocsHaveSchedules (sched, doctor) VALUES (?, ?)";
    db.query(sql2, [schedule, email], function(error) {
      if (error) {
        console.error(error); // Log error for debugging
        req.flash('error', 'Doctor created, but failed to assign schedule.');
        return res.redirect('/submitDoctorForm'); // Adjust if necessary
      }
      
      // If everything is fine, flash success and render or redirect
      req.flash('success', 'Doctor created successfully!');
      res.render('Admin_options'); // Assuming this is the correct redirection
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
      req.flash('success', 'logged in successfully!');
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
      const query2= "SELECT DATE_FORMAT(A.date, '%d/%m/%Y') As appointment_date, D.name AS doctor_name, B.concerns, B.symptoms, B.diagnosis, B.prescription FROM Appointment A INNER JOIN (SELECT PA.appt, PA.concerns, PA.symptoms, D.diagnosis, D.prescription, D.doctor FROM PatientsAttendAppointments PA INNER JOIN Diagnose D ON PA.appt = D.appt WHERE PA.patient = ?) AS B ON A.id = B.appt INNER JOIN Doctor D ON D.email = B.doctor;";
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


router.get('/deleteAppt', (req, res) => {
  let uid = req.query.appointment_id;
  var email_id;
  let toFindE_mail = 'SELECT patient FROM PatientsAttendAppointments WHERE appt = ?';
  
  // Query to find email
  db.query(toFindE_mail, [uid], (err, results) => {
      if (err) {
          console.log('Error:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (results.length === 0 || !results[0]) {
          console.log('No patient found for this appointment');
          return res.status(404).json({ success: false, message: 'No patient found' });
      }
      email_id = results[0].patient;
      const dataToPass = { email_id:email_id};
  console.log(dataToPass);
      // Check appointment status and act accordingly
      let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
      console.log(statement);
      db.query(statement, function (error, results, fields) {
          if (error) {
              console.log('Error:', error);
              return res.status(500).json({ success: false, message: 'Internal server error' });
          }
          if (results.length === 0 || !results[0]) {
              console.log('Appointment not found');
              return res.status(404).json({ success: false, message: 'Appointment not found' });
          }
          let status = results[0].status;
          if (status === "NotDone") {
              console.log("in if not done case");
              let deleteStmt = `DELETE FROM Appointment WHERE id=${uid};`;
              console.log(deleteStmt);
              db.query(deleteStmt, function (error, results, fields) {
                  if (error) {
                      console.log('Error:', error);
                      return res.status(500).json({ success: false, message: 'Internal server error' });
                  }
                  console.log('Appointment deleted');
                  req.flash('success', 'Deleted the appointment successfully!');
                  res.redirect(`/dashboard_patient?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
              });
          } else {
              console.log("in else done case");
              let deleteStmt = `DELETE FROM PatientsAttendAppointments WHERE appt = ${uid}`;
              console.log(deleteStmt);
              db.query(deleteStmt, function (error, results, fields) {
                  if (error) {
                      console.log('Error:', error);
                      return res.status(500).json({ success: false, message: 'Internal server error' });
                  }
                  console.log('Patient appointment linkage deleted');
                  req.flash('success', 'Deleted the appointment successfully!');
                  res.redirect(`/dashboard_patient?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
              });
          }
      });
  });
});


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


router.post('/changePasswordPatient', (req,res)=>{  //added today 04/04/2024
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
      req.flash('success', 'Changed password successfully!');
      // res.sendFile(path.join(__dirname, '../public/patient_login.html'));
      res.render('patient_login');
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
  req.flash('success', 'loggedin successfully!');
  res.redirect(`/dashboard_doctor?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
})


router.get('/dashboard_doctor', (req, res) =>{            //added today 04/04/2024
  const passedData = JSON.parse(decodeURIComponent(req.query.data));
  const email_d = passedData.email_id;
  console.log("dashboard doctor ",email_d);
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


router.get('/deleteApptDoc', (req, res) => {
  var uid= req.query.appt_id;
  console.log(uid);

  if (!uid) {
      console.log('UID is undefined. Check query parameters.');
      return res.status(400).json({ success: false, message: 'Missing appointment ID' });
  }

  var email_id;
  let toFindE_mail = 'SELECT doctor FROM diagnose WHERE appt = ?';

  // Query to find email
  db.query(toFindE_mail, [uid], (err, results) => {
      console.log("results", results);
      if (err) {
          console.log('Error:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (results.length === 0 || !results[0]) {
          console.log('No patient found for this appointment');
          return res.status(404).json({ success: false, message: 'No Doctor found' });
      }
      email_id = results[0].doctor;
      const dataToPass = { email_id: email_id };
      console.log(dataToPass);

      // Check appointment status and act accordingly
      let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
      console.log(statement);
      db.query(statement, function (error, results, fields) {
          if (error) {
              console.log('Error:', error);
              return res.status(500).json({ success: false, message: 'Internal server error' });
          }
          if (results.length === 0 || !results[0]) {
              console.log('Appointment not found');
              return res.status(404).json({ success: false, message: 'Appointment not found' });
          }
          let status = results[0].status;
          let deleteStmt;
          if (status === "NotDone") {
              console.log("in if not done case");
              deleteStmt = `DELETE FROM Appointment WHERE id=${uid};`;
          } else {
              console.log("in else done case");
              deleteStmt = `DELETE FROM PatientsAttendAppointments WHERE appt = ${uid}`;
          }
          console.log(deleteStmt);
          db.query(deleteStmt, function (error) {
              if (error) {
                  console.log('Error:', error);
                  return res.status(500).json({ success: false, message: 'Internal server error' });
              }
              console.log('Database operation completed');
              req.flash('success', 'Deleted the Appointment  successfully!');
              res.redirect(`/dashboard_doctor?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
          });
      });
  });
});


router.get('/showDignosisPage',(req,res)=>{
  var appt_id = req.query.appt_id;
  console.log(appt_id);
  res.render('diagnose_page', {appointment_id: appt_id});
});


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

      var getEmailQuery = "SELECT doctor AS email FROM Diagnose WHERE appt=?";
      db.query(getEmailQuery, [id], function (error, results) {
        if (error) {
          console.error("Error fetching email:", error);
          res.status(500).send("Error fetching email.");
          return;
        }

        var email = results[0].email;
        req.flash('success', 'Submitted the Diagnosis successfully!');
        res.redirect('/viewAppointments?email=' + email);
      });
    });
  });
});


router.get('/viewPatients', (req,res)=>{              //added today 04/04/2024
  var email_id = req.query.email;   //check this is working or not without JsonStringify
  console.log(email_id);
  var statement = `SELECT name AS 'Name', PatientsFillHistory.history AS 'ID', email FROM Patient,PatientsFillHistory WHERE Patient.email = PatientsFillHistory.patient AND Patient.email IN (SELECT patient from PatientsAttendAppointments  NATURAL JOIN Diagnose WHERE doctor="${email_id}")`;
  db.query(statement, (error, results) => {
    if (error) {
      console.error('Error fetching patients:', error);
      res.status(500).send('Error fetching patients');
    } else {
      console.log(results);
      res.render('patient_info', { patients: results });
    }
  });
});


router.get('/viewPatients2', (req, res) => {
  var name = req.query.name; // Get the name from the query parameter or default to empty
  let statement =`SELECT DISTINCT Patient.name AS Name, PatientsFillHistory.history AS ID, Patient.email FROM Patient JOIN PatientsAttendAppointments ON PatientsAttendAppointments.patient = Patient.email JOIN Appointment ON PatientsAttendAppointments.appt = Appointment.id JOIN Diagnose ON Diagnose.appt = Appointment.id JOIN PatientsFillHistory ON PatientsFillHistory.patient = Patient.email WHERE Patient.name = "${name}";`;
  db.query(statement, (error, results) => {
      if (error) {
          console.error('Error fetching patients:', error);
          res.status(500).send('Error fetching patients');
      } else {
          console.log(results);
          res.render('patient_info', { patients: results });
      }
  });
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
      req.flash('success', 'Changed Password  successfully!');
      // res.sendFile(path.join(__dirname, '../public/doctor_login.html'));
      res.render('doctor_login');
      // res.json({ success: true, message: 'Password updated successfully' });
    })
  });  
});


router.get('/signout',(req,res)=>{  //added today 04/04/2024    working perfect make it separate for doctor and patient
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // req.flash('success', 'logged out successfully!');
    res.render('index');
    // res.sendFile(path.join(__dirname, '../public/index.html')); // Redirect to the login page after signout
  });
});

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
