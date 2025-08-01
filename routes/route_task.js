var express = require('express')
var router = express.Router()
// const path = require('path')
// const fs = require('fs')

const dbname = `${__dirname}/../task.db`
const db = require('better-sqlite3')(dbname)


router.get('/gettasks',(req, res) =>{
  const row = db.prepare('SELECT * from task')
  res.json(row.all())
})

router.get('/gettasktag', (req,res) => {
  const row = db.prepare("SELECT task.task_id, task.task_title,task.duedate, task.completed, task.deleted,task.note,task.pin,tags.tag_id,tags.tag FROM tasktag JOIN task ON  task.task_id = tasktag.task_id JOIN tags ON tags.tag_id = tasktag.tag_id")
  res.json(row.all())
})

router.post('/addtask', (req, res) => {
  const stmt = db.prepare("INSERT INTO task(task_title, duedate,note) VALUES(?,?,?)")
  const info = stmt.run(`${req.body.task_title}`,`${req.body.duedate}`,`${req.body.note}`)
  if(info.changes === 1){
    const tags = req.body.tags
    for(var i = 0 ; i < tags.length ; i++){
      const stmt2 = db.prepare("INSERT INTO tasktag VALUES(?,?)")
      const info2 = stmt2.run(info.lastInsertRowid, parseInt(tags[i]))
      console.log(info2)
    }
    res.json(true)
  }
})

router.delete('/deletetask', (req,res) => { console.log(req.query.task_id)
  const stmt = db.prepare('DELETE from tasktag WHERE task_id=?')
  const info = stmt.run(req.query.task_id)
  //console.log(info)

  if(info.changes >= 1){
    const stmt = db.prepare('DELETE from task WHERE task_id=?')
    const info = stmt.run(req.query.task_id)
    if(info.changes >= 1){
      res.json(true)
    }else{
      res.json(false)
    }
  }else{
    res.json(false)
  }
})

router.put('/updateTask', (req,res) => {
    const stmt = db.prepare("UPDATE task set completed=? WHERE task_id=?")
    const info = stmt.run(req.query.status, req.query.task_id)
    
    if(info.changes === 1){
      res.json(true)
    }else{
      res.json(false)
    } 
})


router.put('/updateTaskDetail', (req,res) => {
  // console.log(req.body)
  // return
  const stmt = db.prepare("UPDATE task set task_title=?,note=?,duedate=? WHERE task_id=?")
  const info = stmt.run(req.body.task_title, req.body.note, req.body.duedate,req.query.task_id)
  
  if(info.changes === 1){
    const stmtdel = db.prepare("DELETE FROM tasktag where task_id=?")
    const delinfo = stmtdel.run(req.query.task_id)
    //console.log('delinfo',delinfo)
    if(delinfo.changes >= 0){
      const tags = req.body.tags
      for(var i = 0 ; i < tags.length ; i++){
          const stmt2 = db.prepare("INSERT INTO tasktag VALUES(?,?)")
          const info2 = stmt2.run(req.query.task_id, parseInt(tags[i]))
          //console.log(info2)
        }
    }
    res.json(true)
  }else{
    res.json(false)
  } 
})


module.exports = router
