# VolunteerSync - Rwanda Volunteer Coordination Platform

VolunteerSync is a comprehensive web application designed to connect passionate volunteers with meaningful opportunities across Rwanda. Built with React and TypeScript, this platform facilitates community engagement and helps build stronger, more resilient communities throughout Rwanda.

## 🌟 Features

### Core Functionality
- **Project Discovery**: Browse volunteer opportunities across Kigali's districts (Gasabo, Kicukiro, Nyarugenge)
- **Interactive Maps**: Google Maps integration showing project locations with detailed markers
- **Smart Filtering**: Filter projects by district, category, and search terms
- **User Profiles**: Comprehensive volunteer profiles with project history and achievements
- **Project Applications**: Apply to volunteer opportunities with status tracking
- **Badge System**: Recognition system for volunteer contributions

### Rwanda-Specific Features
- **Localized Content**: Projects focused on Rwanda's development priorities
- **Geographic Targeting**: Precise location mapping using Kigali coordinates
- **Community Impact**: Track contributions to Rwanda's Vision 2050 goals
- **Skills Development**: Match volunteers with skill-building opportunities

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd volunteer-sync-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Maps API**
   - The Google Maps API key is already configured in the code
   - For production, replace with your own API key in `src/components/ProjectList.tsx`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/
│   ├── Home.tsx              # Landing page with hero section and stats
│   ├── ProjectList.tsx       # Project browser with maps and filters
│   ├── ProjectDetails.tsx    # Detailed project view with tabs
│   └── UserProfile.tsx       # User management and project history
├── data/
│   ├── mockData.ts          # Sample data for development
│   └── rwandaData.ts        # Rwanda-specific geographic data
├── types/
│   └── index.ts             # TypeScript type definitions
├── css/
│   └── style.css            # Preserved original styling
└── App.tsx                  # Main application with routing
```

## 🗺️ Available Routes

- `/` - Home page with project overview and statistics
- `/projects` - Interactive project list with map and filters
- `/project/:id` - Detailed project view with application functionality
- `/profile` - User profile management and project history

## 🎨 Design System

### Colors
- Primary Green: `#40c793` (Rwanda's environmental theme)
- Secondary: `#1dac7a`
- Background: `#f9f9f9`
- Text: `#333`, `#666`

### Typography
- Font Family: Inter, sans-serif
- Responsive design with mobile-first approach

## 📊 Sample Data

The application includes comprehensive mock data featuring:

### Organizations
- **Water for Rwanda**: Clean water initiatives
- **Rwanda ICT Hub**: Digital literacy programs  
- **Green Kigali Initiative**: Environmental projects
- **Community Development Network**: Local community support
- **Rwanda Health Partners**: Healthcare awareness

### Project Categories
- Education & Training
- Environment & Conservation
- Healthcare & Wellness
- Community Development
- Technology & Innovation

### Geographic Coverage
- **Gasabo District**: Remera, Kacyiru sectors
- **Kicukiro District**: Kanombe sector
- **Nyarugenge District**: Kimisagara, Nyamirambo sectors

## 🔧 Technical Implementation

### Key Technologies
- **React 18**: Modern functional components with hooks
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **Google Maps API**: Interactive mapping functionality
- **CSS Modules**: Preserved original styling system

### Notable Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Maps**: Custom markers with project information
- **Search & Filter**: Real-time project filtering
- **State Management**: React hooks for local state
- **Type Safety**: Comprehensive TypeScript interfaces

## 📱 Components Overview

### Home Component
- Hero section with call-to-action
- Statistics dashboard
- Latest projects showcase
- Mission statement and benefits

### ProjectList Component
- Interactive Google Maps integration
- Project filtering by district and category
- Search functionality
- Grid layout with project cards
- Real-time updates

### ProjectDetails Component
- Tabbed interface (Overview, Requirements, Organization)
- Volunteer application system
- Progress tracking
- Contact information

### UserProfile Component
- User information display
- Project history and achievements
- Badge system
- Profile editing capabilities

## 🌐 Google Maps Integration

The application uses Google Maps API to:
- Display project locations on interactive maps
- Show custom markers for each project
- Provide detailed info windows with project data
- Center maps on Kigali coordinates
- Enable location-based project discovery

## 🔄 Data Flow

1. **Mock Data**: Centralized in `src/data/mockData.ts`
2. **Type Safety**: All data structures defined in `src/types/index.ts`
3. **Component State**: Local state management with React hooks
4. **Routing**: React Router for navigation between views

## 🚀 Deployment

### Production Build
```bash
npm run build
```

This creates a `build/` folder with optimized production files.

### Environment Variables
For production deployment, consider setting:
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `REACT_APP_API_URL`: Backend API endpoint (for future integration)

## 🔮 Future Enhancements

### Planned Features
- **Backend Integration**: REST API for data persistence
- **User Authentication**: Login/signup functionality
- **Real-time Notifications**: Project updates and messaging
- **Mobile App**: React Native version
- **Admin Dashboard**: Organization management tools
- **Payment Integration**: For donation processing
- **Social Features**: Volunteer networking and reviews

### Technical Improvements
- **Testing**: Unit and integration tests
- **Performance**: Lazy loading and code splitting
- **PWA**: Progressive Web App capabilities
- **Internationalization**: Multi-language support (Kinyarwanda, French, English)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Original design and assets from the frontend folder
- Google Maps API for location services
- Rwanda government for Vision 2050 inspiration
- Community organizations for project ideas

## 📞 Support

For support and questions:
- Email: info@volunteersync.rw
- Location: Kigali, Rwanda
- Phone: +250 788 123 456

---

**Built with ❤️ for Rwanda's community development**
