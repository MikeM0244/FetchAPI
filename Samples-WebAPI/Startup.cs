using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Text.Json;

namespace WebAPI
{
    public class Startup {
    public Startup(IConfiguration configuration) {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {
      // Tell this project to allow CORS
      services.AddCors();

      // Convert JSON from Camel Case to Pascal Case
      services.AddControllers().AddJsonOptions(options => {
        // Use the default property (Pascal) casing.
        options.JsonSerializerOptions.PropertyNamingPolicy =
          JsonNamingPolicy.CamelCase;
      });

      // Setup the AdventureWorks DB Context
      // Read in the connection string from the appSettings.json file
      services.AddDbContext<AdventureWorksLTDbContext>(options =>
                options.UseSqlServer(
        Configuration.GetConnectionString("DefaultConnection")));

      services.AddControllers();
      services.AddSwaggerGen(c => {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPI", Version = "v1" });
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPI v1"));
      }

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseAuthorization();

      app.UseCors(options =>
             options.WithOrigins("http://localhost:5000", "http://localhost:3000")
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod()  //get, post, put, delete, etc...
        );

      app.UseEndpoints(endpoints => {
        endpoints.MapControllers();
      });
    }
  }
}
