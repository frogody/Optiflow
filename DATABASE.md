# Database Setup and Management

This document provides instructions for setting up and managing the database for the Optiflow application.

## Database Configuration

The application uses PostgreSQL with Prisma as the ORM. The database is hosted on Neon (https://neon.tech).

### Environment Variables

Required environment variables for database connection:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. The schema includes the following main entities:

- Users
- Organizations
- Workflows
- Workflow Nodes
- Workflow Edges
- Workflow Executions
- Node Executions
- API Keys
- Audit Logs

## Database Management

### Available Scripts

- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio (GUI for database management)
- `npm run db:push` - Push schema changes to the database
- `npm run db:reset` - Reset the database (warning: this will delete all data)

### Creating a New Migration

1. Make changes to the schema in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your-migration-name`
3. Review the generated migration in `prisma/migrations`
4. Commit the changes

### Database Backups

The database is automatically backed up by Neon. You can also create manual backups using:

```bash
pg_dump -h your-host -U your-user -d your-database > backup.sql
```

## Development Workflow

1. Clone the repository
2. Copy `.env.example` to `.env` and update the database URL
3. Run `npm install` to install dependencies
4. Run `npm run db:generate` to generate the Prisma client
5. Run `npm run db:migrate` to apply migrations
6. Start the development server with `npm run dev`

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Verify the database URL in your `.env` file
   - Check if the database is accessible from your network
   - Ensure SSL is properly configured

2. **Migration Failures**
   - Check the migration history in `prisma/migrations`
   - Verify that all migrations are in the correct order
   - If needed, reset the database with `npm run db:reset`

3. **Schema Sync Issues**
   - Run `npm run db:generate` to update the Prisma client
   - Check for any schema conflicts in `prisma/schema.prisma`
   - Verify that all required fields are properly defined

### Getting Help

If you encounter any issues:

1. Check the Prisma documentation: https://www.prisma.io/docs
2. Review the Neon documentation: https://neon.tech/docs
3. Open an issue in the repository
4. Contact the development team

## Security Considerations

1. **Database Access**
   - Use strong passwords
   - Implement IP whitelisting
   - Enable SSL for all connections
   - Use connection pooling in production

2. **Data Protection**
   - Regular backups
   - Encryption at rest
   - Secure connection strings
   - Proper access controls

3. **Audit Logging**
   - All database changes are logged
   - Review audit logs regularly
   - Monitor for suspicious activity

## Performance Optimization

1. **Indexing**
   - Appropriate indexes are defined in the schema
   - Monitor query performance
   - Add indexes as needed

2. **Connection Pooling**
   - Use connection pooling in production
   - Configure pool size based on load
   - Monitor connection usage

3. **Query Optimization**
   - Use Prisma's query optimization features
   - Monitor slow queries
   - Implement caching where appropriate 