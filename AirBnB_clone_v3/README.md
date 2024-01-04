0x05. AirBnB clone - RESTful API
Designing a RESTful API with Python and Flask
Posted by  on  under    
In recent years REST (REpresentational State Transfer) has emerged as the standard architectural design for web services and web APIs.

In this article I'm going to show you how easy it is to create a RESTful web service using Python and the Flask microframework.

What is REST?
The characteristics of a REST system are defined by six design rules:

Client-Server: There should be a separation between the server that offers a service, and the client that consumes it.
Stateless: Each request from a client must contain all the information required by the server to carry out the request. In other words, the server cannot store information provided by the client in one request and use it in another request.
Cacheable: The server must indicate to the client if requests can be cached or not.
Layered System: Communication between a client and a server should be standardized in such a way that allows intermediaries to respond to requests instead of the end server, without the client having to do anything different.
Uniform Interface: The method of communication between a client and a server must be uniform.
Code on demand: Servers can provide executable code or scripts for clients to execute in their context. This constraint is the only one that is optional.
What is a RESTful web service?
The REST architecture was originally designed to fit the HTTP protocol that the world wide web uses.

Central to the concept of RESTful web services is the notion of resources. Resources are represented by URIs. The clients send requests to these URIs using the methods defined by the HTTP protocol, and possibly as a result of that the state of the affected resource changes.

The HTTP request methods are typically designed to affect a given resource in standard ways:

