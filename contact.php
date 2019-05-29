<?php
	$name = $_POST['name'];
	$visitor_email = $_POST['email'];
	$message = $_POST['Message'];

	$email_from = "47342411+dotimothy@users.noreply.github.com"

	$email_subject = "Github Website Submission";

	$email_body = "Name: $name.\n".
					"Email: $visitor_email.\n".
						"Message: $Message.\n";

	$to = "timothydobsa@gmail.com"

	$headers = "From: $email_from \r\n";

	$headers = "Reply To: $visitor_email \r\n";

	mail($to,$email_subject,$email_body,$headers);

	header("Location: index")

	?>s