using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.DAL.Entities
{
    public class Admin
    {
        public int Id { get; set; }
        public string UserName { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;

        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }
}