HTTP Method	Action	Examples
GET	Obtain information about a resource	http://example.com/api/orders
(retrieve order list)
GET	Obtain information about a resource	http://example.com/api/orders/123
(retrieve order #123)
POST	Create a new resource	http://example.com/api/orders
(create a new order, from data provided with the request)
PUT	Update a resource	http://example.com/api/orders/123
(update order #123, from data provided with the request)
DELETE	Delete a resource	http://example.com/api/orders/123
(delete order #123)
The REST design does not require a specific format for the data provided with the requests. In general data is provided in the request body as a JSON blob, or sometimes as arguments in the query string portion of the URL.

Designing a simple web service
The task of designing a web service or API that adheres to the REST guidelines then becomes an exercise in identifying the resources that will be exposed and how they will be affected by the different request methods.

Let's say we want to write a To Do List application and we want to design a web service for it. The first thing to do is to decide what is the root URL to access this service. For example, we could expose this service as:

http://[hostname]/todo/api/v1.0/
Here I have decided to include the name of the application and the version of the API in the URL. Including the application name in the URL is useful to provide a namespace that separates this service from others that can be running on the same system. Including the version in the URL can help with making updates in the future, since new and potentially incompatible functions can be added under a new version, without affecting applications that rely on the older functions.

The next step is to select the resources that will be exposed by this service. This is an extremely simple application, we only have tasks, so our only resource will be the tasks in our to do list.

Our tasks resource will use HTTP methods as follows:

HTTP Method	URI	Action
GET	http://[hostname]/todo/api/v1.0/tasks	Retrieve list of tasks
GET	http://[hostname]/todo/api/v1.0/tasks/[task_id]	Retrieve a task
POST	http://[hostname]/todo/api/v1.0/tasks	Create a new task
PUT	http://[hostname]/todo/api/v1.0/tasks/[task_id]	Update an existing task
DELETE	http://[hostname]/todo/api/v1.0/tasks/[task_id]	Delete a task
We can define a task as having the following fields:

id: unique identifier for tasks. Numeric type.
title: short task description. String type.
description: long task description. Text type.
done: task completion state. Boolean type.
And with this we are basically done with the design part of our web service. All that is left is to implement it!

A brief introduction to the Flask microframework
If you read my Flask Mega-Tutorial series you know that Flask is a simple, yet very powerful Python web framework.

Before we delve into the specifics of web services let's review how a regular Flask web application is structured.

I will assume you know the basics of working with Python in your platform. The example command lines I will show below are for a Unix-like operating system. In short, that means that they will work on Linux, Mac OS X and also on Windows if you use Cygwin. The commands are slightly different if you use the Windows native version of Python.

Let's begin by installing Flask in a virtual environment. If you don't have virtualenv installed in your system, you can download it from https://pypi.python.org/pypi/virtualenv.

$ mkdir todo-api
$ cd todo-api
$ virtualenv flask
New python executable in flask/bin/python
Installing setuptools............................done.
Installing pip...................done.
$ flask/bin/pip install flask
Now that we have Flask installed let's create a simple web application, which we will put in a file called app.py:

#!flask/bin/python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)
To run this application we have to execute app.py:

$ chmod a+x app.py
$ ./app.py
 * Running on http://127.0.0.1:5000/
 * Restarting with reloader
And now you can launch your web browser and type http://localhost:5000 to see this tiny application in action.

Simple, right? Now we will convert this app into our RESTful service!

Implementing RESTful services in Python and Flask
Building web services with Flask is surprisingly simple, much simpler than building complete server side applications like the one I built in the Mega-Tutorial.

There are a couple of Flask extensions that help with building RESTful services with Flask, but the task is so simple that in my opinion there is no need to use an extension.

The clients of our web service will be asking the service to add, remove and modify tasks, so clearly we need to have a way to store tasks. The obvious way to do that is to build a small database, but because databases are not the topic of this article we are going to take a much simpler approach. To learn about proper use of databases with Flask once again I recommend that you read my Mega-Tutorial.

In place of a database we will store our task list in a memory structure. This will only work when the web server that runs our application is single process and single threaded. This is okay for Flask's own development web server. It is not okay to use this technique on a production web server, for that a proper database setup must be used.

Using the base Flask application we are now ready to implement the first entry point of our web service:

#!flask/bin/python
from flask import Flask, jsonify

app = Flask(__name__)

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

if __name__ == '__main__':
    app.run(debug=True)
As you can see, not much has changed. We created a memory database of tasks, which is nothing more than a plain and simple array of dictionaries. Each entry in the array has the fields that we defined above for our tasks.

Instead of the index entry point we now have a get_tasks function that is associated with the /todo/api/v1.0/tasks URI, and only for the GET HTTP method.

The response of this function is not text, we are now replying with JSON data, which Flask's jsonify function generates for us from our data structure.

Using a web browser to test a web service isn't the best idea since web browsers cannot easily generate all types of HTTP requests. Instead, we will use curl. If you don't have curl installed, go ahead and install it now.

Start the web service in the same way we started the sample application, by running app.py. Then open a new console window and run the following command:

$ curl -i http://localhost:5000/todo/api/v1.0/tasks
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 294
Server: Werkzeug/0.8.3 Python/2.7.3
Date: Mon, 20 May 2013 04:53:53 GMT

{
  "tasks": [
    {
      "description": "Milk, Cheese, Pizza, Fruit, Tylenol",
      "done": false,
      "id": 1,
      "title": "Buy groceries"
    },
    {
      "description": "Need to find a good Python tutorial on the web",
      "done": false,
      "id": 2,
      "title": "Learn Python"
    }
  ]
}
We just have invoked a function in our RESTful service!

Now let's write the second version of the GET method for our tasks resource. If you look at the table above this will be the one that is used to return the data of a single task:

from flask import abort

@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = [task for task in tasks if task['id'] == task_id]
    if len(task) == 0:
        abort(404)
    return jsonify({'task': task[0]})
This second function is a little bit more interesting. Here we get the id of the task in the URL, and Flask translates it into the task_id argument that we receive in the function.

With this argument we search our tasks array. If the id that we were given does not exist in our database then we return the familiar error code 404, which according to the HTTP specification means "Resource Not Found", which is exactly our case.

If we find the task then we just package it as JSON with jsonify and send it as a response, just like we did before for the entire collection.

Here is how this function looks when invoked from curl:

$ curl -i http://localhost:5000/todo/api/v1.0/tasks/2
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 151
Server: Werkzeug/0.8.3 Python/2.7.3
Date: Mon, 20 May 2013 05:21:50 GMT

{
  "task": {
    "description": "Need to find a good Python tutorial on the web",
    "done": false,
    "id": 2,
    "title": "Learn Python"
  }
}
$ curl -i http://localhost:5000/todo/api/v1.0/tasks/3
HTTP/1.0 404 NOT FOUND
Content-Type: text/html
Content-Length: 238
Server: Werkzeug/0.8.3 Python/2.7.3
Date: Mon, 20 May 2013 05:21:52 GMT

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<title>404 Not Found</title>
<h1>Not Found</h1>
<p>The requested URL was not found on the server.</p><p>If you     entered the URL manually please check your spelling and try again.</p>
When we ask for resource id #2 we get it, but when we ask for #3 we get back the 404 error. The odd thing about the error is that it came back with an HTML message instead of JSON, because that is how Flask generates the 404 response by default. Since this is a web service client applications will expect that we always respond with JSON, so we need to improve our 404 error handler:

from flask import make_response

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)
And we get a much more API friendly error response:

$ curl -i http://localhost:5000/todo/api/v1.0/tasks/3
HTTP/1.0 404 NOT FOUND
Content-Type: application/json
Content-Length: 26
Server: Werkzeug/0.8.3 Python/2.7.3
Date: Mon, 20 May 2013 05:36:54 GMT

{
  "error": "Not found"
}
Next in our list is the POST method, which we will use to insert a new item in our task database:

from flask import request

@app.route('/todo/api/v1.0/tasks', methods=['POST'])
def create_task():
    if not request.json or not 'title' in request.json:
        abort(400)
    task = {
        'id': tasks[-1]['id'] + 1,
        'title': request.json['title'],
        'description': request.json.get('description', ""),
        'done': False
    }
    tasks.append(task)
    return jsonify({'task': task}), 201
Adding a new task is also pretty easy. The request.json will have the request data, but only if it came marked as JSON. If the data isn't there, or if it is there, but we are missing a title item then we return an error code 400, which is the code for the bad request.

We then create a new task dictionary, using the id of the last task plus one (a cheap way to guarantee unique ids in our simple database). We tolerate a missing description field, and we assume the done field will always start set to False.

We append the new task to our tasks array, and then respond to the client with the added task and send back a status code 201, which HTTP defines as the code for "Created".

To test this new function we can use the following curl
