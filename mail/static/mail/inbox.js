// Wait for the Entire DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {
    console.log("Should be undefined", load_mailbox('inbox'));
  });       // Inbox View
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));         // Sent Emails View
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));  // Archive View
  document.querySelector('#compose').addEventListener('click', compose_email);                   // Compose View

  // By default, load the inbox
  load_mailbox('inbox');

  // Event Listener added to Submit of Compose Email
  document.querySelector('#compose-form').onsubmit = () => send_email();
});

function compose_email() {
    // Remove Alerts if there are any
    alert_div = document.querySelector('#compose-alert');
    if (!(alert_div.innerHTML === "")) {
        alert_div.innerHTML = "";
    }

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#detailed-email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
    // Remove Alerts if there are any
    alert_div = document.querySelector('#email-alert');
    if (!(alert_div.innerHTML === "")) {
        alert_div.innerHTML = "";
    }
  
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#mailbox-heading').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector(`#detailed-email-view`).style.display = 'none';

    // Show the Appropriate View
    var mailboxes = ['sent', 'inbox', 'archive'];
    mailboxes.forEach(element => {
        if (mailbox != element) {
            document.querySelector(`#${element}-view`).style.display = 'none';
        }
        else {
            document.querySelector(`#${element}-view`).style.display = 'block';
        }
    })

    // Show the mailbox name
    document.querySelector('#mailbox-heading').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    // Locate the Div to Append my Emails to
    mailbox_div = document.querySelector(`#${mailbox}-view`);

    // Remove cached / outdated emails
    mailbox_div.innerHTML = "";  

    // Retrieve Updated Emails from Mailbox using GET Request
    fetch(`/emails/${mailbox}`)
    // Convert to JSON
    .then(response => response.json())
    // Append an Email Div to any 1 of the 3 Mailboxes
    .then(emails => {
        // Loop through all the Emails in the Mailbox
        emails.forEach(individual_email => {
            // Details for Every Email Entry
            // Declare Variable First. Can be changed.
            var email_people;
            if (mailbox === "sent"){
                email_people = individual_email["recipients"];
            }

            // Temporarily For Inbox and Archived
            else {
                email_people = individual_email["sender"];
            }

            const email_subject = individual_email["subject"];
            const email_timestamp = individual_email["timestamp"];
            const email_read = individual_email["read"];
            console.log(email_read);
        
            // Creating a Row Div for Every Email
            const email_row_div = document.createElement('div');

            // Color of Row Div depends on if Email is Read/Unread
            if (email_read === true) {
                email_row_div.className += "row individual-email-sections-read";      
            }
            else {
                email_row_div.className += "row individual-email-sections-unread";
            }

            // 3 Columns for 3 Pieces of Information
            var email_info = [email_people, email_subject, email_timestamp];

            // Using a For Loop, create 3 Divs to Represent 3 Columns within each Email Row
            email_info.forEach(info => {
                const email_div = document.createElement('div');
                email_div.innerHTML = info;
                // Add Classes to the Email Div
                email_div.className += "col-4";

                // Add to the Row Div
                email_row_div.append(email_div);
            })

                // Adding an Event Listener for the Entire Row Div
                email_row_div.addEventListener('click', () => {
                    view_email(individual_email["id"]);
                });

            // Add the Row Div to the View Div
            document.querySelector(`#${mailbox}-view`).append(email_row_div);
        });
    })

}

function send_email() {
    // Get Form Data
    const email_recipients = document.querySelector('#compose-recipients').value;
    const email_subject = document.querySelector('#compose-subject').value;
    const email_body = document.querySelector('#compose-body').value;

    // POST Request to "/emails" Route
    fetch('/emails', {                    // Ensure Fetch Request is completed  
        method: "POST",
        body: JSON.stringify({
            recipients: email_recipients,
            subject: email_subject,
            body: email_body
        })  
    })
    // Convert Response and Print it out
    .then(response => {
        // Form Validation to ensure Email exists
        if (response.status === 400){
            // Email does not exist
            compose_email();
            alert_user("This email does not exist!!!", "compose-alert");
            return false;
        }
        else if (response.ok) {
            response.json();
        }
    })
    .then(result => {
        // Form Validation to ensure Email exists
        
        console.log(result);
    });

    // Render User's Sent Mailbox
    load_mailbox('sent');
    
    // Prevent Default Submission of Form
    return false;
  }

