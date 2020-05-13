﻿using RicoCore.Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RicoCore.Data.EF
{
    /// <summary>
    /// Defines a Unit of Work using an EF DbContext under the hood.
    /// </summary>
    public class EFUnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public EFUnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public void Commit()
        {
            _context.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
