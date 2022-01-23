"use strict";
const APIKEY = "1BWcxhL11MzOzricpEcgtLqRmlVPdgMnWZk7NRhQ"
/**
 * a module for all string validation functions
 * @type {{isNotAfter: (function(*=, *=): {isValid: boolean, message: string}), isNotBefore: (function(*=, *=): {isValid: boolean, message: string}), isGoodSolDate: (function(*=): {isValid: boolean, message: string}), isNotEmpty: (function(*): {isValid: boolean, message: string}), isSelect: (function(*): {isValid: boolean, message: string}), isGoodDate: (function(*=): {isValid: boolean, message: string}), isNotAfterSol: (function(*, *): {isValid: boolean, message: string})}}
 */
const validatorModule = (function() {
    /**
     *
     * @param str- a date to validate
     * @returns {{isValid: boolean, message: string}}- isValid return true if the date is in the right format, message- return error message if the date is not correct
     */
    const isGoodDate = function (str) {
        let flag = true ;
        (/^\d{4}-\d{2}-\d{2}$/.test(str))? flag = true: flag=  false;
        let dtArray = str.split("-")
        let dtMonth = dtArray[1];
        let dtDay= dtArray[2];
        let dtYear = dtArray[0];
        if (dtMonth < 1 || dtMonth > 12)
            flag = false;
        else if (dtDay < 1 || dtDay> 31)
            flag = false;
        else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
            flag = false;
        else if (dtMonth == 2)
        {
            let isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay> 29 || (dtDay ==29 && !isleap))
                flag =  false;
        }
        return {
            isValid: flag,
            message: 'please enter a SOL number or a valid date'
        };
    }
    /**
     *
     * @param str - a sol date to validate
     * @returns {{isValid: boolean, message: string}} - isValid return true if the sol date Includes only digits, message- return error message if the date is not correct
     */
    const isGoodSolDate = function (str) {
        return  {
            isValid: (/^[0-9]+$/.test(str)),
            message: 'please enter a SOL number or a valid date'
        };
    }
    /**
     *
     * @param str - the date input
     * @returns {{isValid: boolean, message: string}} -isValid return true if the sis not empty, message- return error message if the date is not correct
     */
    const isNotEmpty = function (str) {
        return  {
            isValid: (str.length !== 0),
            message: 'input is required here'
        };
    }
    /**
     *
     * @param str - select input
     * @returns {{isValid: boolean, message: string}} - isValid return true if the select input is not empty, message- return error message
     */
    const isSelect = function (str)  {
        return  {
            isValid:(str!= 0 ),
            message: 'input is required here'
        };
    }
    /**
     *
     * @param date - the input date
     * @param dateRange - the max date for the mission that was select
     * @returns {{isValid: boolean, message: string}}
     */
    const isNotAfter = function (date,dateRange)
    {
        const inputDate = new Date(date);
        const maxDate = new Date(dateRange);
        return  {
            isValid:(inputDate<=maxDate),
            message: `the mission you have selected requires a date before ${dateRange}`
        };
    }
    /**
     *
     * @param date - the input date
     * @param dateRange - the min date for the mission that was select
     * @returns {{isValid: boolean, message: string}}
     */
    const isNotBefore =  function (date,dateRange)
    {
        const inputDate = new Date(date);
        const minDate = new Date(dateRange);

        return  {
            isValid:(inputDate>=minDate),
            message: `the mission you have selected requires a date after ${dateRange}`
        };
    }
    /**
     *
     * @param date - the input sol date
     * @param dateRange - the max max date for the mission that was select
     * @returns {{isValid: boolean, message: string}}
     */
    const isNotAfterSol = function (date,dateRange)
    {
        return  {
            isValid:(date<=dateRange),
            message: `the mission you have selected requires a SOL smaller then ${dateRange}`
        };
    }

    return {
        isNotEmpty: isNotEmpty,
        isSelect :isSelect,
        isGoodDate : isGoodDate,
        isGoodSolDate :isGoodSolDate,
        isNotAfter : isNotAfter,
        isNotAfterSol : isNotAfterSol,
        isNotBefore : isNotBefore,
    }

}) ();
/**
 * to save date range from fatch
 * @type {{}}
 */
