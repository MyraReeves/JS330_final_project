# JS330 final project

My final project for UW's "Back-End Application Development With JavaScript" course

## 🔶 Final Submission Summary / Self-evaluation (due June 3rd) 🔶

This project was a wonderful opportunity to:

* re-acquaint my coding brain with the process of writing a React front-end app,
* further my experiental understanding and comfort with using Express/MongoDB/Postman to build a backend API,
* improve on writing and using Jest unit tests,
* become better at trouble-shooting development problems that occur in Express projects,
* begin to learn how to use new (to me) Express resources such as [Morgan](https://expressjs.com/en/resources/middleware/morgan.html),
* and begin to better acquaint myself with connecting the frontend to the backend within a single app.

### **Project Challenges Encountered:**

The largest and most unfortunate surprise challenge happened on the final day of this project (today, June 3rd), only 2 hours before our project presentations to class!  My entire computer suddenly crashed, erased all of the database content I had previously seeded, erased the installation of a couple critical dependencies, and caused lasting software issues with Postman (repeated blank screen freezing during use that could only be overcome via "End Task" in Windows Task Manager).  Even as I write this, I still can not see my main OS desktop GUI and have been relying on the icon bar at the bottom of the screen to navigate between needed software.  Thankfully, with the help of internet searches & ChatGPT troubleshooting, I was able to use admin priviledges in Command Prompt to resurrect the use of MongoDB, restore the erased lines of code from files (such as dependency import commands), and [start to recover the json copies of database data](./server/recoveredPostmanData.json) using Postman's cached History tab.  Also thankfully, I was able to use [a previously created "seedAdmin.js" file](./Screenshot2025-06-03-1.jpg) to quickly and easily re-create a new account with admin capabilities within the database so that server functionality could be demonstrated to the class.

The second most significant project challenge I encountered was building and successfully running Jest tests.  I feel incredibly grateful that our previous homework assignments had such large, thorough testing files provided to us. I used them as a model for writing my own!  However, the successful creation and debugging of my test files was still a significantly time-consuming task that prevented me from finishing all of my initial project goals.  For this project, I decided to change how I hashed passwords so that it would occur pre-saving of the user data.  Unfortunately, that decision meant that following the test file contents of our previous homework assignments caused multiple instances of double hashing to occur.  The successful creation/use of mock testing data also consumed a lot of time.  On the bright side, however, I learned some new testing tips such as the use of a testing-only database to better protect my dev database from accidental editing during testing!  I am proud to have finished this project with such a large quantity of Jest tests, [all of which I succeeded in getting to pass! 🥳](./Screenshot2025-06-03-testing.jpg)

Lastly of note within project challenges, I ran into the common programming problem of making several coding syntax errors that needed to be hunted down and thereby slowed my project creation.  One common mistake I repeatedly made was incorrect url paths, in both my files and in Postman.  At one point during development I also accidentally had the Authorization key on a different line than the token value within Postman's header tab, which was not easy to spot and caused a huge delay while I tried to solve what was going wrong.

### **Unfinished Goals:**

The most important unfinished tasks within this project are the creation of several front-end interface pages/components in React and connecting that front-end to the back-end.  As of this project submission, I was only able to create the:

* header -- the login/logout link is not yet functional, but I started writing code to link it to the backend,
* homepage -- I did not yet finish the CSS styling of it and it also has an unfinished link to a user signup page that doesn't exist yet,
* basic dropdown menu page for selecting Washington parks -- no functionality yet when a park is selected,
* and a basic dropdown menu page for selecting Oregon parks -- no functionality yet when a park is selected.

I have not yet started creation of:

* a basic user account "Sign-up" Registration page

* displaying park information from the backend based on the choice the user makes within the dropdown menu. Here is the basic concept starting idea that I will be working off of: [link to screenshot.](./Screenshot2025-06-03-parkInfo.jpg)  Within that, functionality will also need to be written for the comment/Google Maps/state navigation button links, most of which will have park-specific results.  Of special note:
  * A _"leave comments"_ button will only appear for registered users who are currently logged in, but there will be another button (not pictured) for anyone (whether logged-in or logged-out) to be able to read comments that registered users previously left about that park.

* a page only for logged-in users containing the comment form. Here is the basic concept starting idea that I will be building that front-end page off of: [link to screenshot.](./Screenshot2025-06-03-commentForm.jpg)

* dynamically linked pages that display previously submitted park-specific comments left by registered users. Unlike in the following example image, I intend on having it only show comments about whichever one park the user had selected within the state dropdown menu.  Here is a basic styling concept starting idea that I will be building that display of visitor comments off of: [link to screenshot.](./Screenshot2025-06-03-visitorComments.jpg)  The "add your own comment" button would only appear for logged-in, registered users.

* the needed frontend pages for logged-in registered users to be able to create, view, and manage their personal "parks visited" lists

* a dynamically reactive map of each park, created using the Leaflet library.  I began working on this project goal during [my "Supplemental Topic Presentation" assignment](https://github.com/MyraReeves/Leaflet_Demo), wherein I began creating [this map](./Screenshot2025-06-03-leafletRainier.jpg) of Rainier National Park, but I did not have time to build similar custom maps of any of the other parks nor to even begin to integrate the necessary code into this project's front-end HTML.

<br>

<br>

## 🔶 Proof of Concept (due May 21st) 🔶
<!-- Leave an update at the top of your README listing what work is completed and what work still needs to be done. -->
Several of the files for the back-end have been completed. It has a mongoose connection, a running express server, and the necessary libraries installed.  Models exist for the user accounts, the master park list, the user comments, and the users' "visited parks" lists.  Routes exist for the master park list, user comments, auth (user account creation/editing), and the users' "visited parks" lists.

Progress took longer than I had originally intended (See checklist at the bottom of this README).  Depending on how back-end testing goes, I may need to limit the scope of the project to back-end only.  However, I am still currently hopeful that there is enough wiggle-room left in the timeline for me to create a full front and back-end project. 🤞

**Completed:**

* Routes
* Models
* DAO
* Tests for auth (In progress)

**Still needs to be done:**

* Modify the existing visited.js GET routes so that all logged-in users will be able to view the visited parks list of any other user by their username (for all 3 routes - all parks, by type, and by state)
* Finish auth.test file and write additional testing files
* Front-end HTML
* CSS
* Test and fix any problems

<Br>

## 🔶 Project Proposal Description (due May 7th) 🔶

My app will function as a national park information site for hobbyists in Washington and Oregon, with the intention of encouraging visitation to the real world locations.  For project deadline purposes I will be limiting the initial scope to only those two states, but the app could be expanded in the future to include NPS sites in other states as well.

Visitors to the website will be able to quickly find a list of all the national park system locations around Washington and Oregon, in order to facilitate visiting all of them. The database will include park name, park type, location, basic contact information, visitor center hours, and a brief park description including links to the official U.S. government-run informational websites.  Ideally, I would like to also include a map of the locations and (if possible) a way to see what the current weather is at any of the locations.

Only users with an _Admin_ role will be able to create, update, or delete that master list of parks.  However, the general public will be able to create accounts in order to recieve more personalized benefits from the app.

Once logged-in, a user will be able to create/read/update/delete their own unique list of NPS sites they have personally visited.  This information will only be viewable when logged in.  Logged-in users will also be able to leave public comments about the national parks they have visited.   Comment fields will include experiential information such as memorable sights/descriptions of the user's visit, user-generated tips for other park visitors, etc., in addition to more measurable/quantifiable data such as which specific park had been visited, what the weather had been like, etc.  Although comment creation functionality will be limited to only logged-in users, all visitors to the website (whether logged in or not) will be able to read the visitation comments left by others.

<br>

## 🔶 Fulfilling Project Requirements 🔶
<!-- Clear and direct call-outs of how you will meet the various project requirements: -->
The app will be a React Express app using MongoDB to store database contents.  CRUD routes will exist for keeping park lists and visitor comments.  All user accounts will be authenticated to allow for relevant post, update, and delete operations. User roles will determine authorization rights.  Only accounts with an _Admin_ role will be able to create, update, or delete the single master list of parks, and only an Admin will be able to delete or update information belonging to users who have the _Visitor_ role (such as their visitation comments). Indexes and text searches will allow for fast lookup of information for everyone.  Jest unit tests will be utilized to ensure all routes function properly.

<br>

<!-- A description of what the technical components of your project will be, including: the routes, the data models, etc.: -->
## 🔶 Routes 🔶

👥 **User Accounts**

* CREATE/POST _a new user_ ("Sign Up")
* POST _logging in an existing user_
* READ/GET _a list of all users_
* READ/GET _the information about a single user_
* UPDATE/PUT _an existing account_ ("Change Password", etc.)
* DELETE _a user_

🏞️ **Park Master List**

* CREATE/POST a new park to the master list (Admin only)
* READ/GET a list of all parks in the database
* READ/GET a list of all parks in a specified state (only options are WA or OR)
* UPDATE the information about a specific park (Admin only)  
* DELETE a park from the master list (Admin only)

🏞️ **Parks Visited List**

* CREATE/POST _a new park name into the user's visited list_
* READ/GET _a list of all possible parks_
* READ/GET _a list of all parks that a user has listed as "visited"_
* READ/GET _a user's "visited" list based on park type_
* DELETE _a park from a user's list_ (in case of mistakes)

💬 **Visitor Comments**

* CREATE/POST _a comment_
* READ/GET _all comments for a state_ (WA or OR)
* READ/GET _comments for a specific park_
* READ/GET _comments by one specific user name_
* UPDATE/PUT _comment edits_ (Admin only)
* DELETE _a comment_ (Admin only)

## 🔶 Data Models 🔶

👤User Account Schema

* User Name
* Email
* Password
* Role

🏞️ Park Schema

* Name
* US State (WA or OR)
* Park Type (NHS, NVM, NP, etc.)
* Brief Description
* Official Website
* Visitor Center Hours
* Mailing Address
* Phone Number
* Google Maps URL Link

📝 User's Park List Schema

* User Name
* Park Name
* State (WA or OR)
* Park Type

💬 User Comments Schema

* User Name
* Park Name
* State
* When Visit Occurred
* Weather During Visit
* Trip Summary
* Additional (optional) Description Space
* Favorite Moment of the Visit
* Memorable Sights
* Helpful Tips For Others

<br>

## 🔶 Project Timeline 🔶
<!-- A timeline for what project components you plan to complete, week by week, for the remainder of the class: -->
🗹 &nbsp; **Week 1** <sup>(week 6 of class)</sup> = Submit project proposal by May 7th.

🗹 &nbsp; **Week 2** <sup>(week 7 of class)</sup> = Set up the skeleton of the app.  Create needed directories/files and install dependencies.  Begin creating routes, models, and DAO files.

🗹 **Week 3** <sup>(week 8 of class)</sup> _**DUE DATE: May 21st**_ = ~~Set up front end content (including CSS) and~~ continue coding Express route files. Submit prototype/proof of concept with an updated README.

🗹 &nbsp; **Week 4** <sup>(week 9 of class)</sup> = Write tests, problem solve anything that is broken, and finish any remaining coding.

🗹 &nbsp; **Week 5** <sup>(week 10 of class)</sup> = Finish testing, complete any final tweaks, and push the final deployment. Prepare the in-class presentation.
