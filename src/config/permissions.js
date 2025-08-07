const Permission = require('../api/models/permission.model');

// The original data is kept here for the seed script.
const permissionsData = {
  "permissions": [
    {
      "permissionNumber": "P001",
      "description": "Log in to the system",
      "roles": ["Superuser", "Support Staff", "Admin", "Sacco", "Owner", "Queue Manager", "Driver", "Passenger"],
      "modulePage": "Login Page",
      "httpMethod": "POST",
      "constraints": "MFA required for Superuser/Support Staff; JWT issued"
    },
    {
      "permissionNumber": "P002",
      "description": "Sign up as Support Staff or Admin",
      "roles": ["Support Staff", "Admin"],
      "modulePage": "Sign-Up Page",
      "httpMethod": "POST",
      "constraints": "Initiated by Superuser (for Support Staff) or Admin (for Admins)"
    },
    {
      "permissionNumber": "P003",
      "description": "Register Superuser (one-time)",
      "roles": ["Superuser"],
      "modulePage": "Superuser Registration Page",
      "httpMethod": "POST",
      "constraints": "Requires admin key, MFA setup, IP whitelisting"
    },
    {
      "permissionNumber": "P004",
      "description": "Request password reset OTP",
      "roles": ["Superuser", "Support Staff", "Admin", "Sacco", "Owner", "Queue Manager", "Driver", "Passenger"],
      "modulePage": "Forgot Password Page",
      "httpMethod": "POST",
      "constraints": "Valid email/phone required"
    },
    {
      "permissionNumber": "P005",
      "description": "Reset password with OTP",
      "roles": ["Superuser", "Support Staff", "Admin", "Sacco", "Owner", "Queue Manager", "Driver"],
      "modulePage": "Reset Password Page",
      "httpMethod": "POST",
      "constraints": "Valid OTP required"
    },
    {
      "permissionNumber": "P006",
      "description": "Set up MFA",
      "roles": ["Superuser", "Support Staff"],
      "modulePage": "AuthService",
      "httpMethod": "POST",
      "constraints": "Required for Superuser/Support Staff"
    },
    {
      "permissionNumber": "P007",
      "description": "Verify MFA code",
      "roles": ["Superuser", "Support Staff"],
      "modulePage": "AuthService",
      "httpMethod": "POST",
      "constraints": "Valid TOTP code required"
    },
    {
      "permissionNumber": "P008",
      "description": "Log out of the system",
      "roles": ["Superuser", "Support Staff", "Admin", "Sacco", "Owner", "Queue Manager", "Driver", "Passenger"],
      "modulePage": "Any",
      "httpMethod": "POST",
      "constraints": "Clears JWT from local storage"
    },
    {
      "permissionNumber": "P009",
      "description": "Add Support Staff",
      "roles": ["Superuser"],
      "modulePage": "Support Staff Management Page",
      "httpMethod": "POST",
      "constraints": "NTSA compliance verification required"
    },
    {
      "permissionNumber": "P010",
      "description": "Edit Support Staff details",
      "roles": ["Superuser"],
      "modulePage": "Support Staff Management Page",
      "httpMethod": "PUT",
      "constraints": "Staff ID must exist; cannot modify own role"
    },
    {
      "permissionNumber": "P011",
      "description": "Delete Support Staff",
      "roles": ["Superuser"],
      "modulePage": "Support Staff Management Page",
      "httpMethod": "DELETE",
      "constraints": "Staff must not have active escalations"
    },
    {
      "permissionNumber": "P012",
      "description": "View system metrics (Saccos, trips, revenue, etc.)",
      "roles": ["Superuser"],
      "modulePage": "System Oversight Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P013",
      "description": "Set fare adjustment rules (fuel price, time-based)",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "POST",
      "constraints": "Multiplier must be within defined range (0.5-2.0)"
    },
    {
      "permissionNumber": "P014",
      "description": "Update fare adjustment rules",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "PUT",
      "constraints": "Rule must exist; multiplier range enforced"
    },
    {
      "permissionNumber": "P015",
      "description": "Delete fare adjustment rules",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "DELETE",
      "constraints": "Rule must not be in active use"
    },
    {
      "permissionNumber": "P016",
      "description": "Set system fee structure (10-100 KES)",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "POST",
      "constraints": "Fee must align with fare ranges"
    },
    {
      "permissionNumber": "P017",
      "description": "Update system fee structure",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "PUT",
      "constraints": "Fee must align with fare ranges"
    },
    {
      "permissionNumber": "P018",
      "description": "Delete system fee structure",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "DELETE",
      "constraints": "Cannot delete if active tickets exist"
    },
    {
      "permissionNumber": "P019",
      "description": "Set loyalty point rules (points per KES, redemption thresholds)",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "POST",
      "constraints": "Points per KES must be positive"
    },
    {
      "permissionNumber": "P020",
      "description": "Update loyalty point rules",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "PUT",
      "constraints": "Rule must exist"
    },
    {
      "permissionNumber": "P021",
      "description": "Delete loyalty point rules",
      "roles": ["Superuser"],
      "modulePage": "Policy Management Page",
      "httpMethod": "DELETE",
      "constraints": "No active loyalty transactions"
    },
    {
      "permissionNumber": "P022",
      "description": "View audit logs (all actions)",
      "roles": ["Superuser"],
      "modulePage": "Audit Logs Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P023",
      "description": "Add Sacco",
      "roles": ["Support Staff"],
      "modulePage": "Sacco Management Page",
      "httpMethod": "POST",
      "constraints": "NTSA compliance verification required"
    },
    {
      "permissionNumber": "P024",
      "description": "Edit Sacco details",
      "roles": ["Support Staff"],
      "modulePage": "Sacco Management Page",
      "httpMethod": "PUT",
      "constraints": "Sacco ID must exist"
    },
    {
      "permissionNumber": "P025",
      "description": "Delete Sacco",
      "roles": ["Support Staff"],
      "modulePage": "Sacco Management Page",
      "httpMethod": "DELETE",
      "constraints": "Sacco must have no active trips/vehicles"
    },
    {
      "permissionNumber": "P026",
      "description": "Approve Sacco application",
      "roles": ["Support Staff"],
      "modulePage": "Sacco Management Page",
      "httpMethod": "PUT",
      "constraints": "Sacco must be in pending status"
    },
    {
      "permissionNumber": "P027",
      "description": "Reject Sacco application",
      "roles": ["Support Staff"],
      "modulePage": "Sacco Management Page",
      "httpMethod": "PUT",
      "constraints": "Reason must be provided"
    },
    {
      "permissionNumber": "P028",
      "description": "View real-time trip/bus data",
      "roles": ["Support Staff"],
      "modulePage": "System Monitoring Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P029",
      "description": "View system alerts",
      "roles": ["Support Staff"],
      "modulePage": "System Monitoring Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P030",
      "description": "Handle fare disputes",
      "roles": ["Support Staff"],
      "modulePage": "Inquiry Management Page",
      "httpMethod": "POST",
      "constraints": "Dispute must be open"
    },
    {
      "permissionNumber": "P031",
      "description": "Handle loyalty program inquiries",
      "roles": ["Support Staff"],
      "modulePage": "Inquiry Management Page",
      "httpMethod": "POST",
      "constraints": "Inquiry must be open"
    },
    {
      "permissionNumber": "P032",
      "description": "Assist with driver mechanical issues",
      "roles": ["Support Staff"],
      "modulePage": "Driver Support Page",
      "httpMethod": "POST",
      "constraints": "Valid driver/vehicle ID required"
    },
    {
      "permissionNumber": "P033",
      "description": "Assist with passenger disputes",
      "roles": ["Support Staff"],
      "modulePage": "Driver Support Page",
      "httpMethod": "POST",
      "constraints": "Valid ticket ID required"
    },
    {
      "permissionNumber": "P034",
      "description": "Review ticket reallocations",
      "roles": ["Support Staff"],
      "modulePage": "Cancellation/Reallocation Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P035",
      "description": "Authorize ticket refunds",
      "roles": ["Support Staff"],
      "modulePage": "Cancellation/Reallocation Page",
      "httpMethod": "POST",
      "constraints": "Ticket must be canceled"
    },
    {
      "permissionNumber": "P036",
      "description": "Authorize waitlist reallocations",
      "roles": ["Support Staff"],
      "modulePage": "Cancellation/Reallocation Page",
      "httpMethod": "POST",
      "constraints": "New trip must have available seats"
    },
    {
      "permissionNumber": "P037",
      "description": "Resolve payroll disputes",
      "roles": ["Support Staff"],
      "modulePage": "Payroll Disputes Page",
      "httpMethod": "POST",
      "constraints": "Dispute must be open"
    },
    {
      "permissionNumber": "P038",
      "description": "Generate trip reports",
      "roles": ["Support Staff"],
      "modulePage": "Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P039",
      "description": "Generate fare reports",
      "roles": ["Support Staff"],
      "modulePage": "Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P040",
      "description": "Generate loyalty reports",
      "roles": ["Support Staff"],
      "modulePage": "Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P041",
      "description": "Generate system fee reports",
      "roles": ["Support Staff"],
      "modulePage": "Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P042",
      "description": "Escalate unresolved inquiries",
      "roles": ["Support Staff"],
      "modulePage": "Escalation Page",
      "httpMethod": "POST",
      "constraints": "Inquiry must be open"
    },
    {
      "permissionNumber": "P043",
      "description": "View support staff performance metrics",
      "roles": ["Admin"],
      "modulePage": "Performance Monitoring Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P044",
      "description": "Resolve escalated fare disputes",
      "roles": ["Admin"],
      "modulePage": "Escalation Queue Page",
      "httpMethod": "POST",
      "constraints": "Dispute must be escalated"
    },
    {
      "permissionNumber": "P045",
      "description": "Resolve escalated payroll disputes",
      "roles": ["Admin"],
      "modulePage": "Escalation Queue Page",
      "httpMethod": "POST",
      "constraints": "Dispute must be escalated"
    },
    {
      "permissionNumber": "P046",
      "description": "Generate system-wide trip reports",
      "roles": ["Admin"],
      "modulePage": "System Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P047",
      "description": "Generate system-wide fare reports",
      "roles": ["Admin"],
      "modulePage": "System Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P048",
      "description": "Generate system-wide loyalty reports",
      "roles": ["Admin"],
      "modulePage": "System Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P049",
      "description": "Generate system-wide payroll reports",
      "roles": ["Admin"],
      "modulePage": "System Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P050",
      "description": "Generate system fee reports",
      "roles": ["Admin"],
      "modulePage": "System Reports Page",
      "httpMethod": "GET",
      "constraints": "Date range required"
    },
    {
      "permissionNumber": "P051",
      "description": "Add route",
      "roles": ["Sacco"],
      "modulePage": "Route Management Page",
      "httpMethod": "POST",
      "constraints": "Must comply with Superuser fare rules"
    },
    {
      "permissionNumber": "P052",
      "description": "Edit route",
      "roles": ["Sacco"],
      "modulePage": "Route Management Page",
      "httpMethod": "PUT",
      "constraints": "Route must be in draft status"
    },
    {
      "permissionNumber": "P053",
      "description": "Delete route",
      "roles": ["Sacco"],
      "modulePage": "Route Management Page",
      "httpMethod": "DELETE",
      "constraints": "Route must have no active trips"
    },
    {
      "permissionNumber": "P054",
      "description": "Finalize route",
      "roles": ["Sacco"],
      "modulePage": "Route Management Page",
      "httpMethod": "PUT",
      "constraints": "All stops and fares must be defined"
    },
    {
      "permissionNumber": "P055",
      "description": "Adjust route fare",
      "roles": ["Sacco"],
      "modulePage": "Route Management Page",
      "httpMethod": "POST",
      "constraints": "Must comply with Superuser fare rules"
    },
    {
      "permissionNumber": "P056",
      "description": "Add vehicle",
      "roles": ["Sacco"],
      "modulePage": "Vehicle Management Page",
      "httpMethod": "POST",
      "constraints": "NTSA compliance required; class specified"
    },
    {
      "permissionNumber": "P057",
      "description": "Edit vehicle details",
      "roles": ["Sacco"],
      "modulePage": "Vehicle Management Page",
      "httpMethod": "PUT",
      "constraints": "Vehicle must belong to Sacco"
    },
    {
      "permissionNumber": "P058",
      "description": "Delete vehicle",
      "roles": ["Sacco"],
      "modulePage": "Vehicle Management Page",
      "httpMethod": "DELETE",
      "constraints": "Vehicle must have no active trips"
    },
    {
      "permissionNumber": "P059",
      "description": "Add vehicle to route queue",
      "roles": ["Sacco"],
      "modulePage": "Queue Management Page",
      "httpMethod": "POST",
      "constraints": "Vehicle must be assigned to Sacco"
    },
    {
      "permissionNumber": "P060",
      "description": "Remove vehicle from route queue",
      "roles": ["Sacco"],
      "modulePage": "Queue Management Page",
      "httpMethod": "DELETE",
      "constraints": "Queue entry must exist"
    },
    {
      "permissionNumber": "P061",
      "description": "View queue by registration timestamp",
      "roles": ["Sacco"],
      "modulePage": "Queue Management Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P062",
      "description": "Onboard driver",
      "roles": ["Sacco"],
      "modulePage": "Driver Management Page",
      "httpMethod": "POST",
      "constraints": "NTSA compliance required"
    },
    {
      "permissionNumber": "P063",
      "description": "Assign driver to vehicle",
      "roles": ["Sacco"],
      "modulePage": "Driver Management Page",
      "httpMethod": "PUT",
      "constraints": "Driver and vehicle must belong to Sacco"
    },
    {
      "permissionNumber": "P064",
      "description": "Update driver details",
      "roles": ["Sacco"],
      "modulePage": "Driver Management Page",
      "httpMethod": "PUT",
      "constraints": "Driver must belong to Sacco"
    },
    {
      "permissionNumber": "P065",
      "description": "View driver performance metrics",
      "roles": ["Sacco"],
      "modulePage": "Driver Management Page",
      "httpMethod": "GET",
      "constraints": "Driver must belong to Sacco"
    },
    {
      "permissionNumber": "P066",
      "description": "View trip revenue",
      "roles": ["Sacco"],
      "modulePage": "Revenue Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P067",
      "description": "View system fee deductions",
      "roles": ["Sacco"],
      "modulePage": "Revenue Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P068",
      "description": "View discount impacts",
      "roles": ["Sacco"],
      "modulePage": "Revenue Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P069",
      "description": "View revenue analytics (charts)",
      "roles": ["Sacco"],
      "modulePage": "Revenue Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P070",
      "description": "Create discount",
      "roles": ["Sacco"],
      "modulePage": "Promotions Page",
      "httpMethod": "POST",
      "constraints": "Must comply with Superuser discount limits"
    },
    {
      "permissionNumber": "P071",
      "description": "Edit discount",
      "roles": ["Sacco"],
      "modulePage": "Promotions Page",
      "httpMethod": "PUT",
      "constraints": "Discount must belong to Sacco"
    },
    {
      "permissionNumber": "P072",
      "description": "Delete discount",
      "roles": ["Sacco"],
      "modulePage": "Promotions Page",
      "httpMethod": "DELETE",
      "constraints": "Discount must not be in use"
    },
    {
      "permissionNumber": "P073",
      "description": "Award loyalty points",
      "roles": ["Sacco"],
      "modulePage": "Promotions Page",
      "httpMethod": "POST",
      "constraints": "Must comply with Superuser loyalty rules"
    },
    {
      "permissionNumber": "P074",
      "description": "Set loyalty redemption thresholds",
      "roles": ["Sacco"],
      "modulePage": "Promotions Page",
      "httpMethod": "POST",
      "constraints": "Must comply with Superuser loyalty rules"
    },
    {
      "permissionNumber": "P075",
      "description": "Manage driver contracts",
      "roles": ["Sacco"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "POST",
      "constraints": "Driver must belong to Sacco"
    },
    {
      "permissionNumber": "P076",
      "description": "Manage driver schedules",
      "roles": ["Sacco"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "PUT",
      "constraints": "Driver must belong to Sacco"
    },
    {
      "permissionNumber": "P077",
      "description": "Process payroll post-trip",
      "roles": ["Sacco"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "POST",
      "constraints": "Trip must be completed"
    },
    {
      "permissionNumber": "P078",
      "description": "View payroll history",
      "roles": ["Sacco"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P079",
      "description": "Resolve payroll disputes",
      "roles": ["Sacco"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "POST",
      "constraints": "Dispute must be open"
    },
    {
      "permissionNumber": "P080",
      "description": "View assigned trips",
      "roles": ["Owner"],
      "modulePage": "Trips Page",
      "httpMethod": "GET",
      "constraints": "Trips must belong to owned vehicles"
    },
    {
      "permissionNumber": "P081",
      "description": "View trip cancellations",
      "roles": ["Owner"],
      "modulePage": "Trips Page",
      "httpMethod": "GET",
      "constraints": "Trips must belong to owned vehicles"
    },
    {
      "permissionNumber": "P082",
      "description": "View earnings per trip",
      "roles": ["Owner"],
      "modulePage": "Income Page",
      "httpMethod": "GET",
      "constraints": "Post-system/Sacco/driver fees"
    },
    {
      "permissionNumber": "P083",
      "description": "View payroll history",
      "roles": ["Owner"],
      "modulePage": "Income Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P084",
      "description": "Add bus details",
      "roles": ["Owner"],
      "modulePage": "Vehicle Details Page",
      "httpMethod": "POST",
      "constraints": "NTSA compliance required"
    },
    {
      "permissionNumber": "P085",
      "description": "Edit bus details",
      "roles": ["Owner"],
      "modulePage": "Vehicle Details Page",
      "httpMethod": "PUT",
      "constraints": "Bus must belong to Owner"
    },
    {
      "permissionNumber": "P086",
      "description": "Onboard driver for owned bus",
      "roles": ["Owner"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "POST",
      "constraints": "NTSA compliance required"
    },
    {
      "permissionNumber": "P087",
      "description": "Approve payroll distribution",
      "roles": ["Owner"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "POST",
      "constraints": "Trip must be completed"
    },
    {
      "permissionNumber": "P088",
      "description": "Resolve payroll disputes",
      "roles": ["Owner"],
      "modulePage": "HR/Payroll Page",
      "httpMethod": "POST",
      "constraints": "Dispute must be open"
    },
    {
      "permissionNumber": "P089",
      "description": "Scan QR code tickets",
      "roles": ["Queue Manager"],
      "modulePage": "Ticket Scanning Page",
      "httpMethod": "POST",
      "constraints": "Valid QR code required"
    },
    {
      "permissionNumber": "P090",
      "description": "View passenger details",
      "roles": ["Queue Manager"],
      "modulePage": "Ticket Scanning Page",
      "httpMethod": "GET",
      "constraints": "Ticket must be registered"
    },
    {
      "permissionNumber": "P091",
      "description": "View queue position",
      "roles": ["Queue Manager"],
      "modulePage": "Ticket Scanning Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P092",
      "description": "View class-specific boarding status",
      "roles": ["Queue Manager"],
      "modulePage": "Ticket Scanning Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P093",
      "description": "View boarding stats",
      "roles": ["Queue Manager"],
      "modulePage": "Boarding Stats Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P094",
      "description": "View delay stats",
      "roles": ["Queue Manager"],
      "modulePage": "Boarding Stats Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P095",
      "description": "View class-specific updates",
      "roles": ["Queue Manager"],
      "modulePage": "Boarding Stats Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P096",
      "description": "Register bus for trips",
      "roles": ["Driver"],
      "modulePage": "Trip Registration Page",
      "httpMethod": "POST",
      "constraints": "Bus must be Sacco-assigned; class specified"
    },
    {
      "permissionNumber": "P097",
      "description": "Indicate bus availability",
      "roles": ["Driver"],
      "modulePage": "Trip Registration Page",
      "httpMethod": "PUT",
      "constraints": "Bus must be assigned to Driver"
    },
    {
      "permissionNumber": "P098",
      "description": "Indicate bus condition",
      "roles": ["Driver"],
      "modulePage": "Trip Registration Page",
      "httpMethod": "PUT",
      "constraints": "Bus must be assigned to Driver"
    },
    {
      "permissionNumber": "P099",
      "description": "View trip registrations",
      "roles": ["Driver"],
      "modulePage": "Trip Monitoring Page",
      "httpMethod": "GET",
      "constraints": "Trips must be assigned to Driver"
    },
    {
      "permissionNumber": "P100",
      "description": "View mid-trip passengers",
      "roles": ["Driver"],
      "modulePage": "Trip Monitoring Page",
      "httpMethod": "GET",
      "constraints": "Trip must be active"
    },
    {
      "permissionNumber": "P101",
      "description": "View reassigned passengers",
      "roles": ["Driver"],
      "modulePage": "Trip Monitoring Page",
      "httpMethod": "GET",
      "constraints": "Trip must be active"
    },
    {
      "permissionNumber": "P102",
      "description": "View class-specific trip details",
      "roles": ["Driver"],
      "modulePage": "Trip Monitoring Page",
      "httpMethod": "GET",
      "constraints": "Trip must be assigned to Driver"
    },
    {
      "permissionNumber": "P103",
      "description": "Finalize dynamic route",
      "roles": ["Driver"],
      "modulePage": "Trip Monitoring Page",
      "httpMethod": "PUT",
      "constraints": "Route must be in draft status"
    },
    {
      "permissionNumber": "P104",
      "description": "Scan QR codes for boarding",
      "roles": ["Driver"],
      "modulePage": "Passenger Verification Page",
      "httpMethod": "POST",
      "constraints": "Valid QR code required"
    },
    {
      "permissionNumber": "P105",
      "description": "Scan QR codes for disembarkation",
      "roles": ["Driver"],
      "modulePage": "Passenger Verification Page",
      "httpMethod": "POST",
      "constraints": "Valid QR code required"
    },
    {
      "permissionNumber": "P106",
      "description": "Update seat availability (mid-trip exits)",
      "roles": ["Driver"],
      "modulePage": "Passenger Verification Page",
      "httpMethod": "PUT",
      "constraints": "Trip must be active; class-specific"
    },
    {
      "permissionNumber": "P107",
      "description": "View driver cut per trip",
      "roles": ["Driver"],
      "modulePage": "Earnings Page",
      "httpMethod": "GET",
      "constraints": "Post-system fee"
    },
    {
      "permissionNumber": "P108",
      "description": "View payment history",
      "roles": ["Driver"],
      "modulePage": "Earnings Page",
      "httpMethod": "GET",
      "constraints": "None"
    },
    {
      "permissionNumber": "P109",
      "description": "Submit trip summary",
      "roles": ["Driver"],
      "modulePage": "Trip Completion Page",
      "httpMethod": "POST",
      "constraints": "Trip must be completed"
    },
    {
      "permissionNumber": "P110",
      "description": "Trigger payroll post-trip",
      "roles": ["Driver"],
      "modulePage": "Trip Completion Page",
      "httpMethod": "POST",
      "constraints": "Trip must be completed"
    },
    {
      "permissionNumber": "P111",
      "description": "Update user status (approve, suspend, etc.)",
      "roles": ["Superuser", "Admin"],
      "modulePage": "User Management Page",
      "httpMethod": "PUT",
      "constraints": "None"
    }
  ]
};

/**
 * @description Get all permission numbers for a given role.
 * It first tries to fetch from the database, and if that's empty,
 * it falls back to the local permissionsData object.
 * @param {string} role - The role to get permissions for.
 * @returns {Promise<string[]>} An array of permission numbers.
 */
const getPermissionsForRole = async (role) => {
  const loweredRole = role.toLowerCase();

  // A mapping from the roles in the user model to the roles in the permissions JSON
  const roleMapping = {
    'support staff': 'Support Staff',
    'admin': 'Admin',
    'sacco': 'Sacco',
    'owner': 'Owner',
    'queue manager': 'Queue Manager',
    'driver': 'Driver',
    'passenger': 'Passenger'
  };
  const permissionRole = roleMapping[loweredRole] || role;

  let permissionsFromDb = [];
  try {
    if (loweredRole === 'superuser') {
      permissionsFromDb = await Permission.find({}, 'permissionNumber');
    } else {
      permissionsFromDb = await Permission.find(
        { roles: permissionRole },
        'permissionNumber'
      );
    }
  } catch (error) {
    console.error('Error fetching permissions from database, falling back to local data.', error);
  }


  if (permissionsFromDb.length > 0) {
    return permissionsFromDb.map(p => p.permissionNumber);
  }

  // Fallback to local data if DB is not populated
  if (loweredRole === 'superuser') {
    return permissionsData.permissions.map(p => p.permissionNumber);
  }

  return permissionsData.permissions
    .filter(p => p.roles.includes(permissionRole))
    .map(p => p.permissionNumber);
};

module.exports = {
  permissionsData, // Export for seeding
  getPermissionsForRole,
};
