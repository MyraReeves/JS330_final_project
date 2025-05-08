# JS330 final project

My final project for UW's "Back-End Application Development With JavaScript" course

<!-- Grading Criteria:  Demonstrate how project requirements will be met and value will be generated. Project should be split up into tasks laid out on a timeline. -->

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

🏞️ **Parks Visited List**

* CREATE/POST _a new park name into the user's visited list_
* READ/GET _a list of all possible parks_
* READ/GET _a list of all parks that a user has listed so far as having visited_
* READ/GET _the user's list based on park type_
* DELETE _a park from the user's list_ (in case of mistakes)

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
**Week 1** <sup>(week 6 of class)</sup> = Submit project proposal.

**Week 2** <sup>(week 7 of class)</sup> = Set up the skeleton of the app.  Create needed directories/files and install dependencies.  Begin creating routes, models, and DAO files.

**Week 3** <sup>(week 8 of class)</sup> = Set up front end content (including CSS) and continue coding Express route files. Submit prototype/proof of concept with an updated README.

**Week 4** <sup>(week 9 of class)</sup> = Write tests, problem solve anything that is broken, and finish any remaining coding.

**Week 5** <sup>(week 10 of class)</sup> = Finish testing, complete any final tweaks, and push the final deployment. Create slides for the in-class presentation.
