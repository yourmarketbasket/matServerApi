// Load environment variables first
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const connectDB = require('./loaders/db');
const { encryptionMiddleware } = require('./api/middlewares/encryption.middleware');

// --- Import all routes ---
const authRoutes = require('./api/routes/auth.routes');
const superuserRoutes = require('./api/routes/superuser.routes');
const saccoRoutes = require('./api/routes/sacco.routes');
const routeRoutes = require('./api/routes/route.routes');
const vehicleRoutes = require('./api/routes/vehicle.routes');
const driverRoutes = require('./api/routes/driver.routes');
const tripRoutes = require('./api/routes/trip.routes');
const queueRoutes = require('./api/routes/queue.routes');
const ticketRoutes = require('./api/routes/ticket.routes');
const paymentRoutes = require('./api/routes/payment.routes');
const payrollRoutes = require('./api/routes/payroll.routes');
const reallocationRoutes = require('./api/routes/reallocation.routes');
const supportRoutes = require('./api/routes/support.routes');
const analyticsRoutes = require('./api/routes/analytics.routes');
const discountRoutes = require('./api/routes/discount.routes');
const loyaltyRoutes = require('./api/routes/loyalty.routes');
const permissionRoutes = require('./api/routes/permission.routes');
const userManagementRoutes = require('./api/routes/user.management.routes');
const teamRoutes = require('./api/routes/team.routes');
const supportGroupRoutes = require('./api/routes/supportGroup.routes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Configure this to be more restrictive in production
    methods: ["GET", "POST"]
  }
});

// Middleware to attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- Core Middleware ---
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Set security headers
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Custom Encryption Middleware (globally applied)
// As per spec, all requests/responses are encrypted.
// Note: This would need to be disabled for webhook endpoints like payment confirmation.
// app.use(encryptionMiddleware); // Temporarily disabled

// --- API Routes ---
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/superuser`, superuserRoutes);
app.use(`${apiPrefix}/saccos`, saccoRoutes);
app.use(`${apiPrefix}/routes`, routeRoutes);
app.use(`${apiPrefix}/vehicles`, vehicleRoutes);
app.use(`${apiPrefix}/drivers`, driverRoutes);
app.use(`${apiPrefix}/trips`, tripRoutes);
app.use(`${apiPrefix}/queues`, queueRoutes);
app.use(`${apiPrefix}/tickets`, ticketRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/payroll`, payrollRoutes);
app.use(`${apiPrefix}/reallocations`, reallocationRoutes);
app.use(`${apiPrefix}/support`, supportRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/discounts`, discountRoutes);
app.use(`${apiPrefix}/loyalty`, loyaltyRoutes);
app.use(`${apiPrefix}/permissions`, permissionRoutes);
app.use(`${apiPrefix}/users`, userManagementRoutes);
app.use(`${apiPrefix}/teams`, teamRoutes);
app.use(`${apiPrefix}/support-groups`, supportGroupRoutes);

// --- Temporary Email Test Route ---
const NotificationService = require('./api/services/notification.service');
app.get('/test-email', async (req, res) => {
    try {
        console.log("--- TRIGGERING EMAIL TEST ---");
        await new NotificationService().sendEmail({
            to: 'codethelabs@gmail.com',
            subject: 'Test Email from Safary',
            context: {
                title: 'Hello from Safary!',
                body: 'This is a test email to confirm that the notification service is working correctly.',
            }
        });
        res.json({ success: true, message: 'Test email sent. Check the console and your inbox.' });
    } catch (error) {
        console.error("--- EMAIL TEST FAILED ---", error);
        res.status(500).json({ success: false, message: 'Email test failed.' });
    }
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err);
    // In a real app, you would have more sophisticated error handling
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = config.port || 5000;

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('a user connected');
  // emit user connected
  socket.emit('connected');

  // Example: Listen for a custom event from a client
  socket.on('vehicleLocationUpdate', (data) => {
    console.log('Received location update:', data);
    // Broadcast the update to other clients (e.g., a tracking dashboard)
    socket.broadcast.emit('locationUpdate', data);
  });

  socket.on('disconnect', () => {
    // Emit a real-time event
    io.emit('userDisconnected', { userId: socket.id });
    console.log('user disconnected');
  });
});


server.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
