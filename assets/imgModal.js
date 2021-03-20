var client = ZAFClient.init();
let ticketSidebarClientPromise = client
    .get("instances")
    .then(function (instanceData) {
        let instances = instanceData.instances;
        for (let instanceGUID in instances) {
            if (
                instances[instanceGUID].location === "ticket_sidebar" ||
                instances[instanceGUID].location === "organization_sidebar" ||
                instances[instanceGUID].location === "new_ticket_sidebar" ||
                instances[instanceGUID].location === "user_sidebar"
            ) {
                return client.instance(instanceGUID);
            }
        }
    });
ticketSidebarClientPromise.then(function (ticketSidebarClient) {
    ticketSidebarClient.trigger("modalReady");
});
client.on("modal.close", function () {
    client.invoke("destroy");
});

client.on("sendImgUrl", function (imgObj) {
    let requester_data = {
        url: imgObj.imgSrc,
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
        console.log(imgObj);
        console.log(imgObj.size);
        if (imgObj.size === "height") {
            document.querySelector("img.modalFullImg").style.height = "100vh";
        } else {
            document.querySelector("img.modalFullImg").style = "width: 100%; position: absolute; top: 0; bottom: 0;";
        }
    }
});
