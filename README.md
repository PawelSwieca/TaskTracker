
# TaskTracker

A Web application designed to monitor your activities and improve productivity




## Author

- [@Candle](https://github.com/PawelSwieca)


## Introduction

This project has been created to learn the basics of ***Spring Boot*** and backend, especially working with databases (**MySQL** db). The goal was to create a fully functional application that may work on a real server and be used as a regular todo app like Trelo.

##  DataBase—Structure

Relation database is a backbone of the TaskTracker's ecosystem. It stores the most important data used in this project. In this database we can distinguish so-called strong and weak entities.
**Strong entities**, like tasks, are model for spring objects, managed by a special controller. They define objects that play a crucial role in this application and are visible to regular users, who can interact with them.
Other strong entities are important elements of other entities—define a group of other entities, which allow managing many objects.
**Weak entities** mediate in relation between strong entities. They cannot exist as separate objects, without a link to other entities.
Those entities map **many-to-many** relations and clarify connections—db admin can easily see the relation that conjoins strong entities.

## DataBase—Creation

Repository contains a**.mwb** file, which is a plan of the database. Each developer can use it to create its copy and work on it.
After establishing connection to your schema, you can create SQL code and execute it in your query to build a structure of db.
DataBase also comes with my sample data, so you can see on start, how the application presents data.

What's more important than you need to complete **application.properties** with your connection data! Without them, the application won't be able to establish connection to your database.
You can also change the port on which the server runs, but 8080 is default, so it should work as fine.


## Description

Before we start to manage our tasks, login pages occur to check our login and password (password is verified as and **sha256** sum to improve safety). If login was successful, the application presents all of his tasks along with their status, priority, description and important dates. Each task can be separately managed, for e.g., to edit its parameters or change its status.
A TaskTracker page also implements filters to search for tasks in order of their priority or status. Furthermore, a search box has been created to improve finding tasks on their title.
The most important functionally that defines such an application is, of course, the ability to add a new task, which will be automatically inserted into db with all its dependencies. User can also delete particular tasks, if needed.