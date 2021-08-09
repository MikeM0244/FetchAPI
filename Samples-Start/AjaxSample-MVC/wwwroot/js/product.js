// ********************************
// Global Variable for Product Page
// ********************************
var productController = (function () {
  // ******************************
  // Private Variables
  // ******************************
    let vm = {
        "list": [],
        "mode": "list",
        "options": {
          "apiUrl": "",
          "urlEndpoint": "product",
          "msgTimeout": 0
        },
        "lastStatus": {
          "ok": false,
          "status": 0,
          "statusText": "",
          "url": "",
          "response": null
        }
    };

  // ******************************
  // Private Functions 
  // ******************************
    function get() {
        vm.mode = "list";

        fetch(vm.options.apiUrl + vm.options.urlEndpoint )
            .then(response => processResponse(response))
            .then(data => {
                //fill lastStatus.response with the data returned
                vm.lastStatus.response = data;

                //check if the response was successful
                if ( vm.lastStatus.ok ) {
                    //displayMessage(JSON.stringify(data));
                    vm.list = data;
                    buildList(vm);
                } else {
                    displayError(ajaxCommon.handleError(vm.lastStatus));
                }
            })
            .catch(error => {
                displayError(ajaxCommon.handleAjaxError(error));
            });
    }

    function getEntity(id) {
        vm.mode = "edit";

        fetch(vm.options.apiUrl + vm.options.urlEndpoint + "/" + id)
            .then(response => processResponse(response))
            .then(data => {
                //fill lastStatus.response with the data returned
                vm.lastStatus.response = data;

                //check if the response was successful
                if (vm.lastStatus.ok) {
                    //displayMessage(JSON.stringify(data));
                    vm.lastStatus.response = data;
                    setInput(data);

                    //unhide save/cancel buttons
                    displayButtons();

                    //unhide the detail are
                    displayDetail();
                } else {
                    displayError(ajaxCommon.handleError(vm.lastStatus));
                }
            })
            .catch(error => {
                displayError(ajaxCommon.handleAjaxError(error));
            });
    }

    function setInput(entity) {
        $("#productID").val(entity.productID);
        $("#name").val(entity.name);
        $("#productNumber").val(entity.productNumber);
        $("#color").val(entity.color);
        $("#standardCost").val(entity.standardCost);
        $("#listPrice").val(entity.listPrice);
        $("#sellStartDate").val(entity.sellStartDate);
    }

    function displayButtons() {
        $("#saveButton").removeClass("d-none");
        $("#cancelButton").removeClass("d-none");
    }

    function displayDetail() {
        $("#list").addClass("d-none");
        $("#detail").removeClass("d-none");
    }

    function cancel() {
        $("#detail").addClass("d-none");
        displayMessage("");
        get();
    }

    function add() {
        vm.mode = "add";

        clearInput();
        displayButtons();
        displayDetail();
    }

    function clearInput() {
        let blankEntity = {
            "productID": 0,
            "name": "",
            "productNumber": "",
            "color": "",
            "standardCost": 0,
            "listPrice": 0,
            "sellStartDate": new Date().toLocaleDateString()
        }

        setInput(blankEntity);
    }

    function save() {
        if ( vm.mode==="add" ) {
            insertEntity();
        } else {
            updateEntity();
        }
    }

    function insertEntity() {
        hideButtons();
        displayMessage("Data inserted!");
        setTimeout(() => {
                get();
                displayMessage("");
            }, vm.options.msgTimeout);
    }

    function updateEntity() {
        hideButtons();
        displayMessage("Data updated!");
        setTimeout(() => {
            get();
            displayMessage("");
        }, vm.options.msgTimeout);
    }

    function hideButtons() {
        $("#saveButton").addClass("d-none");
        $("#cancelButton").addClass("d-none");
    }

    function buildList(vm) {
        //get HTML template from the script tag
        let template = $("#dataTmpl").html();

        //call Mustache passing the template and the list
        let html = Mustache.render(template, vm);

        //insert the rendered HTML into the DOM
        $("#products tbody").html(html);

        //display the HTML tableand hide <form> area
        displayList();
    }

    function displayList() {
        $("#list").removeClass("d-none");
        $("#detail").addClass("d-none");
    }

    function processResponse(response) {
        //copy the Response to the lastStatus properties
        vm.lastStatus.ok = response.ok;
        vm.lastStatus.status = response.status;
        vm.lastStatus.statusText = response.statusText;
        vm.lastStatus.url = response.url;

        if ( vm.lastStatus.ok ) {
            return response.json();
        } else {
            return response.text();
        }
    }

    function displayError(msg) {
        if (msg) {
            $('#error').text(msg);
            $('#error').removeClass("d-none");
        } else {
            $('#error').addClass("d-none");
        }

    }

    function displayMessage(msg) {
        if ( msg ) {
            $('#message').text(msg);
            $('#message').removeClass("d-none");
        } else {
            $('#message').addClass("d-none");
        }
    }
  // ******************************
  // Public Functions
  // ******************************
    return {
        "setOptions": function(options) {
            if ( options ) {
                Object.assign(vm.options, options);
            }
        },
        "get": get,
        "getEntity": getEntity,
        "cancel": cancel,
        "add": add,
        "save": save
  };
})();