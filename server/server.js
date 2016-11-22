const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const COMMENTS_FILE = path.join(__dirname, 'comments.json')

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Cache-Control', 'no-cache')
	next()
}) //sebelum req ke router, respond di manipulasi biar selalu pake header

app.get('/api/comments', function(req,res){
	fs.readFile(COMMENTS_FILE, function(err,data){
		if (err) return console.log(err)
		res.json(JSON.parse(data))
	})
})

app.post('/api/comments', function(req,res){
	fs.readFile(COMMENTS_FILE, function(err,data){
		if (err) {console.log(err)}
		var comments = JSON.parse(data)
		var newComment = {
			id: req.body.id,
			author: req.body.author,
			text: req.body.text
		}
		comments.push(newComment)
		fs.writeFile(COMMENTS_FILE, JSON.stringify(comments,null,4), function(err){
			if (err) {console.log(err)}
			res.json(comments)
		})
	})	
})

app.listen(app.get('port'), function(){
	console.log('ya dha jalan!')
})