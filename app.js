const express      = require('express');
const exphbs       = require('express-handlebars');
const app          = express();
const path         = require('path');
const db           = require('./db/connection');
const bodyParser   = require('body-parser');
const { Router }   = require('express');
const Job          = require('./models/Job');
const Sequelize    = require('sequelize');
const Op           = Sequelize.Op;


const PORT = 3000;

app.listen(PORT, function(){
    console.log(`O express esta funcionando na porta ${PORT}`);
});

// body parser;
app.use(bodyParser.urlencoded({ extended: false }));

//handle bars;
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//db connection;
db
.authenticate()
.then(() =>{
    console.log("Conectou ao banco de dados com sucesso");
})
.catch(err =>{
    console.log("ocorreu um erro ao conectar", err);
});

//routes;
app.get('/', (req, res) =>{

    let search = req.query.job;
    let query = '%'+search+'%'; //PH -> TRAS PHP, WORD -> WORDPRESS e etc...
    if(!search){
        Job.findAll({order:[
            ['CreatedAt','DESC']
        ]})
        .then(jobs => {
            res.render('index',{
                jobs
            })
            //.cath(err => console.log(err));
        });

    }else{
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order:[
            ['CreatedAt','DESC']
        ]})
        .then(jobs =>{
            res.render('index',{
                jobs, search
            });
        });
    }


});

// jobs routes;
app.use('/jobs', require('./routes/jobs'));