const dateModule = (function() {
    let classes = {}
    classes.Date = class Date {
        constructor(landing_date,max_sol,max_date) {
            this.landing_date = landing_date;
            this.max_sol = max_sol;
            this.max_date = max_date;
        }

    }
    /**
     *  tp save list of range date for 3 mission
     * @type {classes.DateList}
     */
    classes.DateList = class {
        constructor() {
            this.list = new Map();
        }

        add(mission,date) {
            this.list.set(mission,date);

        }

        search(what) {
            return this.list.get(what);
        }
    }
    return classes;
})();
const saveImageModule = (function() {
    let classes = {}
    /**
     * class for saving images
     * @type {classes.SaveImageList}
     */
    classes.SaveImageList = class  {
        constructor() {
        }

        /**
         * adding the img informition to the map
         * @param img - the image to save
         */
        add(img) {
            fetch('/api/saveImage', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({img: img}) // body data type must match "Content-Type" header
            })
                .then(function (res) {
                    console.log('res: '+res);
                    res.json().then(function (data) {
                        if (data!=='saved')
                        {
                            let myModal = new bootstrap.Modal(document.getElementById('myModal'));
                            myModal.show();
                        }

                    }).catch(function (err) {
                        console.log(err);
                    });
                }).catch(function (err) {
                console.log(err);
            });
        }

    }
    return classes;
})();
(function() {

    let missionList = new dateModule.DateList();// list for date range
    let saveImage = new saveImageModule.SaveImageList(); // list for image that user saved
    let sol = false;
    /**
     *
     * @param inputElement - the input for validate
     * @param validateFunc - the function from model to do the validate
     * @returns {boolean|*} - if the input is o.k
     */
    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }
    /**
     * the same like function above but with two param for range
     * @param dateInputElement
     * @param dateRange
     * @param validateFunc
     * @returns {boolean|*}
     */
    const validateRange = (dateInputElement, dateRange, validateFunc) => {
        let errorElement = dateInputElement.nextElementSibling; // the error message div
        let v = validateFunc(dateInputElement.value, dateRange); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? dateInputElement.classList.remove("is-invalid") : dateInputElement.classList.add("is-invalid");
        return v.isValid;
    }
    /**
     * takes care on all the validation
     * @param dateElem - date input
     * @param missionElem - mission input
     * @param cameraElem - camera input
     * @returns {*}
     */
    const validateForm = (dateElem, missionElem, cameraElem) => {

        dateElem.value = dateElem.value.trim();
        let dateParts = dateElem.value.split("-");
        if (dateParts.length == 1)
            sol = true
        // display all errors, force checking all fields
        let v1 = validateInput(dateElem, validatorModule.isNotEmpty);
        let v2 = validateInput(missionElem, validatorModule.isSelect);
        let v3 = validateInput(cameraElem, validatorModule.isSelect);
        let v4 = validateInput(dateElem, sol ? validatorModule.isGoodSolDate : validatorModule.isGoodDate);
        let v = v1 && v2 && v3 && v4;

        if (v) {
            if (sol) {
                let v5 = validateRange(dateElem, missionList.search(missionElem.value).max_sol, validatorModule.isNotAfterSol);
                v = v && v5;

            } else if (sol == false) {
                let v5 = validateRange(dateElem, missionList.search(missionElem.value).max_date, validatorModule.isNotAfter);
                if (v5) {
                    let v6 = validateRange(dateElem, missionList.search(missionElem.value).landing_date, validatorModule.isNotBefore);
                    v = v && v6;
                }
                v = v && v5
            }

        }
        return v;
    }

    /* initialize/empty form input*/
    function initForm(dateInput, missionInput, cameraInput) {
        dateInput.value = "";
        missionInput.value = "0";
        cameraInput.value = "0";
        resetErrors();
    }

    const resetErrors = function () {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }
    /**
     *  adding listeners for all buttons
     */
    document.addEventListener('DOMContentLoaded', function () {
        getDate();
        getAllData();
        let imageElem = document.getElementById("imageList");
        let dateInput = document.getElementById("date");
        let missionInput = document.getElementById("mission");
        let cameraInput = document.getElementById("camera");
        document.getElementById('clear').addEventListener('click', function () {
            initForm(dateInput, missionInput, cameraInput);
            imageElem.innerHTML = "";

        });
        document.getElementById('add').addEventListener('click', function () {
            imageElem.innerHTML = "";
            if (validateForm(dateInput, missionInput, cameraInput)) {
                fetchImage(imageElem, dateInput.value, missionInput.value, cameraInput.value);
            }

        });
        document.getElementById('deleteAll').addEventListener('click', function () {
            fetchDeleteAll();

        });
    })

    /**
     *
     * @param response - from fetch
     * @returns {Promise<never>|Promise<unknown>} - if status is ok
     */
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    /**
     * sends 3 mission for fetch date
     */
    function getDate() {
        fetchDate("Curiosity")
        fetchDate("Opportunity")
        fetchDate("Spirit")
    }

    /**
     * fetch for range date if failed send default value
     * @param missionName - for fetch
     */
    function fetchDate(missionName) {
        fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/' + missionName + '?api_key=' + APIKEY)
            .then(status)
            .then(res => res.json())
            .then(json => {
                let missionDate = new dateModule.Date(json.photo_manifest.landing_date, json.photo_manifest.max_sol, json.photo_manifest.max_date);
                missionList.add(missionName, missionDate);
            })
            .catch(function (err) {
                let missionDate = new dateModule.Date('2012-08-06', 3322, '2021-12-10');
                missionList.add("Curiosity", missionDate);
                let missionDate1 = new dateModule.Date('2004-01-25', 5111, '2018-06-11');
                missionList.add("Opportunity", missionDate1);
                let missionDate2 = new dateModule.Date('2004-01-04', 2208, '2010-03-21');
                missionList.add("Spirit", missionDate2);
            })

    }
    function fetchImage(imageElem, dateInput, missionInput, cameraInput) {
        let s = sol ? 'sol' : 'earth_date';
        sol = false;
        let searchGif = document.getElementById("search");
        searchGif.innerHTML = "<img class='img-fluid' src='images/loading-buffering.gif'>";
        fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + missionInput + '/photos?' + s + '=' + dateInput + '&camera=' + cameraInput + '&api_key=' + APIKEY)
            .then(status)
            .then(res => res.json())
            .then(json => {
                let arr = json.photos;
                searchGif.innerHTML = "";
                if (arr.length === 0)
                    imageElem.innerHTML = `<h4 class="bg-primary bg-opacity-25">No images found!</h4>`
                else {
                    imageElem.innerHTML = createSearchList(arr);
                    addListener(arr);
                }

            })
            .catch(function (err) {
                imageElem.innerHTML = `<h4 class="bg-danger bg-opacity-25">Error please refresh the page!</h4>`
            })
    }

    /**
     * Puts the search results of the images into the dom
     * @param arr - the img fetch result
     * @returns {string}
     */
    function createSearchList(arr) {
        let res = "";
        for (const image of arr)
            res += toHtmlCard(image);
        return res;
    }

    function toHtmlCard(img) {
        return `
                <div class="col" >
            <div class="card card-header mt-2 w-75">
                <img class="card-img" src=${img.img_src} >
                  <div class="card-body">
        <p class="card-text">Earth date: ${img.earth_date}<br>Sol: ${img.sol}<br>Camera: ${img.camera.name}<br>Mission: ${img.rover.name}</p>
                    <button type="button" class="btn-save btn btn-info" id="${img.id}">Save</button>
                     <a class ="btn btn-primary " href=${img.img_src} target="_blank" role="button">Full size</a>
                </div>
            </div>
            </div>`;
    }

    const addListener = (imageArr) => {
        let bs = document.getElementsByClassName("btn-save");
        for (let button of bs)
            button.addEventListener('click', function (event) {
                saveImages(imageArr, event.target.id);
            });
    }

    function saveImages(imageArr, id) {
        const imgToSave = imageArr.find(img => img.id == id);
        saveImage.add(imgToSave);
        getAllData();
    }

    const addDeleteListener = () => {
        let bs = document.getElementsByClassName("delete");
        for (let button of bs)
            button.addEventListener('click', function (event) {
                deleteSaveImage(event.target.id);
                getAllData();
            });
    }

    function deleteSaveImage(id) {
        fetch('/api/delete', {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id}) // body data type must match "Content-Type" header
        })
            .then(status)
            .then(function (res) {
                res.json().then(function (data) {
                    if (data !== 'delete')
                    {
                        let myModal = new bootstrap.Modal(document.getElementById('myModal1'));
                        myModal.show();
                    }

                })
                    .catch(function (err) {
                        console.log(err);
                    })
            })
    }
    function getAllData() {
        fetch('/api/getData', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: "devora2040@gmail.com"})
        }).then(status)
            .then(function (res) {
                res.json().then(function (data) {
                        let where = document.getElementById("saveList");
                        document.getElementById("saveList").innerHTML = " ";
                        for (let i = 0; i < data.length; i++) {
                            let k = `<li className="">
                                                <a href="${data[i].url}" className="link-primary" target="_blank">image
                                                    id: ${data[i].imageId}</a>
                                                <p>Earth date: ${data[i].earth_date}, Sol: ${data[i].sol}, camera:
                                                    ${data[i].camera_name}</p>
                    <button type="button" class="delete btn btn-info" id="${data[i].id}">Delete</button>
                                            </li>`;
                            where.insertAdjacentHTML('beforeend', k);
                        }
                     addDeleteListener();
                }) .catch(function (err) {
                });
            }) .catch(function (err) {
        });

    }
    function fetchDeleteAll() {
        fetch('/api/deleteAll', {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // body data type must match "Content-Type" header
        })
            // .then(status)
            .then(function (res) {
                res.json().then(function (data) {
                    if (data!=='delete') {

                            let myModal = new bootstrap.Modal(document.getElementById('myModal1'));
                            myModal.show();
                        }
                    else
                        getAllData();
                })
                    .catch(function (err) {
                    });
            }) .catch(function (err) {
        });
    }

})();
