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

client.on("sendImgUrl", function (sentUrl) {
    let requester_data = {
        url: sentUrl,
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
});
