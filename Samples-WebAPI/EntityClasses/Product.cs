using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI
{
  [Table("Product", Schema ="SalesLT")]
  public partial class Product
  {
    [Required]
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductID { get; set; }
    [Required(ErrorMessage = "The Product Name is required")]    
    public string Name { get; set; }
    [Required]
    public string ProductNumber { get; set; }
    public string Color { get; set; }
    [Required]
    public decimal StandardCost { get; set; }
    [Required]
    public decimal ListPrice { get; set; }
    public string Size { get; set; }
    public decimal? Weight { get; set; }
    public int? ProductCategoryID { get; set; }
    public int? ProductModelID { get; set; }
    [Required]
    public DateTime SellStartDate { get; set; }
    public DateTime? SellEndDate { get; set; }
    public DateTime? DiscontinuedDate { get; set; }
    [Required]
    public Guid rowguid { get; set; }
    [Required]
    public DateTime ModifiedDate { get; set; }
  }
}
