var express = require('express');
var router = express.Router();
// const multr = require('multer')
// const path = require('path')
// const fs = require('fs')

const dbname = `${__dirname}/../task.db`
const db = require('better-sqlite3')(dbname)

router.get('/gettags',(req, res) =>{
  const row = db.prepare('SELECT * from tags')
  res.json(row.all())
})

router.post('/addtag', (req, res) => {
  const stmt = db.prepare("INSERT INTO tags(tag, note) VALUES(?,?)")
  const info = stmt.run(`${req.body.tag}`,`${req.body.note}`)
  if(info.changes === 1){
    res.json(true)
  }
})

router.delete('/deletetag', (req,res) => { //console.log(req.query.task_id)
  try{
    const stmt = db.prepare('DELETE from tags WHERE tag_id=?')
    const info = stmt.run(req.query.tag_id)

    if(info.changes >= 1){
      res.json(true)
    }else{
      res.json(false)
    }
  }catch(err){
    console.log('#err',err.code)
    if(err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY'){
      res.json('Tag is currently in use. Cannot Delete!')
    }
  }
})

router.put('/updatetag', (req,res) => {
  //console.log(req.body, req.query.tag_id)
  const stmt = db.prepare("UPDATE tags set tag=? , note=? WHERE tag_id=?")
  const info = stmt.run(`${req.body.tag}`, `${req.body.note}`,`${req.query.tag_id}`)
  //console.log(info
  if(info.changes === 1){
    res.json(true)
  }else{
    res.json(false)
  } 
})

  module.exports = router;