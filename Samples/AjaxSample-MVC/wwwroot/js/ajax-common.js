// *****************************************
// Global Variable for Common Ajax Functions
// *****************************************
var ajaxCommon = (function () {
  // ******************************
  // Private Functions
  // ******************************
  function handleAjaxError(error) {
    let msg = appSettings.networkErrorMsg;

    console.error(error + " - " + msg);

    return msg;
  }

  function handleError(lastStatus) {
    let msg = "";

    switch (lastStatus.status) {
      case 400:
        msg = JSON.stringify(lastStatus.response);
        break;
      case 404:
        if (lastStatus.response) {
          msg = lastStatus.response;
        }
        else {
          msg = `${lastStatus.statusText} - ${lastStatus.url}`;
        }
        break;
      case 500:
        msg = JSON.parse(lastStatus.response).message;
        break;
      default:
        msg = JSON.stringify(lastStatus);
        break;
    }

    if (msg) {
      console.error(msg);
    }

    return msg;
  }

  // ******************************
  // Public Functions
  // ******************************
  return {
    "handleAjaxError": handleAjaxError,
    "handleError": handleError
  };
})();