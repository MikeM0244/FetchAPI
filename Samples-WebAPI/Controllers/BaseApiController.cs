using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace WebAPI.Controllers {
  public class BaseApiController : ControllerBase {
    protected IActionResult HandleException(Exception ex,
      string msg) {
      IActionResult ret;

      // TODO: Publish exceptions here

      // Create new exception with generic message        
      ret = StatusCode(StatusCodes.Status500InternalServerError,
              new Exception(msg));

      return ret;
    }
  }
}
