const router = require('express').Router();
const employees = require('../seeding/employeelist.json');
const todolist = require('../seeding/todolist.json');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
let dbname;
let todoCollection;
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function main(){
    // first create connection to mongodb using the client variable created
    await client.connect();
    // will create the employeedb and initialize dbname variable with it 
    dbname = client.db('employeedb')
    // then, create todolist collection inside the employeedb and initialize todoCollection variable with it
    todoCollection = dbname.collection('todo');
}
main();

// multiple insertion
const createTodo = async (data) => {
    try {
        let todoDoc = await todoCollection.insertOne(data);
        return todoDoc;
    }
    catch (err) {
        console.log(err)
    }
}

// find all todos
const findAllTodos = async () =>{
    try{
        let result = await todoCollection.find({}).toArray();
        return result
    }
    catch (err){
        console.log(err)
    }
}

  
router.get('/', (req, res) => {
    res.render('home');
});

router.post('/login', (req, res) => {
    const id = req.body.escid;
    
        employees.forEach(look =>{
            if(look.employeeID === id){ 
              res.redirect('/employeeList'); 
            } 
        });
        res.send(`<div style="margin-left: 40%;margin-top:10%; "><h1> 
        Sorry you do not belong here. ❌
        </h1>
        <img src="/img/giphy.gif" alt="fig" style="width: 30%;"></div>`
        )
       
});

router.get('/employeeList', (req, res) => {
    res.render('employees', {
        employees
    })
});

router.get('/todoList', async (req, res)=>{
    let todos = await findAllTodos();
    res.render('todolist', {
        todos
    });
});

router.post('/verify', (req, res) => {
    const id = req.body.escid;
    
        employees.forEach(look =>{
            if(look.employeeID === id){ 
               res.redirect('/todolist')
            } 
        });
        res.send(`<div style="margin-left: 40%;margin-top:10%; "><h1> 
        Wrong ID Please. ❌
        </h1>
        <img src="/img/giphy.gif" alt="fig" style="width: 30%;"></div>`)
  
});


// Admin
router.get('/itManager', async (req, res)=>{
    let todos = await findAllTodos();
    res.render('itmanager', {
        todos,
        employees
    })
});
router.post('/upload', async (req, res)=>{
    const data = {
        activity: req.body.activity,
        staff: req.body.staffname,
        status: req.body.status
    }

    const result = await createTodo(data);
    res.redirect('/itManager');
});

module.exports = router;

