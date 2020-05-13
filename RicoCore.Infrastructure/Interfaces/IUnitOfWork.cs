﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RicoCore.Infrastructure.Interfaces
{
    /// <summary>
    /// Represents a unit of work
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Commits the changes to the underlying data store. 
        /// </summary>
        void Commit();
        Task CommitAsync();
    }
}