function view_email(email_id) {
    // Remove View of Pre-existing View
    document.querySelector('#detailed-email-view').innerHTML = "";

    // GET Request to get the particular email
    fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
        // Hide irrelevant views
        document.querySelector("#compose-view").style.display = 'none';
        document.querySelector("#inbox-view").style.display = 'none';
        document.querySelector("#sent-view").style.display = 'none';
        document.querySelector("#archive-view").style.display = 'none';
        document.querySelector("#mailbox-heading").style.display = 'none';

        document.querySelector("#detailed-email-view").style.display = 'block';

        // Assign various properties of email
        const email_sender = email["sender"];
        const email_recipients = email["recipients"];
        const email_subject = email["subject"];
        const email_timestamp = email["timestamp"];
        var email_body = email["body"];
        const email_archived = email["archived"];

        // Create Detailed Email Div
        const detailed_email_div = document.querySelector("#detailed-email-view");
        detailed_email_div.className += " email-container";
        var email_details_list = [email_sender, email_recipients, email_subject, email_timestamp];
        var email_headers = ["From: ", "To: ", "Subject: ", "Timestamp: "];
        const list_length = email_details_list.length;

        // For Loop to Create a Div for every Property of Email Headers
        for (let i = 0; i < list_length; i += 1) {
            const detailed_property_div = document.createElement('div');
            detailed_property_div.innerHTML = email_headers[i] + email_details_list[i];
            // Append to the Main Div
            detailed_email_div.append(detailed_property_div);
        }

        // Add an Archive and Reply Button after Timestamp
        const buttons_div = document.createElement('div');
        const reply_button = document.createElement("button");
        const archive_button = document.createElement("button");

        // Style the Buttons
        reply_button.className += "btn btn-primary inline-buttons";
        reply_button.innerHTML = "Reply";

        // Adding Event Listeners to the Archive
        if (email_archived === false) {
            archive_button.innerHTML = "Archive";
            archive_button.className += "btn btn-danger inline-buttons";
            archive_button.addEventListener('click', function() {
                console.log("It was archived.");
                archive_email(email_id);
            });
        }
        else {
            archive_button.innerHTML = "Unarchive";
            archive_button.className += "btn btn-secondary inline-buttons";
            archive_button.addEventListener('click', function() {
                console.log("It was unarchived.");
                unarchive_email(email_id);
            });
            }
        
        // Adding Event Listeners to the Reply
        reply_button.addEventListener('click', () => {
            reply_email(email_sender, email_subject, email_body, email_timestamp)
        });
        

        // Add to Main Div
        buttons_div.append(reply_button);
        buttons_div.append(archive_button);
        buttons_div.className += " email-container";
        detailed_email_div.append(buttons_div);

        // Add a Thematic Break followed by Contents of Email
        const email_body_div = document.createElement('div');  
        
        // HTML doesn't recognise \n. Convert to line break tags
        email_body = email_body.replace(/\n/g, "<br />");
        
        email_body_div.innerHTML = email_body;
        email_body_div.className += "email-detailed-content";
        detailed_email_div.append(email_body_div);

        // PUT Request to Update that Email is read
        fetch(`/emails/${email_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
        })        

        // Change Line Break Tags back to \n Characters
        email_body = email_body.replace(/<br ?\/?>/g, "\n");
    })
}

function archive_email(email_id) {
    // PUT Request to archive the email by updating the API
    fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
    })
    // After Archiving
    .then(() => {
        // Reload the Inbox
        load_mailbox('inbox');
        // Alert the User that the Email has been archived
        alert_user("This email has been archived!!", "email-alert");
    })
}

function unarchive_email(email_id) {
    // PUT Request to archive the email
    fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
    })
    // After Unarchiving
    .then(() => {
        // Reload the Inbox
        load_mailbox('inbox');
        // Alert the User that the Email has been archived
        alert_user("This email has been unarchived!!", "email-alert");
    })
}

function reply_email(recipients, subject, body, timestamp) {
    // Remove Alerts if there are any
    alert_div = document.querySelector('#compose-alert');
    if (!(alert_div.innerHTML === "")) {
        alert_div.innerHTML = "";
    }

    // Get the Email Composition Form
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#detailed-email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Check if Subject contains Re: 
    var reply_subject;
    if (subject.includes("Re:") === true) {
        reply_subject = subject;
    }
    else {
        reply_subject = "Re: " + subject;
    }
    
    // Prepare Body
    var reply_body;
    // Space for User to type Reply
    reply_body = `\n\n` +`On ${timestamp} ${recipients} wrote: \n` + `${body}`;

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = recipients;
    document.querySelector('#compose-subject').value = reply_subject;
    document.querySelector('#compose-body').value = reply_body;

}

function alert_user(message, div_id) {
    // Get the Alert Div
    email_alert_div = document.querySelector(`#${div_id}`);

    // Alert the User that the Email has been archived
    const new_alert = document.createElement('div');
    new_alert.innerHTML = message;

    // Style the Alert using Bootstrap CSS
    if (div_id === "email-alert") {
        new_alert.className += "alert alert-info";
    }
    else if (div_id === "compose-alert") {
        new_alert.className += "alert alert-danger";
    }
    new_alert.setAttribute("role", "alert"); 

    // Add Alert to the Div
    email_alert_div.append(new_alert);
    // Remove after 2s elapsed
    setTimeout(() => {
        new_alert.parentNode.removeChild(new_alert);
    }, 2000);
}