const express = require("express");
const mongoose = require("mongoose");
const devuser = require("./devusermodel");
const schedule = require("./addschedule");
const student = require("./studentdata");
const notes = require("./referencenote");
const jwt=require('jsonwebtoken');
const middleware=require('./middleware');
const announcementSchema =require('./announcement');
const cors=require('cors');
const studentdata = require("./studentdata");
const team = require("./team");



mongoose.set('strictQuery', false);
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/coordinator_dashboard",
 {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
 }).then(
    ()=>console.log("DB connected")
 )


app.use(express.json())
app.use(cors({origin:'*'}))


app.get("/", (req, res) => {
  return res.send("<h1>COORDINATOR DASHBOARD</h1>");
});

 


app.post('/register',async(req,res)=>{
    try{

        const {fullname,email,mobile,password,confirmpassword}=req.body;
        const exist = await devuser.findOne({email});
        if(exist){
            return res.status(400).send("user already Registered");
        }
        if(password!=confirmpassword){
            return res.status(403).send("Password Not Matched");
        }
        let newUser=new devuser({
            fullname,email,mobile,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send('User Registered Succesfully')

    }catch{
        console.log(err);
        return res.status(500).send("Server Error");
    }
})




app.post('/login',async(req,res)=>{
    try{
        const {mail,password}=req.body;
        const exist= await devuser.findOne({mail})
        if(!exist){
            return res.status(400).send("User not exist")
        }
        if(exist.password !=password){
            return res.status(400).send('Password Invalid' )
        }
        let payload={
            user:{
                id:exist.id
            }
        }
        jwt.sign(payload,'jwtPassword',{expiresIn:3600000000},
        (err,token)=>{
            if(err) throw err
            return res.json({token})
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error")
    }
})




app.get('/allprofiles',middleware,async(req,res)=>{
    try{
        let allprofiles=await devuser.find();
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})

app.get('/myprofile/:id',middleware,async(req,res)=>{
    try{
        let user=await devuser.findById(req.params.id);
        return res.json(user)
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})
app.put('/devuser/:id', middleware, async (req, res) => {
    try {
      const id = req.params.id;
      const update = req.body;
  
      const updatedDevUser = await devuser.updateOne({ _id: id }, update);
  
      if (!updatedDevUser) {
        return res.status(404).send('user not found');
      }
  
      return res.status(200).json(updatedDevUser);}
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})
app.delete('/devuser/:id', middleware, async (req, res) => {
    try {
      const id = req.params.id;
  
      const deletedDevUser = await devuser.findByIdAndDelete(id);
  
      if (!deletedDevUser) {
        return res.status(404).send('server not found');
      }
  
      return res.status(200).json(deletedDevUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  });
  

//studentdata
app.post('/studentregister',async(req,res)=>{
    try{

        const {fullname,mail,section,mobile,campus,year,teamnumber,rollnumber,mentor}=req.body;
        const exist = await student.findOne({mail});
        if(exist){
            return res.status(400).send("Student already Registered");
        }
        let newStudent=new student({
            fullname,mail,section,mobile,campus,year,teamnumber,rollnumber,mentor
        })
        newStudent.save();
        return res.status(200).send('Student Registered Succesfully')

    }catch{
        console.log(err);
        return res.status(500).send("Server Error");
    }
})


app.post('/verify',async(req,res)=>{
    try{
        const {mail,rollnumber}=req.body;
        const exist= await student.findOne({mail})
        if(!exist){
            return res.status(400).send("Student not exist")
        }
        if(exist.mail!=mail){
            return res.status(400).send('Mail Invalid' )
        }
        let payload={
            person:{
                id:exist.id
            }
        }
        jwt.sign(payload,'jwtPassword',{expiresIn:3600000000},
        (err,token)=>{
            if(err) throw err
            return res.json({token})
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error")
    }
})




app.get('/allstudentprofiles',middleware,async(req,res)=>{
    try{
        let allstudentprofiles=await student.find();
        return res.json(allstudentprofiles);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})



app.get('/mystudentprofile/:id',middleware,async(req,res)=>{
    try{
        let person=await student.findById(req.params.id);
        return res.json(person)
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})
app.put('/studentdata/:id', middleware, async (req, res) => {
    try {
      const id = req.params.id;
      const update = req.body;
  
      const updatedStudentData = await studentdata.updateOne({ _id: id }, update);
  
      if (!updatedStudentData) {
        return res.status(404).send('user not found');
      }
  
      return res.status(200).json(updatedStudentData);}
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})
app.delete('/studentdata/:id', middleware, async (req, res) => {
    try {
      const id = req.params.id;
  
      const deletedStudentData = await studentdata.findByIdAndDelete(id);
  
      if (!deletedStudentData) {
        return res.status(404).send('server not found');
      }
  
      return res.status(200).json(deletedStudentData);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  });

//add schedule
app.post('/add-addschedule', async (req, res) => {
    try {
      const { date, day, time, task, deadline, languageused, mentor } = req.body;
      const exist = await schedule.findById(req.params.id);
      if (exist) {
        return res.status(400).send("Schedule already exists");
      }
      let newSchedule = new schedule({
        date,
        day,
        time,
        task,
        deadline,
        languageused,
        mentor,
      });
      newSchedule.save();
      return res.status(200).send("Schedule added successfully");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
  });  
  app.post('/existed',async(req,res)=>{
      try{
          const {date,time}=req.body;
          const exist= await schedule.findOne({time})
          if(!exist){
              return res.status(400).send("Schedule not exist")
          }
          if(exist.time !=time){
              return res.status(400).send('Time Invalid' )
          }
          let payload={
              work:{
                  id:exist.id
              }
          }
          jwt.sign(payload,'jwtPassword',{expiresIn:3600000000},
          (err,token)=>{
              if(err) throw err
              return res.json({token})
          })
  
      }
      catch(err){
          console.log(err);
          return res.status(500).send("Server Error")
      }
  })
  app.get('/allschedules',middleware,async(req,res)=>{
      try{
          let allschedules=await schedule.find();
          return res.json(allschedules);
      }
      catch(err){
          console.log(err);
          return res.status(500).send('server error')
      }
  })
  app.get('/myschedule/:id',middleware,async(req,res)=>{
      try{
          let work=await schedule.findById(req.params.id);
          return res.json(work)
      }
      catch(err){
          console.log(err);
          return res.status(500).send('server error')
      }
  })
  app.put('/addschedule/:id', middleware, async (req, res) => {
      try {
        const id = req.params.id;
        const update = req.body;
    
        const updatedAddSchedule = await schedule.updateOne({ _id: id }, update);
    
        if (!updatedAddSchedule) {
          return res.status(404).send('user not found');
        }
    
        return res.status(200).json(updatedAddSchedule);}
      catch(err){
          console.log(err);
          return res.status(500).send('server error')
      }
  })
  app.delete('/addschedule/:id', middleware, async (req, res) => {
      try {
        const id = req.params.id;
    
        const deletedAddSchedule = await schedule.findByIdAndDelete(id);
    
        if (!deletedAddSchedule) {
          return res.status(404).send('ser not found');
        }
    
        return res.status(200).json(deletedAddSchedule);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
    });
//announcements
app.post('/add-announcements', async (req, res) => {
  const announcement = req.body.Announcement;
  try {
      const data = Announcement.create({announcement}) 
      console.log(data)
      res.send("data created")
  } catch (error) {
    console.log(error)
  }
});

app.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.send(announcements);
  } catch (error) {
    res.status(500).send(error);
  }
});

//creating teams
app.post('/createteam', async (req, res) => {
  try {
    const { teamnumber, teamname, mentor, numberofstudents } = req.body;
    const exist = await team.findOne({ teamnumber });
    if (exist) {
      return res.status(400).send("Team name already exists");
    }
    let newTeam = new team({
      teamnumber,
      teamname,
      mentor,
      numberofstudents
    });
    await newTeam.save();
    return res.status(200).send("Team created successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

app.put('/updateteam/:teamId', async (req, res) => {
  try {
    const { teamname, teamnumber, mentor, numberofstudents } = req.body;
    const existingTeam = await team.findByIdAndUpdate(req.params.teamId, {
      teamname,
      teamnumber,
      mentor,
      numberofstudents
    });
    if (!existingTeam) {
      return res.status(404).send('Team not found');
    }
    return res.status(200).send('Team updated successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

app.delete('/deleteteam/:teamId', async (req, res) => {
  try {
    const existingTeam = await team.findByIdAndDelete(req.params.teamId);
    if (!existingTeam) {
      return res.status(404).send('Team not found');
    }
    return res.status(200).send('Team deleted successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

//student info using rollnumber
app.get('/studentdata/:regNo', async (req, res) => {
  const rollnumber = req.params.regNo;

  try {
    const student = await studentdata.findOne({ rollnumber: rollnumber });

    if (!student) {
      res.status(404).send('Student not found');
    } else {
      res.send(student);
    }
  } catch (err) {
    res.status(500).send('Error retrieving student data');
  }
});
app.listen(2500, () => {
  console.log("Server is running....");
});


