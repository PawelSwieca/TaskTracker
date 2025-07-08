
# TaskTracker

A Web application designed to monitor your activities and improve productivity




## Author

- [@Candle](https://github.com/PawelSwieca)


## Introduction

This project has been created in order to learn basics of Spring Boot and backend, especially working with databases (MySQL db). The goal was to create a fully functional aplication, that may work on a real server and be used as a reqular todo app like Trelo.
## Description

Before we start to manage our tasks, a login page occur to chceck our login and password (password is verified as and sha256 sum to improve safety). If login was successful, application prsents all of his tasks along with their status, priority, description and important dates. Each task can be separately managed, for e.g to edit its parameters, or change its status.
A TaskTracker page also implements filters to search for tasks in order of their priority or status. Furthermore, a search box has ben created to improve finding tasks on their title.
The most important functionally that defines such application is of course ability to add new task, which will be authomaticly inserted into db with all its dependancies. User can also delete particular tasks, if needed.