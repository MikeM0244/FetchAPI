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
      "response": null
    }
  };

  // ******************************
  // Private Functions 
  // ******************************
  function get() {
    vm.mode = "list";

    fetch(vm.options.apiUrl + vm.options.urlEndpoint)
      .then(response => processResponse(response))
      .then(data => {
        // Fill lastStatus.response
        // with the data returned
        vm.lastStatus.response = data;

        // Check if response was successful
        if (vm.lastStatus.ok) {
          // Assign data to view model's list property
          vm.list = data;
          // Use template to build HTML table
          buildList(vm);
        }
        else {
          displayError(ajaxCommon
            .handleError(vm.lastStatus));
        }
      })
      .catch(error => displayError(
        ajaxCommon.handleAjaxError(error)));
  }

  function getEntity(id) {
    vm.mode = "edit";

    // Retrieve a single entity
    fetch(vm.options.apiUrl + vm.options.urlEndpoint + "/" + id)
      .then(response => processResponse(response))
      .then(data => {
        if (vm.lastStatus.ok) {
          // Display entity
          setInput(data);

          // Unhide Save/Cancel buttons
          displayButtons();

          // Unhide detail area
          displayDetail();
        }
        else {
          displayError(ajaxCommon
            .handleError(vm.lastStatus));
        }
      })
      .catch(error => displayError(
        ajaxCommon.handleAjaxError(error)));
  }

  function insertEntity() {
    let entity = getFromInput();

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entity)
    };

    fetch(vm.options.apiUrl + vm.options.urlEndpoint, options)
      .then(response => processResponse(response))
      .then(data => {
        if (vm.lastStatus.ok) {
          // Hide buttons while 'success message' is displayed
          hideButtons();

          // Display a success message
          displayMessage("Product inserted successfully");

          // Redisplay entity returned from Web API
          setInput(data);

          setTimeout(() => {
            // After a few seconds, redisplay all data
            get();

            // Clear message
            displayMessage("");
          }, vm.options.msgTimeout);
        }
        else {
          displayError(ajaxCommon
            .handleError(vm.lastStatus));
        }
      })
      .catch(error => displayError(
        ajaxCommon.handleAjaxError(error)));
  }

  function updateEntity() {
    let entity = getFromInput();

    let options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entity)
    };

    fetch(vm.options.apiUrl + vm.options.urlEndpoint + "/" + entity.productID, options)
      .then(response => processResponse(response))
      .then(data => {
        if (vm.lastStatus.ok) {
          // Hide buttons while 'success message' is displayed
          hideButtons();

          // Display a success message
          displayMessage("Product updated successfully");

          // Redisplay entity returned from Web API
          setInput(data);

          setTimeout(() => {
            // After a few seconds, redisplay all data
            get();

            // Clear message
            displayMessage("");
          }, vm.options.msgTimeout);
        }
        else {
          displayError(ajaxCommon
            .handleError(vm.lastStatus));
        }
      })
      .catch(error => displayError(
        ajaxCommon.handleAjaxError(error)));
  }

  function deleteEntity(id) {
    if (confirm(`Delete Product ${id}?`)) {
      let options = {
        method: 'DELETE'
      };

      fetch(vm.options.apiUrl + vm.options.urlEndpoint + "/" + id, options)
        .then(response => processResponse(response))
        .then(data => {
          if (vm.lastStatus.ok) {
            // Display success message
            displayMessage("Product deleted successfully");

            // Redisplay all data
            get();

            setTimeout(() => {
              // Clear message
              displayMessage("");
            }, vm.options.msgTimeout);
          }
          else {
            displayError(ajaxCommon
              .handleError(vm.lastStatus));
          }
        })
        .catch(error => displayError(
          ajaxCommon.handleAjaxError(error)));
    }
  }

  function processResponse(resp) {
    // Copy reponse properties to lastStatus properties
    vm.lastStatus.ok = resp.ok;
    vm.lastStatus.status = resp.status;
    vm.lastStatus.statusText = resp.statusText;
    vm.lastStatus.url = resp.url;

    if (vm.lastStatus.ok) {
      return resp.json();
    }
    else {
      return resp.text();
    }
  }

  function buildList(vm) {
    // Get HTML template from <script> tag
    let template = $("#dataTmpl").html();

    // Call Mustache passing in the template and
    // the object with the collection of data
    let html = Mustache.render(template, vm);

    // Insert the rendered HTML into the DOM
    $("#products tbody").html(html);

    // Display HTML table and hide <form> area
    displayList();
  }

  function displayList() {
    $("#list").removeClass("d-none");
    $("#detail").addClass("d-none");
  }

  function displayMessage(msg) {
    if (msg) {
      $("#message").text(msg);
      $("#message").removeClass("d-none");
    }
    else {
      $("#message").addClass("d-none");
    }
  }

  function displayError(msg) {
    if (msg) {
      $("#error").text(msg);
      $("#error").removeClass("d-none");
    }
    else {
      $("#error").addClass("d-none");
    }
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

  function getFromInput() {
    return {
      "productID": $("#productID").val(),
      "name": $("#name").val(),
      "productNumber": $("#productNumber").val(),
      "color": $("#color").val(),
      "standardCost": $("#standardCost").val(),
      "listPrice": $("#listPrice").val(),
      "sellStartDate": new Date($("#sellStartDate").val())
    };
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
    // Hide detail area
    $("#detail").addClass("d-none");
    // Clear any messages
    displayMessage("");
    // Display all data
    get();
  }

  function clearInput() {
    let entity = {
      "productID": 0,
      "name": "",
      "productNumber": "",
      "color": "",
      "standardCost": 0,
      "listPrice": 0,
      "sellStartDate": new Date().toLocaleDateString()
    };

    setInput(entity);
  }

  function add() {
    vm.mode = "add";

    // Display empty entity
    clearInput();

    // Make sure buttons are displayed
    displayButtons();

    // Unhide detail area
    displayDetail();
  }

  function save() {
    // Determine method to call based on the mode property
    if (vm.mode === "add") {
      insertEntity();
    } else if (vm.mode === "edit") {
      updateEntity();
    }
  }

  function hideButtons() {
    $("#saveButton").addClass("d-none");
    $("#cancelButton").addClass("d-none");
  }

  // ******************************
  // Public Functions
  // ******************************
  return {
    "setOptions": function (options) {
      if (options) {
        Object.assign(vm.options, options);
      }
    },
    "get": get,
    "getEntity": getEntity,
    "cancel": cancel,
    "add": add,
    "save": save,
    "deleteEntity": deleteEntity
  };
})();