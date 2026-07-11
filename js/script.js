// Variable to store form
const elementForm = document.getElementById('connect-form');

// Add even listener to elementForm
elementForm.addEventListener('submit', function (event) {
    // Anonymous function (??) to prevent default submission behavior
    event.preventDefault();

    // Grab values from form inputs
    const formFirst = document.getElementById('first').value;
    const formLast = document.getElementById('last').value;
    const cinForm = document.getElementById('cin').value;
    const emailForm = document.getElementById('email').value;
    const experienceForm = document.getElementById('experience').value;
    const majorForm = document.getElementById('major').value;

    // Generate session ID for use in rate limiter (security measure)
    const currentSessionId = crypto.randomUUID();

    // Fetch request to server with form data
    fetch("https://jyzcfhadrqpdhjlunjav.supabase.co/rest/v1/members", {
        method: "POST",
        headers: {
            "apikey": "sb_publishable_JMMPbDQIpBhZWIZQXaclCQ_iTUbm_1W",
            "Authorization": "Bearer sb_publishable_JMMPbDQIpBhZWIZQXaclCQ_iTUbm_1W",
            "Content-Type": "application/json",
            "x-form-session-id": currentSessionId

        },
        body: JSON.stringify({
            first_name: formFirst,
            last_name: formLast,
            cin: cinForm,
            email: emailForm,
            experience: experienceForm,
            major: majorForm
        })
    })
        .then(response => {
            if (!response.ok) {
                console.error("Database rejected the request!");
                window.location.href = "error.html";
            }
            else {
                console.log("Successfully sent to Supbase!");
                window.location.href = "success.html";
            }
            
        })
});