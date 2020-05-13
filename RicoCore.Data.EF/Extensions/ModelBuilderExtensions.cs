﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace RicoCore.Data.EF.Extensions
{
    /// <summary>
    ///    this ModelBuilder
    ///    using Microsoft.EntityFrameworkCore;
    ///    
    ///    modelBuilder.Entity<TEntity>(entityConfiguration.Configure);
    ///    public abstract void Configure(EntityTypeBuilder<TEntity> entity);
    ///    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    /// </summary>
    public static class ModelBuilderExtensions
    {
        public static void AddConfiguration<TEntity>(
          this ModelBuilder modelBuilder,
          DbEntityConfiguration<TEntity> entityConfiguration) where TEntity : class
        {
            modelBuilder.Entity<TEntity>(entityConfiguration.Configure);
        }
    }

    public abstract class DbEntityConfiguration<TEntity> where TEntity : class
    {
        public abstract void Configure(EntityTypeBuilder<TEntity> entity);
    }
}
