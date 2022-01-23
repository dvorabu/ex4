"use strict";
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("theForm").addEventListener("submit", function (event) {
        event.preventDefault()
        document.getElementById("password1").value = document.getElementById("password1").value.trim();
        document.getElementById("password2").value = document.getElementById("password2").value.trim();
      let v=validatePassword( document.getElementById("password1").value, document.getElementById("password2").value)
           v.isValid? document.getElementById("theForm").submit():document.getElementById('error').innerHTML = v.errorMessage;
    })
})
function validatePassword(password1,password2)
{
    if(password1!=password2)
        return {isValid:false,errorMessage:"The passwords don't match"}
    if(password1.length<8)
        return {isValid:false,errorMessage:"The password most include 8 chars"}
    return {isValid:true,errorMessage:" "}


}