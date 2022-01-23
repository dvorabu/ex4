"use strict";
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("theForm").addEventListener("submit", function (event) {
       event.preventDefault()
        document.getElementById("email").value = document.getElementById("email").value.trim();
        let email = document.getElementById("email").value;
        fetchEmail(email);
    })
})
function fetchEmail(email) {
    fetch('/api/checkEmail', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email}) // body data type must match "Content-Type" header
    })
        // .then(status)
        .then(function (res) {
            res.json().then(function (data) {
                if (data==='not exist') {
                    document.getElementById("theForm").submit();
                } else
                    document.getElementById('error').innerHTML = data;
            })
                .catch(function (err) {
                })
        })
}
