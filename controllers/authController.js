// authController.js
const db = require('../models/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Passport local strategy for username/password authentication for patient
passport.use('patient', new LocalStrategy(
  (username, password, done) => {
    const query = 'SELECT * FROM patient WHERE email = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) { return done(err); }
      if (!results.length) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, results[0]);
    });
  }
));

// Passport local strategy for username/password authentication for doctor
passport.use('doctor', new LocalStrategy(
  (username, password, done) => {
    const query = 'SELECT * FROM doctor WHERE email = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) { return done(err); }
      if (!results.length) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, results[0]);
    });
  }
));

// For Doctor
passport.serializeUser((user, done) => {
    done(null, { email: user.email, type: 'doctor' }); // Serialize doctor's email
  });
  
  passport.deserializeUser((data, done) => {
    const query = 'SELECT * FROM doctor WHERE email = ?';
    db.query(query, [data.email], (err, results) => {
      if (err) { return done(err); }
      if (!results.length) { return done(null, false); } // Doctor not found
      return done(null, results[0]); // Return the doctor object
    });
  });
  
  // For Patient
  passport.serializeUser((user, done) => {
    done(null, { email: user.email, type: 'patient' }); // Serialize patient's email
  });
  
  passport.deserializeUser((data, done) => {
    const query = 'SELECT * FROM patient WHERE email = ?';
    db.query(query, [data.email], (err, results) => {
      if (err) { return done(err); }
      if (!results.length) { return done(null, false); } // Patient not found
      return done(null, results[0]); // Return the patient object
    });
  });
  

module.exports = passport;
