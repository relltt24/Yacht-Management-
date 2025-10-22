# Security Considerations

## Current Implementation

This backend is designed for development and demonstration purposes. The current implementation uses in-memory storage and has basic security features suitable for initial deployment.

## Security Features Implemented

✅ **Input Validation**: All POST/PUT endpoints validate required fields
✅ **Error Handling**: Proper error responses without information leakage
✅ **CORS Support**: Configured for cross-origin requests
✅ **Type Safety**: ID parameters are validated and parsed as integers
✅ **No Hardcoded Secrets**: No credentials in source code

## Production Security Recommendations

### High Priority

1. **Authentication & Authorization**
   ```javascript
   // Add authentication middleware
   import admin from 'firebase-admin';
   
   const authenticate = async (req, res, next) => {
     const token = req.headers.authorization?.split('Bearer ')[1];
     if (!token) return res.status(401).json({ error: 'Unauthorized' });
     
     try {
       const decodedToken = await admin.auth().verifyIdToken(token);
       req.user = decodedToken;
       next();
     } catch (error) {
       res.status(401).json({ error: 'Invalid token' });
     }
   };
   
   // Protect routes
   app.use('/api/*', authenticate);
   ```

2. **Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

3. **Input Sanitization**
   ```javascript
   import helmet from 'helmet';
   import mongoSanitize from 'express-mongo-sanitize';
   
   app.use(helmet());
   app.use(mongoSanitize());
   ```

4. **CORS Restrictions**
   ```javascript
   // Replace wildcard CORS with specific domains
   const allowedOrigins = [
     'https://your-frontend-domain.com',
     'https://your-admin-domain.com'
   ];
   
   app.use(cors({
     origin: (origin, callback) => {
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     }
   }));
   ```

5. **HTTPS Only**
   ```javascript
   // Force HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

### Medium Priority

6. **Request Validation with Schema**
   ```javascript
   import Joi from 'joi';
   
   const yachtSchema = Joi.object({
     name: Joi.string().min(1).max(100).required(),
     type: Joi.string().required(),
     length: Joi.number().positive().required(),
     capacity: Joi.number().integer().positive().required(),
     status: Joi.string().valid('available', 'in-service', 'maintenance')
   });
   
   app.post('/api/yachts', (req, res) => {
     const { error } = yachtSchema.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message });
     // ... rest of handler
   });
   ```

7. **Logging & Monitoring**
   ```javascript
   import winston from 'winston';
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   
   app.use((req, res, next) => {
     logger.info(`${req.method} ${req.url}`, {
       ip: req.ip,
       userAgent: req.get('user-agent')
     });
     next();
   });
   ```

8. **Database Security**
   - Use parameterized queries (when migrating from in-memory storage)
   - Implement proper database user permissions
   - Enable database encryption at rest
   - Use SSL/TLS for database connections

9. **API Key Management**
   ```javascript
   // For external API access
   const apiKeyAuth = (req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (!apiKey || !validApiKeys.has(apiKey)) {
       return res.status(401).json({ error: 'Invalid API key' });
     }
     next();
   };
   ```

### Low Priority (Nice to Have)

10. **API Versioning**
    ```javascript
    // Version your API for backward compatibility
    app.use('/api/v1/yachts', yachtsRouter);
    app.use('/api/v2/yachts', yachtsV2Router);
    ```

11. **Request Size Limits**
    ```javascript
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    ```

12. **Security Headers**
    ```javascript
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));
    ```

## Environment Variables

Store sensitive configuration in environment variables:

```bash
# .env (never commit this file)
DATABASE_URL=your_database_url
API_SECRET_KEY=your_secret_key
FIREBASE_PROJECT_ID=your_project_id
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.com
```

## Security Checklist for Production

- [ ] Implement authentication and authorization
- [ ] Add rate limiting to prevent abuse
- [ ] Restrict CORS to known domains only
- [ ] Enable HTTPS and redirect HTTP traffic
- [ ] Add input validation with schema validation
- [ ] Implement comprehensive logging
- [ ] Use environment variables for configuration
- [ ] Set up database with proper security
- [ ] Add API key management for external access
- [ ] Enable security headers with helmet
- [ ] Set request size limits
- [ ] Implement API versioning
- [ ] Set up monitoring and alerting
- [ ] Conduct security audit
- [ ] Enable automated security scanning
- [ ] Implement backup and disaster recovery
- [ ] Document security procedures

## Vulnerability Reporting

If you discover a security vulnerability, please email security@your-domain.com. Do not open public issues for security vulnerabilities.

## Security Updates

Regularly update dependencies to patch known vulnerabilities:

```bash
npm audit
npm audit fix
```

## Compliance Considerations

Depending on your jurisdiction and use case, consider:

- **GDPR**: If handling EU citizen data
- **CCPA**: If handling California resident data
- **PCI DSS**: If processing payment information
- **SOC 2**: For enterprise customers
- **ISO 27001**: For information security management

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Note**: The current implementation prioritizes functionality and ease of development. Before deploying to production with real user data, implement the security recommendations above.
