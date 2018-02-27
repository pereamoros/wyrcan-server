# Wyrcan

## install

Clone this repo, make sure you have mongodb running, and then...


```
npm install
npm start
```



# User stories

- *Login* - As a user, I want to log in to view/create jobs and get hired/get candidates
- *Signup* - As a user, I want to sign up so that I can view/create jobs to get hired/get candidates
- *Logout* - As a user, I want to be able to log out.
-----------------------------
- *View Profile* - As a user, I want to be able to see my own profile.
- *Create job* - As a user (employer), I want to be able to create a job to find a candidate.
- *View jobs* - As a user (student), I want to be able to see a list of jobs to apply on them.
- *Apply job* - As a user (student), I want to apply to a particular job to get hired.
- *View Employer Profile* - As a user (student), I want to be able to see the employer profile to know more about the company.
- *View my jobs* - As a user (employer), I want to be able to view a list of my current jobs.
- *View job details* - As a user (employer), I want to be able to view job details to view candidates that might applied.
- *View Candidate Profile* - As a user (employer), I want to be able to see a single candidate profile to contact or accept him.
-----------------------------
(Green list)
- *Accept Candidate* - As a user (employer), I want to be able to accept A candidate to hire him/her.
- *Contact Candidate* - As a user (employer), I want to be able to contact A candidate to get to know him/her more.
- *Chat with employers* - As a user (student), I want to be able to chat whit a employer that has contacted me to let me know better.
- *View Conversations* - As a user, I want to be able to see my current conversations with other users.
- *Edit Profile* - As a user, I want to be able to edit my profile.
- *Archive jobs* - As a user (employer), I want to be able to archive my jobs.
- *Unarchive jobs* - As a user (employer), I want to be able to unarchive my jobs that were already archive.
- *Delete jobs* - As a user (employer), I want to be able to delete my jobs definetely.
- *Edit jobs* - As a user (employer), I want to be able to edit my jobs.
- *Categories* - As a user (student), I want to be able to filter the job offers to get a better approach of interests.
- *View applied jobs* -  As a user (student), I want to be able to see in which offers I have applied.



# Routes

## Homepage (/)

- GET /

## Authentication (/auth)

- GET /me
- POST /login
- POST /signup
- POST /logout

## General

- GET /jobs
- GET /jobs/:id
- POST /users/:id
- POST /jobs/create


# MODELS

## Users

- name
- username
- password
- role: string // one of `student` or `employer`

## Jobs

- position
- description
- applications = [{
user: ''
text: ''
}]
- owner

### Main page when logged in

- for employer it goes to my jobs
- for student it goes to jobs
- can't go to main page when logged in - will redirect
