const express = require('express')
const multer = require('multer')
const fs = require('fs')
const Tesseract = require('tesseract.js')
const app = express()
var data;

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,res,cb)=>{
        cb(null,res.originalname)
    }
})

const upload = multer({storage:storage}).single("avatar");
app.set('views','./views')
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render('index',{data:' ',filename:'Choose file...'})
})

app.route('/').post((req,res)=>{
    upload(req,res,err=>{
        fs.readFile(`./uploads/${req.file.originalname}`,(err,data)=>{
            Tesseract.recognize(`./uploads/${req.file.originalname}`,'eng',{logger:progress=>{console.log(progress);}}
            ).then(({ data: { text } }) => {
            data=text
            console.log(data);
            res.render('index',{data :data,filename:req.file.originalname})
            })
        })
    })
})

app.listen(3000)
