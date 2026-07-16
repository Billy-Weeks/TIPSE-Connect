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

    // Assign variables for api_key/url
    const supabaseURL = "https://jyzcfhadrqpdhjlunjav.supabase.co/rest/v1";
    const apiKey = "sb_publishable_JMMPbDQIpBhZWIZQXaclCQ_iTUbm_1W";


    // 1. Ensure the session ID persists across reloads so campus Wi-Fi users don't conflict
    let currentSessionId = sessionStorage.getItem('user_form_session_id');
    if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        sessionStorage.setItem('user_form_session_id', currentSessionId);
    }

    // FETCH 1: Log entry into tracking table first
    fetch(`${supabaseURL}/form_session_limits`, {
        method: "POST",
        headers: {
            "apikey": apiKey,
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({
            session_id: currentSessionId
        })
    })
        .then(logResponse => {
            if (!logResponse.ok) {
                throw new Error("Failed to write to rate-limit tracker");
            }

            // FETCH 2: Submit the actual payload to your target table
            return fetch(`${supabaseURL}/members`, {
                method: "POST",
                headers: {
                    "apikey": apiKey,
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
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
            });
        })
        .then(mainResponse => {
            if (!mainResponse.ok) {
                console.error("Database rejected the request!");
                window.location.href = "error.html";
            }
            else {
                console.log("Successfully sent to Supabase!");
                window.location.href = "success.html";
            }
        })
        .catch(error => {
            console.error("Network or Rate limit exception:", error);
            window.location.href = "error.html";
        });
})