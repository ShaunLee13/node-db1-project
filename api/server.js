const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send("The API is active")
})

server.get('/api/accounts', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json({data: accounts})
        })
        .catch(error => {
            console.log(error)
            res.status(500)
                .json({errorMessage: error.message})
        })
})

server.post('/api/accounts', (req, res) => {
    db('accounts')
        .insert(req.body)
        .returning('id')
        .then(validation => {
            res.status(201).json({Return:validation})
        })
        .catch(error => {
            console.log(error)
            res.status(500)
                .json({ errorMessage: error.message });
        })
})  

server.get('/api/accounts/:id', (req, res) => {
    db("accounts")
        .where({ id: req.params.id })
        .then(account => {
            if(!account){
                res.status(404).json({ message: "account not found" });
            }else{
                res.status(200).json({data:account})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({errorMessage:error.message})
        })
})

server.put("/api/accounts/:id", (req, res) => {

    db("accounts")
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count) {
                res.status(200).json({ message: "Account updated successfully" });
            } else {
                res.status(404).json({ message: "not found" });
            }
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({ error: error.message });
        });
});

server.delete("/api/accounts/:id", (req, res) => {
    db("accounts")
        .where({ id: req.params.id })
        .del() 
        .then(count => {
            if (count) {
                res.status(200).json({ message: "removed successfully" });
            } else {
                res.status(404).json({ message: "not found" });
            }
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({ error: error.message });
        });
});

module.exports = server;
