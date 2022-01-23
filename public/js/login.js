"use strict";
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("theForm").addEventListener("submit", function (event) {
        event.preventDefault()
        document.getElementById("theForm").submit();
    })
})