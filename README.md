# Email (Django)

## Project Description
Email (Django) is a front-end for a single-page-app email client that makes API calls to send and receive emails. Using the Web Application's API, we can receive, send, and update emails.

## Content

### 1. Send Mail
![Picture of Compose Email Form](./Images/Compose%20Email.png?raw=true "Compose Email")
Upon clicking the Compose Button, Users are brought to a form where they can write an email to another user. When the email is sent, a POST request is made in order to send the email. The Sent Mailbox is then loaded.

### 2. Mailbox
![Picture of Inbox](./Images/Inbox.png?raw=true "Inbox")
Clicking any of the 3 Mailboxes in the Navbar will load the corresponding mailbox. A GET Request will be made to the API to request the emails that are present in the particular mailbox. 

If the email is unread, it will appear in a white background. Otherwise, it will appear in a gray background.

### 3. View Email
![Picture of Specific Email](./Images/View%20Email.png?raw=true "View Email")
Clicking on any of the Emails will bring the User to a view that presents the specific details of the email, where the recipients, sender, subject, timestamp, and body of the email are shown. This is done by making a GET Request to the Email's API.

Additionally, a PUT Request is also made to update whether the email has been read or not, so as to change the colour of the background as previously mentioned.

### 4. Archive and Unarchive
![Picture of Archived Email](./Images/Archived%20Email.png?raw=true "Archived Email")
When the User is viewing an email that is unarchived, there will be an "Archive Button" in red as shown in an earlier picture, that allows the User to archive emails. This is done by making a PUT Request to the API to update the status of the email. After an email is archived, there will be an alert that notifies the User of the archiving action for a few seconds, before loading the User's inbox.

Conversely, when the User is viewing an archived email, there will be an "Unarchive Button" in gray as shown above that does the converse of archiving an email.

### 5. Reply
![Picture of Reply Email Form](./Images/Reply%20Form.png?raw=true "Reply Email")
In the "View Email" view, there is also a reply button that allows Users to make replies to emails that they received. Upon clicking the button, the User will be brought to an Email Composition form, where the recipient, sender, subject has been prefilled as shown above. Most importantly, in the body of the email, there will be a historical view of previous correspondence between the 2 Users as shown above.

## Learning Outcomes

* Learnt the Basics of Javascript and Template Literals in Javascript.
* Learnt Event-Driven Programming using Javascript, i.e. detection of events and actions taken in response.
* Familiarised with the Javascript Console for debugging purposes.
* Learnt how to use Arrow Functions & Intervals in Javascript.
* Learnt how to use Local Storage to store information in the User's web browser.
* Learnt the basics of Javascript Objects (JSON) and APIs (Application Programming Interface)
* Learnt how to use Javascript to make Single-Page Applications.
* Learnt how to use the Window JSON to implement both Scroll and Infinite Scroll.
* Learnt to create Animation using Cascading Style Sheets.
* Learnt Declarative Programming via the basics of React.

## Video Link
https://youtu.be/vltxiw4dw-A
