# VolunteerSync Frontend

This is the frontend for the VolunteerSync platform. It is a static HTML/CSS/JS project that provides user interfaces for volunteers, organizations, and administrators to interact with the VolunteerSync backend API.

## Project Structure

```
frontend/
├── index.html                # Landing page
├── login.html                # Login page
├── signup.html               # Signup page
├── user-profile.html         # User profile page
├── user-profiel-edit.html    # Edit profile page
├── project-list.html         # List of volunteer projects
├── project-details.html      # Project detail view
├── assets/                   # Images and icons
├── css/                      # Stylesheets
└── README.md                 # This file
```

## Features

- Responsive static pages for user profile, project browsing, and authentication
- Modern UI with reusable components (header, sidebar, cards)
- Profile page with badges, bio, social links, and contribution history
- Project list and detail pages for browsing and applying to volunteer opportunities
- Notification and search UI elements
- Designed for integration with the VolunteerSync backend API

## How to Use

1. Open any HTML file in your browser (e.g., `user-profile.html`)
2. Customize assets and styles in the `assets/` and `css/` folders
3. Integrate with backend API by adding JavaScript or using the React frontend in `volunteer-sync-react/`

## Development

- No build step required for static HTML/CSS
- For advanced features, use the React app in `../volunteer-sync-react/`
- To serve locally, use any static file server (e.g., `python3 -m http.server`)

## Folder Overview

- `assets/`: Images, icons, and logos
- `css/`: Stylesheets for all pages
- `user-profile.html`: Example of a user profile with badges and contribution history

## Related Projects

- [VolunteerSync Backend](../backend/)
- [VolunteerSync React Frontend](../volunteer-sync-react/)

## License

MIT
