# TerraTrust - Digital Land Registry Platform

TerraTrust is a modern, Web2-based land registry and management system designed to streamline the process of buying, selling, and managing land property with transparency and security. The platform connects buyers directly with landowners through an intuitive interface, providing specialized dashboards for all stakeholders.

![TerraTrust Banner](https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000)

## 📌 Project Vision

TerraTrust aims to eliminate the complexities of traditional land transactions by providing a centralized digital registry. By using a standard Web2 architecture with a secure relational database, we ensure high performance, reliability, and ease of use for the everyday user.

---

## 🚀 Key Features

### 👤 Buyer Experience

- **Property Discovery**: Search and browse available land parcels with high-quality images and detailed descriptions.
- **Direct Inquiries**: Message landowners directly from the property listing to negotiate or ask questions.
- **Inquiry Tracking**: Keep track of all your ongoing negotiations in a dedicated messaging area.

### 🏡 Landowner Management

- **Digital Portfolio**: Register and manage your land holdings in a secure digital environment.
- **Listing Controls**: Easily list your properties for sale or remove them from the market.
- **Lead Management**: Receive and respond to inquiries from interested buyers in real-time.

### 🛡️ Administrative Oversight

- **System Analytics**: View platform-wide statistics including total users, active listings, and market trends.
- **Registry Monitoring**: Keep a close eye on new land registrations and user activity to ensure platform integrity.
- **User Management**: Oversee owner and buyer accounts for a secure ecosystem.

---

## 🛠 Tech Stack

### Frontend (Next.js)

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS for a premium, responsive design.
- **Icons**: Lucide React for modern, consistent iconography.
- **State Management**: React Context API for authentication and global state.
- **Communication**: Axios for seamless API integration.

### Backend (Node.js)

- **Runtime**: Node.js & Express.
- **Database**: PostgreSQL for robust relational data management.
- **ORM**: Sequelize for efficient database querying and modeling.
- **Security**: JSON Web Tokens (JWT) for secure, stateless authentication.
- **Logging**: Morgan for real-time request monitoring.

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your credentials:
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/terratrust
   JWT_SECRET=your_super_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
TerraTrust/
├── backend/                # Express API
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   ├── models/             # Sequelize schemas
│   ├── routes/             # API endpoints
│   └── index.js            # Server entry point
├── frontend/               # Next.js Application
│   ├── app/                # Pages & Layouts
│   ├── components/         # Reusable UI elements
│   ├── context/            # Auth Management
│   └── utils/              # API helpers
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request or open an issue for any feature requests or bug reports.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
