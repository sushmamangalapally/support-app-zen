$(function () {
    $("#datepicker").datepicker();
    $("#datepicker").on("changeDate", function (e) {
        $("#my_hidden_input").val(
            $("#datepicker").datepicker("getFormattedDate")
        );
        const formattedAPIDate = formatDateforAPI(e.date);
        setAstronomyPicDay(formattedAPIDate);
    });
});

function formatDateforAPI(date) {
    let changedDate = new Date(date.toString());
    let nowDate = new Date();
    const apiDate = nowDate.getTime() < changedDate.getTime() ? nowDate : changedDate;
    const [month, day, year] = [
        apiDate.toLocaleDateString("UTC", { month: 'numeric' }),
        apiDate.toLocaleDateString("UTC", { day: 'numeric' }),
        apiDate.toLocaleDateString("UTC", { year: 'numeric' }),
    ];
    const newDate = year + "-" + month + "-" + day;
    return newDate;
}

function formatDate(date) {
    let cdate = new Date(date);
    let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: 'UTC'
    };
    date = cdate.toLocaleDateString("en-us", options);
    return date;
}

async function setAstronomyPicDay(date = "") {
    try {
        const data = await fetchPlanetPic(date);
        displayPicture(data);
    } catch (e) {
        showError(e);
    }
}

let client = ZAFClient.init();
setAstronomyPicDay();

client.invoke("resize", { width: "100%", height: "620px" });

async function fetchPlanetPic(date) {
    const apiKey = "8tKXFJvk4bzxmNizdRyj62p8ouqTEIo4LCoJO7FP";
    const apiFetchCall = date.length
        ? `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
        : `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    let response = await fetch(apiFetchCall);
    const pictureJSON = await response.json();
    return pictureJSON;
}

function modalPopup() {
    const imgSrc = document.querySelector(".nasa-picture img").src;
    const imgHeight = document.querySelector(".nasa-picture img").height;
    const imgWidth = document.querySelector(".nasa-picture img").width;
    let imgSize = (imgHeight > imgWidth) ? 'height' : 'width';

    let options = {
        location: "modal",
        url: "assets/modal.html",
        size: {
            width: "80vw",
            height: "80vh",
        },
    };
    client.invoke("instances.create", options).then(function (modalContext) {
        let modalClient = client.instance(
            modalContext["instances.create"][0].instanceGuid
        );

        client.on("modalReady", function () {
            modalClient.trigger("sendImgUrl", {'imgSrc': imgSrc, 'size': imgSize});
        });
        modalClient.on("modal.close", function () {
            // The modal has been closed
        });

        client.invoke("resize", { width: "100%", height: "620px" });
    });
}

function displayPicture(data) {
    let requester_data = {
        url: data.url,
        desc: data.title,
        date: formatDate(data.date)
    };

    let source = '';
    const requesterTemplate = document.querySelector('#requester-template');
    if (requesterTemplate) {
        source = requesterTemplate.innerHTML;
    }
    let template = Handlebars.compile(source);
    let html = template(requester_data);
    const content = document.querySelector('#content');
    if (content) {
        content.innerHTML = html;
    }
}

function showError(response) {
    let error_data = {
        status: response.status,
        statusText: response.statusText,
    };
    let source = '';
    const errorTemplate = document.querySelector('#error-template');
    if (errorTemplate) {
        source = errorTemplate.innerHTML;
    }
    let template = Handlebars.compile(source);
    let html = template(error_data);
    const content = document.querySelector('#content');
    if (content) {
        content.innerHTML = html;
    }
}
