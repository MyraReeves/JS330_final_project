# JS330 final project

My final project for UW's "Back-End Application Development With JavaScript" course

## 🔶 Proof of Concept 🔶
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

## 🔶 Project Proposal Description 🔶

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
* CREATE/POST _to set a user's role_
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

☐ &nbsp; **Week 4** <sup>(week 9 of class)</sup> = Write tests, problem solve anything that is broken, and finish any remaining coding.

☐ &nbsp; **Week 5** <sup>(week 10 of class)</sup> = Finish testing, complete any final tweaks, and push the final deployment. Create slides for the in-class presentation.
