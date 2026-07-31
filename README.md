# NagarSeva: Civic Trust & Grievance Routing System

NagarSeva is a modern civic engagement and grievance routing platform designed to bridge the gap between citizens and municipal authorities. By leveraging AI-assisted classification and geo-spatial tracking, NagarSeva simplifies report filing, transparently routes issues to responsible departments, and displays real-time statistics of local municipal wards.

---

## 🚀 Key Features

*   **Smart Grievance Reporting**: Interactive report filing with photo previews, category selection, and automated severity assessments.
*   **AI-Assisted Classification**: Integrates Gemini API to automatically classify grievances and generate helpful routing suggestions for municipal action.
*   **Geo-spatial Mapping**: Uses Leaflet maps to mark, visualize, and cluster reported issues geographically for municipal field workers.
*   **Ward Analytics & Scorecard**: A dynamic dashboard highlighting ward-wise cleanliness scores, safety ratings, issue resolution rates, and average response times.
*   **Citizen Profile Management**: Access details, update verification status, or check ward assignments.
*   **Civic Support Center**: Live ticket logging and interactive FAQ section for citizen queries.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js (App Router)
*   **Language**: JavaScript / React
*   **Styling**: Tailwind CSS
*   **Database**: SQLite (`better-sqlite3`) with WAL journal mode
*   **Geo-mapping**: Leaflet
*   **Charts**: Chart.js & `react-chartjs-2`
*   **AI Integration**: Google Generative AI (Gemini SDK)

---

## 📂 Project Structure

```text
nagarseva/
├── app/                  # Next.js App Router Pages
│   ├── api/              # API Routes (Grievance classification, stats, reports CRUD)
│   ├── dashboard/        # Ward performance & civic analytics
│   ├── login/            # Authentication & Registration (preserved)
│   ├── map/              # Interactive Leaflet map view for reports
│   ├── profile/          # Citizen profile information
│   ├── report/           # Grievance reporting step wizard
│   ├── reports/          # List of reported grievances and status feeds
│   ├── settings/         # Accessibility & System preferences
│   ├── support/          # Helpdesk & FAQ components
│   └── layout.js         # Core shell layout
├── components/           # Reusable UI Components (AppShell, MapContainer)
├── lib/                  # Backend utilities (better-sqlite3 db manager, Gemini SDK config)
└── public/               # Static assets & icons
```

---

## ⚙️ Getting Started

### Prerequisites

*   Node.js (v18.x or above)
*   NPM / Yarn / PNPM

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/raahmiranjan3631/NagarSeva.git
    cd nagarseva
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup environment variables:**
    Create a `.env.local` file in the root directory:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

5.  **Build for Production:**
    ```bash
    npm run build
    npm run start
    ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
