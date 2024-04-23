router.post('/schedulereq',(req,res)=>{
    var email_id=req.query.mail_id;
    var date=req.body.date;
    var time=req.body.time;
    var concerns=req.body.concerns;
    var symptoms=req.body.symptoms;
    console.log("try schedule",email_id,date,time,concerns,symptoms);
    var sql1="SELECT * from PatientsAttendAppointments,Appointment where patient=? and Appt=id AND Date=? AND starttime=?"
    var coond1,cond2,cond3="";
  
    db.query(sql1,[email_id,date,time],(err,res)=>{
        if(err){
            throw err;
        }else{
            console.log("result",res);
        };
    });
  
  });
  