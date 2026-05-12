using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Precision_Engineering.DAL.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string MessageText { get; set; } = default!;
       
        public DateTime SentAt { get; set; }
    }
}
