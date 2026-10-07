// English translations (public website)
const en = {
    nav: {
        home: "Home",
        services: "Services",
        notices: "Notices",
        events: "Events",
        emergency: "Emergency",
        about: "About Us",
    },

    auth: {
        login: "Login",
        register: "Register",
        departmentLogin: "Department Login",
        myDashboard: "My Dashboard",
        adminDashboard: "Admin Dashboard",
        signOut: "Sign Out",
    },

    notifications: {
        title: "Notifications",
        unread_one: "{{count}} unread notification",
        unread_other: "{{count}} unread notifications",
        new: "New",
        empty: "No notifications yet",
        viewAll: "View All Notifications →",
        markAll: "Mark all read",
        close: "Close",
    },

    ai: {
        "greeting": {
            "morning": "Good morning",
            "afternoon": "Good afternoon",
            "evening": "Good evening"
        },
        "greetingName": "{{greeting}}, {{name}}",
        "tagline": "Your Smart City assistant — ask in Nepali or English.",
        "suggestions": "Try asking",
        "copy": "Copy",
        "copied": "Copied",
        "voice": "Speak",
        "listening": "Listening... speak now",
        "voiceError": "Could not hear you. Please type instead.",
        "expand": "Expand",
        "collapse": "Shrink",
        "teaser": "Namaste! Need help?",
        "draftReady": "Ready to submit",
        "quickDesc": {
            "problem": "Describe it, I'll draft a complaint",
            "notices": "Today's updates from offices",
            "emergency": "Police, fire, ambulance",
            "track": "Status of your complaints",
            "departments": "Who handles what, and contacts",
            "events": "Camps, trainings and programs"
        },
        "title": "Smart AI",
        "subtitle": "Ask anything",
        "name": "Smart City Assistant",
        "online": "Online",
        "official": "Portal assistant",
        "welcomeTitle": "Namaste! How can I help?",
        "welcomeText": "Ask about notices, departments, emergency numbers or events. Describe a problem and I will prepare a complaint for you.",
        "placeholder": "Type your question...",
        "send": "Send",
        "thinking": "Looking up information...",
        "clear": "New chat",
        "close": "Close",
        "you": "You",
        "disclaimer": "AI can make mistakes. In an emergency call 100 / 101 / 102.",
        "errors": {
            "generic": "Sorry, something went wrong. Please try again.",
            "rateLimit": "You are sending messages too fast. Please wait a minute.",
            "unavailable": "The AI assistant is not available right now. In an emergency call Police 100, Fire 101, Ambulance 102."
        },
        "quick": {
            "problem": {
                "label": "Report a problem",
                "prompt": "I want to report a problem in my area."
            },
            "notices": {
                "label": "Latest notices",
                "prompt": "What are the latest notices?"
            },
            "emergency": {
                "label": "Emergency numbers",
                "prompt": "What are the emergency phone numbers?"
            },
            "track": {
                "label": "My complaints",
                "prompt": "What is the status of my complaints?"
            },
            "departments": {
                "label": "Departments",
                "prompt": "Which departments are there and how can I contact them?"
            },
            "events": {
                "label": "Upcoming events",
                "prompt": "What events are coming up?"
            }
        },
        "draft": {
            "title": "Complaint draft",
            "department": "Department",
            "priority": "Priority",
            "open": "Open complaint form",
            "login": "Log in to file this complaint",
            "note": "You will mark the location and add photos in the form."
        },
        "pages": {
            "complaint": "File a complaint",
            "my_complaints": "My complaints",
            "emergency": "Emergency page",
            "notices": "View notices",
            "events": "View events",
            "services": "Services",
            "about": "About the portal",
            "login": "Log in",
            "register": "Create account"
        }
    },

    gov: {
        today: "Today",
        emergency: "Emergency",
        language: "Language",
    },

    footer: {
        description:
            "Connecting citizens with municipal services through one digital platform. Access complaints, notices, events, emergency support and more, anytime and anywhere.",
        quickLinks: "Quick Links",
        citizenServices: "Citizen Services",
        contactUs: "Contact Us",
        emergencyHotline: "Emergency Hotline",
        fileComplaint: "File a Complaint",
        emergencyServices: "Emergency Services",
        registerAccount: "Register Account",
        aboutPortal: "About the Portal",
        governmentServices: "Government Services",
        notAvailable: "Not available",
        rights: "All rights reserved.",
        poweredBy: "Powered by Smart City Service Portal.",
        privacy: "Privacy Policy",
        terms: "Terms of Use",
        accessibility: "Accessibility",
    },

    home: {
        badge: "Digital Government Platform",
        title1: "Smart City",
        title2: "Service Portal",
        subtitle:
            "Digital government services for transparent, efficient, and citizen-centric governance. Accessible anytime, from anywhere.",
        explore: "Explore Services",
        fileComplaint: "File Complaint",
        stats: {
            citizens: "Registered Citizens",
            resolved: "Complaints Resolved",
            services: "City Services",
            uptime: "Uptime SLA",
        },
    },

    homeGov: {
        heroGov: {
            slides: [
                { title: "Welcome to the Smart City Service Portal", text: "Notices, complaints, events and emergency help from one place.", cta: "Explore Services", to: "/services" },
                { title: "File and Track Complaints Online", text: "Report problems with photos and location, and follow every step.", cta: "File a Complaint", to: "/complaint" },
                { title: "Emergency Help, 24 Hours", text: "Hotlines, SOS live location and nearby hospitals and police.", cta: "Emergency", to: "/emergency" },
            ],
            prev: "Previous slide",
            next: "Next slide",
            goTo: "Go to slide {{n}}",
            pause: "Pause slideshow",
            play: "Play slideshow",
            latestNotices: "Latest Notices",
            emergencyContacts: "Emergency Contacts",
            police: "Police",
            fire: "Fire",
            ambulance: "Ambulance",
        },
        intro: {
            label: "Introduction",
            readMore: "Read more",
        },
        ticker: "Notices",
        stats: {
            citizens: "Registered Citizens",
            complaints: "Complaints Received",
            resolved: "Complaints Resolved",
            notices: "Published Notices",
        },
        services: {
            label: "Citizen Services",
            title: "Online Services",
            description: "Use municipal services from home, without visiting the office.",
            items: {
                complaint: "File a Complaint",
                track: "Track Complaint",
                notices: "Notices",
                events: "Events",
                sos: "Emergency / SOS",
                government: "Government Services",
            },
        },
        board: {
            noticesLabel: "Notice Board",
            noticesTitle: "Latest Notices",
            viewAll: "View All",
            noNotices: "No notices published yet.",
            eventsLabelUpcoming: "Upcoming",
            eventsLabelRecent: "Recent",
            eventsTitle: "Events",
            noEvents: "No upcoming events.",
            failedEvents: "Failed to load events. Please try again later.",
            dateNA: "Date not available",
            locationNA: "Location not available",
            status: {
                upcoming: "Upcoming",
                ongoing: "Ongoing",
                completed: "Completed",
                cancelled: "Cancelled",
            },
        },
        process: {
            label: "How it works",
            title: "Complaint Process",
            description: "Your complaint goes directly to the responsible department, and you can see every step.",
            steps: [
                { title: "Register / Login", text: "Create a free account with your email or Google." },
                { title: "Submit Complaint", text: "Choose the department, add details, photos and the location on the map." },
                { title: "Department Action", text: "The responsible department reviews and updates the status." },
                { title: "Track & Get Notified", text: "Follow progress in your dashboard and receive notifications." },
            ],
            cta: "File a Complaint",
            track: "Track Your Complaint",
            step: "Step {{n}}",
            badges: ["Free", "24 hours", "No office visit"],
        },
        links: {
            label: "Useful Links",
            title: "Important Government Links",
        },
        cta: {
            title: "Have a concern?",
            highlight: "We are listening.",
            text: "File a complaint, track its progress and get updates. Every issue goes to the responsible department.",
            complaint: "File a Complaint",
            emergency: "Emergency",
        },
    },

    noticeTabs: {
        "notice": "Notices",
        "tender": "Tenders",
        "news": "News",
        "press": "Press Releases",
        "empty": "Nothing published yet."
    },

    officials: {
        "label": "Our Team",
        "title": "Elected Officials & Staff"
    },

    downloads: {
        "navLabel": "Downloads",
        "label": "Documents",
        "title": "Downloads",
        "description": "Acts, regulations, procedures, forms and reports published by the municipality.",
        "all": "All",
        "empty": "No documents uploaded yet.",
        "download": "Download",
        "view": "View",
        "viewAll": "View all downloads",
        "categories": {
            "act": "Acts",
            "regulation": "Regulations",
            "procedure": "Procedures",
            "form": "Forms",
            "report": "Reports",
            "other": "Others"
        }
    },


    legal: {
        "privacy": {
            "badge": "Privacy",
            "title": "Privacy Policy",
            "description": "How this portal collects, uses and protects your personal information.",
            "sections": [
                {
                    "title": "Information we collect",
                    "items": [
                        "Account details: name, email address, phone number and profile photo.",
                        "Complaints: the description, photos and map location you submit.",
                        "SOS: your live location while an SOS is active, and the path you moved during that time.",
                        "Notification token: so that we can send you status updates on your device.",
                        "Your browser stores your login session and language choice on your own device."
                    ]
                },
                {
                    "title": "How we use it",
                    "items": [
                        "To deliver your complaint to the responsible department and inform you of progress.",
                        "To share your SOS location with municipal responders until the emergency is closed.",
                        "To send notices, alerts and updates you asked for.",
                        "We do not sell your information or use it for advertising."
                    ]
                },
                {
                    "title": "Who can see it",
                    "items": [
                        "Complaint details are visible to you, the responsible department and portal administrators.",
                        "SOS location is visible only to you, municipal departments and administrators.",
                        "Information may be shared with authorities when required by law."
                    ]
                },
                {
                    "title": "Storage and security",
                    "items": [
                        "Passwords are stored in encrypted (hashed) form, not as plain text.",
                        "Data and files are stored with cloud service providers, which may have servers outside Nepal.",
                        "Access to department and admin dashboards requires a login."
                    ]
                },
                {
                    "title": "Your choices",
                    "items": [
                        "You can update your profile from your dashboard.",
                        "You can stop an SOS at any time, and location sharing stops immediately.",
                        "You can turn off notifications in your browser settings.",
                        "To correct or delete your information, contact the municipality office."
                    ]
                }
            ]
        },
        "terms": {
            "badge": "Terms",
            "title": "Terms of Use",
            "description": "Rules for using the municipality service portal.",
            "sections": [
                {
                    "title": "Using the portal",
                    "items": [
                        "Provide true and correct information when registering, filing complaints or sending an SOS.",
                        "You are responsible for keeping your password safe.",
                        "One person should use one account."
                    ]
                },
                {
                    "title": "Not allowed",
                    "items": [
                        "False complaints, fake SOS alerts or misleading information.",
                        "Offensive, abusive or illegal content, including in photos.",
                        "Trying to access other people's data or disrupt the portal.",
                        "Misuse may lead to the account being blocked and legal action."
                    ]
                },
                {
                    "title": "Emergencies",
                    "items": [
                        "In a life-threatening emergency, call 100, 101 or 102 first.",
                        "The SOS feature depends on internet and GPS and may not always work."
                    ]
                },
                {
                    "title": "Content and links",
                    "items": [
                        "Notices and information are published by municipal departments.",
                        "Links to other government websites open their own services; this portal is not responsible for them.",
                        "These terms may be updated, and the latest version is always on this page."
                    ]
                }
            ]
        },
        "accessibility": {
            "badge": "Accessibility",
            "title": "Accessibility",
            "description": "We want everyone, including elderly people and people with disabilities, to use this portal easily.",
            "sections": [
                {
                    "title": "Features available",
                    "items": [
                        "Nepali and English language switch.",
                        "Animations stop automatically if \"Reduce motion\" is turned on in your device settings.",
                        "Emergency numbers work as normal phone calls, even without internet.",
                        "Hotline numbers on the Emergency page are available offline after one visit."
                    ]
                },
                {
                    "title": "Keyboard and screen readers",
                    "items": [
                        "Buttons and links can be used with the keyboard (Tab and Enter).",
                        "The page language is set correctly so screen readers read Nepali and English properly."
                    ]
                },
                {
                    "title": "Need help?",
                    "items": [
                        "If any part of the portal is difficult to use, contact the municipality office and we will try to fix it."
                    ]
                }
            ]
        }
    },

    servicesPage: {
        "label": "Available Services",
        "title": "Online Citizen Services",
        "description": "Choose a service to continue. All services on this portal are free and available online 24 hours.",
        "searchPlaceholder": "Search a service...",
        "noResult": "No service matches your search.",
        "filters": {
            "all": "All",
            "citizen": "Citizen Services",
            "info": "Information",
            "emergency": "Emergency"
        },
        "badges": {
            "free": "Free",
            "allDay": "24 hours",
            "login": "Login required",
            "noLogin": "No login needed",
            "external": "Official website"
        },
        "open": "Use Service",
        "items": {
            "complaint": {
                "title": "File a Complaint",
                "text": "Report problems like water, electricity, roads or waste with photos and map location."
            },
            "track": {
                "title": "Track Complaint",
                "text": "See the status of your complaints and the department's response."
            },
            "notices": {
                "title": "Notices & Tenders",
                "text": "Read official notices, tenders, news and press releases."
            },
            "events": {
                "title": "Event Registration",
                "text": "See community programs and register for events online."
            },
            "emergency": {
                "title": "Emergency & SOS",
                "text": "Call hotlines, send SOS with live location and find nearby hospitals and police."
            },
            "downloads": {
                "title": "Downloads",
                "text": "Download acts, regulations, procedures and forms."
            },
            "government": {
                "title": "Government Services",
                "text": "Go to official national services like National ID, passport, driving license and PAN."
            }
        },
        "table": {
            "label": "Service Details",
            "title": "Service Information Table",
            "service": "Service",
            "who": "Who can use",
            "fee": "Fee",
            "time": "Time",
            "how": "How",
            "everyone": "Everyone",
            "registered": "Registered citizens",
            "free": "Free",
            "instant": "Instant",
            "dependsDepartment": "Depends on the department",
            "online": "Online",
            "onlineAndPhone": "Online / Phone",
            "officialSite": "Official website"
        },
        "help": {
            "title": "Need help using a service?",
            "text": "If you have a problem using any service, contact us or report it as a complaint.",
            "call": "Call",
            "complaint": "Report a problem"
        }
    },

    noticesPage: {
        "all": "All",
        "searchPlaceholder": "Search notices by title or description...",
        "allDepartments": "All Departments",
        "reset": "Reset",
        "results_one": "{{count}} notice found",
        "results_other": "{{count}} notices found",
        "empty": "No notices found. Try another search or filter.",
        "failed": "Could not load notices. Please try again later.",
        "urgent": "Urgent",
        "ward": "Ward {{ward}}",
        "pdf": "PDF",
        "image": "Photo",
        "readMore": "Read more",
        "loadMore": "Show more",
        "sidebar": {
            "latest": "Latest Notices",
            "links": "Useful Links",
            "downloads": "Downloads",
            "complaint": "File a Complaint",
            "emergency": "Emergency Contacts"
        }
    },

    noticeDetail: {
        "home": "Home",
        "notices": "Notices",
        "back": "Back to notices",
        "published": "Published",
        "department": "Department",
        "ward": "Ward",
        "publishedBy": "Published by",
        "description": "Details",
        "attachment": "Attachment",
        "pdfTitle": "PDF document",
        "pdfText": "Open the document in a new tab or download it.",
        "imageTitle": "Attached photo",
        "open": "Open",
        "download": "Download",
        "printedOn": "Printed on",
        "contact": "Department Contact",
        "related": "Related Notices",
        "noRelated": "No other notices in this category.",
        "notFoundTitle": "Notice not found",
        "notFoundText": "This notice may have been removed or the link is wrong.",
        "failed": "Could not load the notice. Please try again later."
    },

    eventsPage: {
        "tabs": {
            "all": "All",
            "upcoming": "Upcoming",
            "ongoing": "Ongoing",
            "completed": "Completed",
            "cancelled": "Cancelled"
        },
        "searchPlaceholder": "Search events...",
        "allCategories": "All Categories",
        "reset": "Reset",
        "results_one": "{{count}} event found",
        "results_other": "{{count}} events found",
        "empty": "No events found. Try another search or filter.",
        "failed": "Could not load events. Please try again later.",
        "featured": "Next Event",
        "daysLeft_one": "{{count}} day left",
        "daysLeft_other": "{{count}} days left",
        "today": "Today",
        "happeningNow": "Happening now",
        "registrationOpen": "Registration open",
        "seats": "{{current}}/{{max}} seats",
        "free": "Free entry",
        "viewDetails": "View Details",
        "loadMore": "Show more",
        "locationNA": "Location not available",
        "categories": {
            "Health Camp": "Health Camp",
            "Blood Donation": "Blood Donation",
            "Agriculture": "Agriculture",
            "Training": "Training",
            "Meeting": "Meeting",
            "Festival": "Festival",
            "Sports": "Sports",
            "Education": "Education",
            "Culture": "Culture",
            "Environment": "Environment",
            "Other": "Other"
        }
    },

    eventDetail: {
        "home": "Home",
        "events": "Events",
        "back": "Back to events",
        "about": "About this event",
        "info": "Event Information",
        "date": "Date",
        "time": "Time",
        "venue": "Venue",
        "organizer": "Organizer",
        "contact": "Contact",
        "email": "Email",
        "ward": "Ward {{ward}}",
        "viewMap": "View on map",
        "registration": "Registration",
        "seatsFilled": "{{current}} of {{max}} seats filled",
        "seatsUnlimited": "{{count}} registered",
        "register": "Register Now",
        "registered": "You are registered for this event",
        "full": "Registration full",
        "closed": "Registration closed",
        "cancelled": "This event has been cancelled",
        "notRequired": "No registration needed. Everyone is welcome.",
        "loginToRegister": "Login to register",
        "otherEvents": "Other Events",
        "noOtherEvents": "No other events right now.",
        "notFoundTitle": "Event not found",
        "notFoundText": "This event may have been removed or the link is wrong.",
        "failed": "Could not load the event. Please try again later."
    },

    aboutPage: {
        "introLabel": "Introduction",
        "mission": "Our Mission",
        "missionText": "To deliver fast, transparent and accountable public services to every citizen through one simple digital platform.",
        "vision": "Our Vision",
        "visionText": "A smart, safe and citizen-friendly city where every service and every piece of public information is just a click away.",
        "valuesLabel": "Core Values",
        "valuesTitle": "Principles that guide our work",
        "values": {
            "transparency": {
                "title": "Transparency",
                "text": "Open access to public information, notices and the status of every complaint."
            },
            "citizen": {
                "title": "Citizen First",
                "text": "Services designed around citizens, simple to use in Nepali and English."
            },
            "accountability": {
                "title": "Accountability",
                "text": "Every complaint goes to the responsible department and its progress is visible."
            },
            "access": {
                "title": "Accessibility",
                "text": "Services available 24 hours, on mobile and computer, even offline for emergency numbers."
            }
        },
        "teamLabel": "Project Team",
        "teamTitle": "The team behind this portal",
        "teamText": "This portal was designed and developed by the following team.",
        "roles": {
            "frontendDesign": "Frontend Developer & System Designer",
            "backendAi": "Backend Developer & AI Integration"
        },
        "roleText": {
            "frontendDesign": "Designed the user interface and system flow, and built the screens for citizens, departments and administrators.",
            "backendAi": "Built the server, database and APIs, along with notifications, SOS live tracking and the AI assistant."
        },
        "contactLabel": "Contact",
        "contactTitle": "Get in touch",
        "contactText": "Have a question, suggestion or feedback about the portal? Send us a message.",
        "address": "Address",
        "phone": "Phone",
        "email": "Email",
        "hours": "Office Hours",
        "notAvailable": "Not available",
        "form": {
            "title": "Send a Message",
            "name": "Full name",
            "email": "Email",
            "phone": "Phone (optional)",
            "subject": "Subject",
            "message": "Message",
            "send": "Send Message",
            "sending": "Sending...",
            "success": "Thank you. Your message has been sent.",
            "failed": "Could not send the message. Please try again.",
            "required": "Please fill all required fields.",
            "complaintHint": "To report a problem like water, electricity or roads, please file a complaint instead.",
            "complaintLink": "File a complaint"
        }
    },

    userDash: {
        "nav": {
            "dashboard": "Dashboard",
            "complaints": "My Complaints",
            "notifications": "Notifications",
            "settings": "Profile Settings",
            "newComplaint": "File a Complaint",
            "emergency": "Emergency / SOS"
        },
        "verified": "Citizen Account",
        "welcome": "Namaste, {{name}}",
        "welcomeText": "Track your complaints, read updates and use municipal services from here.",
        "fileComplaint": "File a Complaint",
        "sos": "Emergency / SOS",
        "stats": {
            "total": "Total Complaints",
            "waiting": "Waiting",
            "inProgress": "In Progress",
            "resolved": "Resolved"
        },
        "status": {
            "pending": "Pending",
            "assigned": "Assigned",
            "in-progress": "In Progress",
            "resolved": "Resolved",
            "rejected": "Rejected"
        },
        "priority": {
            "low": "Low",
            "medium": "Medium",
            "high": "High"
        },
        "chartTitle": "Complaint Activity",
        "chartText": "Complaints filed and resolved in the last 6 months.",
        "chartFiled": "Filed",
        "chartResolved": "Resolved",
        "breakdownTitle": "Status Breakdown",
        "resolutionRate": "Resolution rate",
        "recentTitle": "Recent Complaints",
        "viewAll": "View all",
        "noComplaints": "You have not filed any complaint yet.",
        "firstComplaint": "File your first complaint",
        "notificationsTitle": "Latest Updates",
        "noNotifications": "No notifications yet.",
        "quickTitle": "Quick Services",
        "quick": {
            "notices": "Notices",
            "events": "Events",
            "downloads": "Downloads",
            "services": "All Services"
        }
    },

    userPages: {
        "complaints": {
            "title": "My Complaints",
            "text": "View and track every complaint you have filed.",
            "search": "Search by title, ID or department...",
            "all": "All",
            "sortNew": "Newest first",
            "sortOld": "Oldest first",
            "results_one": "{{count}} complaint",
            "results_other": "{{count}} complaints",
            "empty": "No complaints match your search.",
            "none": "You have not filed any complaint yet.",
            "file": "File a Complaint",
            "view": "View details",
            "priority": "Priority",
            "failed": "Could not load your complaints. Please try again."
        },
        "detail": {
            "back": "Back to My Complaints",
            "filedOn": "Filed on",
            "timeline": "Progress",
            "timelineText": "Follow each step of your complaint.",
            "steps": {
                "pending": {
                    "title": "Complaint submitted",
                    "text": "Your complaint has been received."
                },
                "assigned": {
                    "title": "Sent to department",
                    "text": "The complaint has been assigned to the responsible department."
                },
                "in-progress": {
                    "title": "Work in progress",
                    "text": "The department is working on your complaint."
                },
                "resolved": {
                    "title": "Resolved",
                    "text": "Your complaint has been resolved."
                }
            },
            "rejectedTitle": "Complaint rejected",
            "rejectedText": "The department could not accept this complaint.",
            "done": "Done",
            "current": "Current",
            "info": "Complaint Information",
            "department": "Department",
            "priority": "Priority",
            "status": "Status",
            "description": "Description",
            "note": "Department's note",
            "photos": "Photos",
            "noPhotos": "No photos were uploaded.",
            "location": "Location",
            "province": "Province",
            "district": "District",
            "municipality": "Municipality",
            "ward": "Ward",
            "tole": "Tole / Street",
            "openMap": "Open in Google Maps",
            "noMap": "No map location was added.",
            "notFound": "Complaint not found.",
            "failed": "Could not load the complaint. Please try again."
        },
        "notifications": {
            "title": "Notifications",
            "text": "Updates about your complaints, SOS and municipal services.",
            "all": "All",
            "unread": "Unread",
            "markAll": "Mark all as read",
            "markRead": "Mark as read",
            "delete": "Delete",
            "deleted": "Notification deleted.",
            "empty": "No notifications yet.",
            "emptyUnread": "You have read everything.",
            "complaint": "Complaint",
            "department": "Department",
            "note": "Department's note",
            "open": "Open"
        },
        "settings": {
            "title": "Profile Settings",
            "text": "Update your profile and keep your account secure.",
            "profile": "Profile",
            "security": "Security",
            "changePhoto": "Change photo",
            "photoHint": "JPG or PNG, up to 5MB.",
            "name": "Full name",
            "email": "Email",
            "emailHint": "Email cannot be changed.",
            "phone": "Phone number",
            "save": "Save Changes",
            "saving": "Saving...",
            "saved": "Profile updated.",
            "saveFailed": "Could not update the profile.",
            "nameRequired": "Name is required.",
            "passwordTitle": "Change Password",
            "setPasswordTitle": "Set a Password",
            "googleHint": "You signed in with Google. Set a password to also log in with your email.",
            "current": "Current password",
            "newPassword": "New password",
            "confirm": "Confirm new password",
            "changePassword": "Change Password",
            "setPassword": "Set Password",
            "passwordChanged": "Password changed.",
            "passwordFailed": "Could not change the password.",
            "fillAll": "Please fill all password fields.",
            "mismatch": "New passwords do not match.",
            "tooShort": "Password must be at least 6 characters.",
            "show": "Show",
            "hide": "Hide"
        }
    },

    complaintForm: {
        "steps": {
            "citizen": "Your Details",
            "department": "Department",
            "details": "Complaint",
            "location": "Location",
            "review": "Review"
        },
        "stepOf": "Step {{current}} of {{total}}",
        "previous": "Previous",
        "next": "Next",
        "submit": "Submit Complaint",
        "submitting": "Submitting...",
        "submitted": "Complaint submitted successfully.",
        "submitFailed": "Could not submit the complaint. Please try again.",
        "ai": {
            "title": "Filled by AI Assistant",
            "text": "The AI assistant has filled some fields from your chat. Please check them before submitting.",
            "department": "Department",
            "priority": "Priority",
            "location": "Location"
        },
        "help": {
            "title": "Before you file",
            "tips": [
                "Choose the correct department so your complaint reaches the right office.",
                "Add clear photos of the problem (up to 5).",
                "Mark the exact place on the map.",
                "You will get a Complaint ID to track progress."
            ],
            "emergency": "Life-threatening emergency? Call 100 / 101 / 102 instead.",
            "emergencyLink": "Emergency page"
        },
        "validation": {
            "nameRequired": "Please enter your full name.",
            "nameShort": "Full name must be at least 3 characters.",
            "phoneRequired": "Please enter your mobile number.",
            "phoneInvalid": "Please enter a valid Nepali mobile number (98XXXXXXXX).",
            "emailRequired": "Please enter your email.",
            "emailInvalid": "Please enter a valid email address.",
            "department": "Please select a department.",
            "titleRequired": "Please enter a complaint title.",
            "titleShort": "Title must be at least 5 characters.",
            "descriptionRequired": "Please describe the problem.",
            "descriptionShort": "Description must be at least 20 characters.",
            "imageRequired": "Please upload at least one photo.",
            "imageMax": "Maximum 5 photos are allowed.",
            "province": "Please select a province.",
            "district": "Please select a district.",
            "municipality": "Please select a municipality.",
            "ward": "Please enter the ward number.",
            "tole": "Please enter the tole / street.",
            "map": "Please mark the location on the map."
        },
        "citizen": {
            "title": "Your Details",
            "text": "These details come from your account. The department will use them to contact you.",
            "name": "Full name",
            "phone": "Mobile number",
            "phoneHint": "Used for updates about this complaint.",
            "email": "Email",
            "fromAccount": "From your account",
            "privacyTitle": "Privacy",
            "privacyText": "Your details are used only to process this complaint and send you updates. They are not shared with anyone else."
        },
        "department": {
            "areaLabel": "Departments serving",
            "noneInArea": "No department serves this area yet.",
            "noneInAreaHint": "Please check the address, or contact the office by phone. In an emergency, call 100 / 101 / 102.",
            "title": "Select Department",
            "text": "Choose the department responsible for this problem.",
            "loading": "Loading departments...",
            "empty": "No departments available.",
            "selected": "Selected",
            "selectedText": "Your complaint will be sent to {{name}}."
        },
        "details": {
            "title": "Complaint Details",
            "text": "Tell us what the problem is. Clear details help the department act faster.",
            "commonIssues": "Common problems",
            "commonHint": "Tap one to fill the title, or write your own.",
            "subjectLabel": "Subject of complaint",
            "subjectPlaceholder": "e.g. Water pipe burst near the school",
            "descriptionLabel": "Details",
            "descriptionPlaceholder": "What happened, since when, and how it affects people...",
            "minChars": "At least 20 characters",
            "urgencyLabel": "How urgent is it?",
            "urgency": {
                "low": {
                    "title": "Normal",
                    "text": "Can be fixed in routine work"
                },
                "medium": {
                    "title": "Soon",
                    "text": "Causing daily trouble"
                },
                "high": {
                    "title": "Urgent",
                    "text": "Risk to people or property"
                }
            },
            "issues": {
                "water": [
                    "Pipe burst / leakage",
                    "No water supply",
                    "Dirty water",
                    "Low pressure",
                    "Broken tap"
                ],
                "electricity": [
                    "Power cut",
                    "Wire fallen on road",
                    "Street light not working",
                    "Transformer problem",
                    "Electric pole damaged"
                ],
                "road": [
                    "Pothole on road",
                    "Road blocked",
                    "Drain blocked",
                    "Damaged footpath",
                    "Landslide on road"
                ],
                "waste": [
                    "Garbage not collected",
                    "Garbage burning",
                    "Overflowing container",
                    "Dead animal",
                    "Bad smell"
                ],
                "transport": [
                    "Traffic problem",
                    "Illegal parking",
                    "Bus stop problem",
                    "Damaged traffic sign"
                ],
                "other": [
                    "Public property damaged",
                    "Noise pollution",
                    "Encroachment",
                    "Other problem"
                ]
            }
        },
        "photos": {
            "label": "Photos",
            "hint": "Up to 5 photos (JPG, PNG or WEBP, max 5MB each).",
            "drop": "Drag & drop photos here",
            "or": "or",
            "choose": "Choose photos",
            "camera": "Take photo",
            "remove": "Remove photo",
            "count": "{{count}} / 5 photos",
            "invalid": "{{name}} is not a valid image.",
            "tooLarge": "{{name}} is larger than 5MB.",
            "max": "You can add up to 5 photos.",
            "duplicate": "{{name}} is already added."
        },
        "location": {
            "mismatch": "The pin on the map is in a different local level than the one you selected. Please move the pin to the right place or correct the address.",
            "title": "Location of the Problem",
            "text": "Mark the exact place on the map. Use your current location if you are at the spot.",
            "useMy": "Use my current location",
            "locating": "Finding your location...",
            "geoUnsupported": "Location is not supported on this device.",
            "geoDenied": "Please allow location permission.",
            "mapHint": "Click on the map or drag the marker to the exact place.",
            "filling": "Filling the address...",
            "autoFilled": "Address filled from the map. Please check it.",
            "notCovered": "Could not find this address automatically (it may be outside Nepal). Please choose the address manually.",
            "notPinned": "Not marked yet",
            "pinned": "Marked",
            "addressTitle": "Address",
            "province": "Province",
            "district": "District",
            "municipality": "Municipality",
            "ward": "Ward",
            "tole": "Tole / nearby landmark",
            "tolePlaceholder": "e.g. Near Durbar Square, ward office",
            "select": "Select"
        },
        "review": {
            "title": "Review & Submit",
            "text": "Check your complaint carefully before submitting.",
            "edit": "Edit",
            "applicant": "Applicant",
            "complaint": "Complaint",
            "place": "Place",
            "photos": "Photos",
            "urgency": "Urgency",
            "declaration": "I declare that the information given above is true. I understand that a false complaint may lead to action.",
            "declarationRequired": "Please accept the declaration to submit."
        },
        "success": {
            "title": "Complaint registered",
            "text": "Your complaint has been sent to the responsible department.",
            "receipt": "Complaint Registration Receipt",
            "number": "Registration No.",
            "date": "Date",
            "applicant": "Applicant",
            "phone": "Phone",
            "department": "Department",
            "subject": "Subject",
            "place": "Place",
            "status": "Status",
            "statusPending": "Received - waiting for review",
            "scan": "Scan to track",
            "next": "What happens next",
            "steps": [
                "The department reviews your complaint.",
                "You get a notification when the status changes.",
                "Track progress anytime with your Registration No."
            ],
            "keep": "Keep this registration number to track your complaint.",
            "print": "Print receipt",
            "track": "Track complaint",
            "newComplaint": "File another complaint",
            "home": "Go to home",
            "printedNote": "This is a computer-generated receipt."
        }
    },

    deptDash: {
        "portal": "Department Portal",
        "openMenu": "Open menu",
        "closeMenu": "Close menu",
        "menu": {
            "dashboard": "Dashboard",
            "complaints": "Complaints",
            "sos": "SOS Live Tracking",
            "map": "Complaint Map",
            "notices": "Notices",
            "profile": "My Department"
        },
        "logout": "Logout",
        "loggedOut": "Logged out successfully.",
        "logoutFailed": "Logout failed. Please try again.",
        "titles": {
            "home": {
                "title": "Dashboard",
                "text": "Overview of complaints received by your department"
            },
            "complaints": {
                "title": "Complaints",
                "text": "Review complaints and update their status"
            },
            "sos": {
                "title": "SOS Live Tracking",
                "text": "Citizens in emergency share their live location here"
            },
            "map": {
                "title": "Complaint Map",
                "text": "See where complaints are and get directions"
            },
            "notices": {
                "title": "Notices",
                "text": "Publish and manage your department's notices"
            },
            "profile": {
                "title": "My Department",
                "text": "Department details and service area"
            }
        },
        "notifications": {
            "title": "Notifications",
            "unread": "{{count}} unread",
            "empty": "No notifications yet",
            "markAll": "Mark all as read",
            "viewAll": "View all complaints"
        },
        "area": {
            "label": "Service area",
            "all": "All of Nepal",
            "province": "Whole {{province}}",
            "district": "Whole {{district}} district",
            "municipalities": "{{district}}: {{list}}"
        },
        "home": {
            "greeting": "Namaste",
            "welcome": "Welcome, {{name}}",
            "welcomeText": "Here is today's summary of complaints from your service area.",
            "stats": {
                "total": "Total complaints",
                "pending": "Waiting for review",
                "working": "Work in progress",
                "resolved": "Resolved",
                "rejected": "Rejected"
            },
            "resolutionRate": "Resolution rate",
            "avgTime": "Average resolution time",
            "days": "{{count}} days",
            "noData": "No data yet",
            "chartTitle": "Monthly complaints",
            "chartText": "Complaints received and resolved in the last 12 months",
            "received": "Received",
            "resolved": "Resolved",
            "statusTitle": "By status",
            "priorityTitle": "By priority",
            "attentionTitle": "Needs attention",
            "attentionText": "High priority or long-waiting complaints",
            "attentionEmpty": "Nothing urgent. Good work!",
            "waiting": "Waiting {{count}} days",
            "waitingToday": "Received today",
            "recentTitle": "Recent complaints",
            "recentText": "Latest complaints received by your department",
            "viewAll": "View all",
            "noComplaints": "No complaints received yet.",
            "quickTitle": "Quick actions",
            "quick": {
                "complaints": "Review complaints",
                "map": "Open complaint map",
                "notice": "Publish a notice",
                "sos": "SOS live tracking"
            }
        },
        "complaints": {
            "search": "Search by registration no., subject, citizen or place...",
            "all": "All",
            "allPriority": "All priorities",
            "sort": {
                "newest": "Newest first",
                "oldest": "Oldest first",
                "priority": "High priority first"
            },
            "count": "Complaints: {{count}}",
            "empty": "No complaints received yet.",
            "emptyFilter": "No complaints match your search or filter.",
            "clear": "Clear filters",
            "cols": {
                "id": "Reg. No.",
                "citizen": "Citizen",
                "subject": "Subject",
                "place": "Place",
                "priority": "Priority",
                "status": "Status",
                "date": "Date",
                "action": "Action"
            },
            "view": "View",
            "unknownUser": "Unknown citizen"
        },
        "view": {
            "title": "Complaint details",
            "citizen": "Citizen",
            "call": "Call",
            "email": "Email",
            "place": "Place of the problem",
            "ward": "Ward {{ward}}",
            "directions": "Get directions",
            "noLocation": "Location was not marked on the map.",
            "complaint": "Complaint",
            "subject": "Subject",
            "description": "Details",
            "photos": "Photos ({{count}})",
            "timeline": "Timeline",
            "submitted": "Complaint registered",
            "updated": "Last updated",
            "resolvedAt": "Resolved",
            "note": "Note sent to citizen",
            "updateTitle": "Update status",
            "updateText": "The citizen gets a notification when the status changes.",
            "noteLabel": "Resolution / rejection note",
            "notePlaceholder": "Write what was done, or why the complaint was rejected...",
            "noteRequired": "A note is required to resolve or reject a complaint.",
            "save": "Save status",
            "saving": "Saving...",
            "saved": "Complaint status updated.",
            "failed": "Could not update the status.",
            "unchanged": "Choose a different status to save.",
            "close": "Close"
        },
        "map": {
            "listTitle": "Complaints",
            "listText": "Select a complaint to find it on the map.",
            "mapTitle": "Map",
            "showing": "{{count}} on map",
            "noLocation": "No map location",
            "empty": "No complaints with a location."
        },
        "notices": {
            "add": "New notice",
            "createTitle": "Publish a notice",
            "editTitle": "Edit notice",
            "empty": "No notices yet",
            "emptyText": "Notices you publish appear on the public Notices page.",
            "search": "Search notices...",
            "all": "All",
            "active": "Active",
            "archived": "Archived",
            "view": "View",
            "edit": "Edit",
            "delete": "Delete",
            "deleteConfirm": "Delete this notice? This cannot be undone.",
            "deleted": "Notice deleted.",
            "created": "Notice published.",
            "updated": "Notice updated.",
            "failed": "Could not save the notice.",
            "openAttachment": "Open attachment",
            "noAttachment": "No attachment",
            "form": {
                "title": "Title",
                "titlePlaceholder": "e.g. Water supply will be closed on Saturday",
                "description": "Details",
                "descriptionPlaceholder": "Write the full notice...",
                "type": "Type",
                "priority": "Priority",
                "status": "Status",
                "district": "District",
                "municipality": "Local level",
                "ward": "Ward",
                "allWards": "All wards",
                "select": "Select",
                "attachment": "Attachment (image or PDF)",
                "attachmentHint": "JPG, PNG, WEBP or PDF",
                "replaceHint": "Choose a file only to replace the current attachment.",
                "cancel": "Cancel",
                "save": "Save changes",
                "create": "Publish",
                "saving": "Saving..."
            }
        },
        "sos": {
            "live": "Updates every 10 seconds",
            "waiting": "Waiting",
            "responding": "Responding",
            "resolved": "Resolved",
            "cancelled": "Cancelled",
            "open": "Open SOS",
            "history": "History",
            "emptyOpen": "No active SOS right now.",
            "emptyHistory": "No SOS history yet.",
            "citizen": "Citizen",
            "sent": "Sent {{time}}",
            "lastLocation": "Last location {{time}}",
            "accuracy": "±{{meters}} m",
            "note": "Note: {{note}}",
            "directions": "Directions",
            "respond": "Respond",
            "resolve": "Resolve",
            "newSos": "New SOS: {{name}} ({{type}})",
            "sessionExpired": "Session expired. Please login again.",
            "respondingDone": "Marked as responding. The citizen has been notified.",
            "resolvedDone": "SOS resolved.",
            "updateFailed": "Update failed.",
            "notePrompt": "Resolution note (optional):",
            "mute": "Mute alert sound",
            "unmute": "Turn on alert sound"
        },
        "profile": {
            "details": "Department details",
            "name": "Name",
            "email": "Email",
            "phone": "Phone",
            "address": "Office address",
            "description": "About",
            "areaText": "Citizens from this area can send complaints to your department.",
            "localLevels": "Local levels",
            "contactAdmin": "To change these details, the service area or the password, please contact the portal administrator."
        }
    },
    adminDash: {
        "portal": "Admin Portal",
        "role": "Administrator",
        "openMenu": "Open menu",
        "closeMenu": "Close menu",
        "groups": {
            "overview": "Overview",
            "services": "Services",
            "content": "Content",
            "system": "System"
        },
        "menu": {
            "dashboard": "Dashboard",
            "complaints": "Complaints",
            "departments": "Departments",
            "emergency": "Emergency Services",
            "sos": "SOS Live Tracking",
            "notices": "Notices",
            "events": "Events",
            "registrations": "Event Registrations",
            "homeContent": "Home Content",
            "messages": "Messages",
            "users": "Users",
            "settings": "Portal Settings",
            "website": "View website"
        },
        "logout": "Logout",
        "home": {
            "greeting": "Namaste",
            "welcome": "Welcome, {{name}}",
            "welcomeText": "Here is today's overview of the whole portal.",
            "activeSos": "{{count}} active SOS",
            "noSos": "No active SOS",
            "unread": "{{count}} unread messages",
            "noUnread": "No new messages",
            "stats": {
                "total": "Total complaints",
                "pending": "Waiting for review",
                "working": "Work in progress",
                "resolved": "Resolved",
                "users": "Citizens",
                "departments": "Departments",
                "notices": "Notices",
                "upcoming": "Upcoming events"
            },
            "chartTitle": "Monthly complaints",
            "chartText": "Complaints received and resolved in the last 12 months",
            "statusTitle": "By status",
            "resolutionRate": "Resolution rate",
            "deptTitle": "Department performance",
            "deptText": "Complaints handled by each department",
            "deptCols": {
                "department": "Department",
                "total": "Total",
                "open": "Open",
                "resolved": "Resolved",
                "rate": "Rate"
            },
            "noDepartment": "No department",
            "attentionTitle": "Needs attention",
            "attentionText": "High priority or waiting more than 3 days",
            "attentionEmpty": "Nothing urgent right now.",
            "recentTitle": "Recent complaints",
            "viewAll": "View all",
            "noComplaints": "No complaints yet.",
            "quickTitle": "Quick actions",
            "quick": {
                "complaints": "Review complaints",
                "department": "Add department",
                "notice": "Publish notice",
                "event": "Add event",
                "emergency": "Emergency services",
                "settings": "Portal settings"
            }
        }
    },
    hero: {
        about: {
            badge: "About Us",
            title: "Transforming Public Services for a Better Tomorrow",
            description:
                "The Smart City Information Portal is the digital gateway that connects citizens with their municipality. Our mission is to provide transparent, efficient, and citizen-centric services by offering easy access to notices, complaints, departments, emergency contacts, and community events, all through a single, user-friendly platform.",
        },
        services: {
            badge: "Smart City Portal",
            title: "Smart City Services",
            description:
                "Access essential municipal and government services from one platform. Fast, transparent, and designed to make public services easier for every citizen.",
        },
        government: {
            badge: "Government Services",
            title: "Government Services Portal",
            description:
                "Access official government services from one place. Select a service and continue securely to the official government website.",
        },
        notices: {
            badge: "Smart City Service Portal",
            title: "City Notices & Public Announcements",
            description:
                "Stay informed with official notices, emergency alerts, maintenance updates, public events, and important announcements published by municipal departments.",
            explore: "Explore Notices",
            latest: "Latest Updates",
        },
        events: {
            badge: "Community Events",
            title: "Community Events",
            description:
                "Discover upcoming health camps, blood donation drives, festivals, sports, training programs, and other community activities happening across your municipality.",
        },
        complaint: {
            badge: "Complaint Services",
            title: "Complaint & Feedback System",
            description:
                "File, track and manage your city complaints with full transparency and real-time status updates.",
        },
        emergency: {
            badge: "Emergency Services • 24/7 Available",
            title: "Emergency Response Center",
            description:
                "Get immediate assistance during emergencies. Quickly contact police, ambulance, fire brigade, hospitals and municipality emergency departments anytime.",
        },
    },

    emergency: {
        searchPlaceholder: "Search police, ambulance, fire...",
        callPolice: "Call Police (100)",
        ambulance: "Ambulance (102)",
        findNearby: "Find Nearby",
        liveAlerts: "Live Alerts",
        noLiveAlerts: "No active alerts at the moment.",
        safetyGuideLink: "Safety guide →",
        searchResults: "Search Results",
        searching: "Searching...",
        closeResults: "Close results",
        noSearchResult: "No emergency service found. Try police, fire or ambulance.",
        searchFailed: "Could not search right now. Please call 100 directly.",

        offline: {
            title: "You are offline.",
            text: "Hotline numbers below still work, phone calls do not need internet. Department contacts and alerts show the last saved data.",
        },

        report: {
            title: "Not life-threatening?",
            text: "Report issues like broken water pipes, power cuts, fallen trees or blocked roads to the municipality and track the response.",
            button: "Report an Issue",
        },

        sos: {
            label: "SOS Live Tracking",
            guestTitle: "Send an SOS with your live location",
            guestText:
                "Logged-in citizens can press SOS to share their live location with municipal responders. In a life-threatening emergency, call first.",
            loginToUse: "Login to use SOS",
            call100: "Call 100",
            readyTitle: "Need help now? Press SOS",
            readyText:
                "Your live location will be shared with municipal responders until the emergency is resolved. Use only for real emergencies.",
            tapToSend: "Tap to send",
            sending: "Sending...",
            messagePlaceholder: "Short message (optional) e.g. 2 people injured",
            sharingTitle: "Sharing your live location",
            helpOnWay: "Help is on the way.",
            isResponding: "{{name}} is responding. Stay where you are if it is safe.",
            waiting:
                "SOS sent. Waiting for a responder to accept. If it is life-threatening, call 100 or 102 now.",
            keepOpen: "Keep this page open and your GPS on. Location updates every 10 seconds.",
            accuracy: "Accuracy: about {{meters}} m.",
            share: "Share",
            copy: "Copy",
            maps: "Maps",
            stop: "I am safe, stop SOS",
            stopConfirm: "Stop sharing your location and close this SOS?",
            stopped: "SOS stopped. We are glad you are safe.",
            closedByResponder: "Your SOS has been closed by the responder. Stay safe.",
            sent: "SOS sent. Your live location is being shared with responders.",
            helpToast: "Help is on the way: {{name}}",
            failed: "Could not send SOS. Please call 100 directly.",
            locationLost: "Location lost. Please keep location (GPS) turned on.",
            geoUnsupported: "Location is not supported on this device.",
            geoPermission: "Please allow location permission.",
            copied: "Location copied.",
            copyFailed: "Could not copy the location.",
            shareTitle: "My emergency location",
            shareText: "EMERGENCY - I need help. My location: {{link}}",
            types: {
                medical: "Medical",
                fire: "Fire",
                police: "Crime / Police",
                accident: "Accident",
                disaster: "Flood / Earthquake",
                other: "Other",
            },
        },

        contacts: {
            label: "24/7 Toll-Free",
            title: "National Emergency Hotlines",
            description:
                "Call the right service immediately during critical situations. All numbers are free and work from any mobile or landline in Nepal.",
            departmentsTitle: "Municipality Departments",
            departmentsText:
                "For service disruptions such as water supply or power outage, contact the responsible department.",
            noDepartments: "No department contacts available.",
            phoneNotAvailable: "Phone not available",
            call: "Call",
            hotlines: {
                police: "Nepal Police",
                fire: "Fire Brigade",
                ambulance: "Ambulance",
                traffic: "Traffic Police",
                child: "Child Helpline",
                tourist: "Tourist Police",
                women: "Women Helpline",
            },
        },

        alerts: {
            label: "Latest Alerts",
            title: "Emergency Alerts",
            description:
                "Urgent announcements issued by municipal departments, such as service disruptions, safety warnings and disaster updates.",
            emptyTitle: "No active emergency alerts",
            emptyText: "There are no urgent announcements at the moment.",
            ward: "Ward {{ward}}",
            readMore: "Read more",
        },

        nearby: {
            "searching": "Finding services near you...",
            "found": "{{count}} services within {{km}} km",
            "osmBadge": "Map data",
            "osmNote": "Places near you come from OpenStreetMap. Their phone numbers may be outdated; in an emergency call the national number.",
            "osmFailed": "Could not load more places near you. Showing saved services only.",
            "showAll": "Show all saved services",
            "all": "All",
            "nearMe": "Nearest to me",
            "locating": "Finding your location...",
            "denied": "Allow location access to see the nearest services.",
            "sorted": "Sorted by distance from you",
            "km": "{{km}} km",
            "you": "You are here",
            "empty": "No emergency services found.",
            "count": "{{count}} services",
            label: "Nearby Services",
            title: "Emergency Service Locations",
            description:
                "Find hospitals, police stations and fire brigades near you. Select a location to view it on the map or get directions.",
            open247: "Open 24/7",
            directions: "Directions",
            getDirections: "Get directions →",
            types: {
                "clinic": "Health facility",
                "pharmacy": "Pharmacy",
                hospital: "Hospital",
                police: "Police Station",
                fire: "Fire Station",
                ambulance: "Ambulance",
                traffic: "Traffic Police",
                other: "Emergency Service",
            },
        },

        guide: {
            label: "Be Prepared",
            title: "Disaster Safety Guide",
            description: "Simple steps every family should know before, during and after an emergency.",
            phases: {
                Before: "Before",
                During: "During",
                After: "After",
            },
            tabs: {
                earthquake: "Earthquake",
                flood: "Flood & Landslide",
                fire: "Fire",
                medical: "Medical Emergency",
            },
            steps: {
                earthquake: {
                    Before: [
                        "Fix heavy furniture, shelves and gas cylinders to the wall.",
                        "Prepare an emergency bag: water, dry food, torch, radio, first-aid kit, medicines and copies of documents.",
                        "Identify open spaces near your home and agree on a family meeting point.",
                    ],
                    During: [
                        "DROP, COVER and HOLD ON under a sturdy table, away from windows.",
                        "If outdoors, move to an open area away from buildings, trees and electric poles.",
                        "Do not use lifts or run down stairs while the ground is shaking.",
                    ],
                    After: [
                        "Expect aftershocks. Leave damaged buildings carefully.",
                        "Turn off gas and electricity if you suspect a leak or damage.",
                        "Use SMS instead of calls so emergency lines stay free.",
                    ],
                },
                flood: {
                    Before: [
                        "Follow weather and flood warnings from the municipality and DHM.",
                        "Keep important documents and valuables in waterproof bags at a high place.",
                        "Know the route to higher ground or the nearest safe shelter.",
                    ],
                    During: [
                        "Move to higher ground immediately. Do not wait for water to rise.",
                        "Never walk or drive through flowing water.",
                        "Stay away from riverbanks and steep slopes during heavy rain.",
                    ],
                    After: [
                        "Return home only when authorities say it is safe.",
                        "Drink only boiled or treated water.",
                        "Avoid contact with flood water and damaged electrical lines.",
                    ],
                },
                fire: {
                    Before: [
                        "Keep a fire extinguisher at home and learn how to use it.",
                        "Check gas cylinder pipes and regulators regularly for leaks.",
                        "Never leave cooking fires or candles unattended.",
                    ],
                    During: [
                        "Call 101 immediately and alert people nearby.",
                        "Stay low under the smoke and leave the building quickly.",
                        "If your clothes catch fire: STOP, DROP and ROLL.",
                    ],
                    After: [
                        "Do not re-enter the building until firefighters say it is safe.",
                        "Seek medical help for burns or smoke inhalation.",
                        "Contact the ward office for relief and damage assessment.",
                    ],
                },
                medical: {
                    Before: [
                        "Save emergency numbers and the nearest hospital in your phone.",
                        "Keep a basic first-aid kit and a list of family members' medicines and allergies.",
                        "Learn basic first aid and CPR if possible.",
                    ],
                    During: [
                        "Call 102 for an ambulance and clearly explain the location and condition.",
                        "Check breathing. Do not move a person with a possible neck or back injury.",
                        "Apply firm pressure on bleeding wounds with a clean cloth.",
                    ],
                    After: [
                        "Keep the patient's documents and medicine list ready for the hospital.",
                        "Follow up with the health post or hospital as advised.",
                    ],
                },
            },
        },
    },
};

export default en;
