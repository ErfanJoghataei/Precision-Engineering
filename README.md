# Precision Engineering Platform

A full-stack portfolio project with a React/Vite frontend and an ASP.NET Core API for managing engineering projects, insights, files, messages, and administrator access.

## Current stack

- React 19 and Vite 7
- ASP.NET Core on .NET 10
- Entity Framework Core 10 with SQL Server
- JWT authentication and BCrypt password hashing
- A three-project backend: API, business logic, and data access

## Repository structure

```text
src/                                      React application
Public/                                   Static frontend assets
Precision Engineering/
  Precision Engineering.Api/             Controllers, DTOs, startup configuration
  Precision Engineering.BLL/             Application services and JWT handling
  Precision Engineering.DAL/             EF Core context, entities, and migrations
```

The project uses a traditional layered architecture. The API references the business-logic and data-access projects, while the BLL contains application services for projects, insights, files, and authentication.

## Main capabilities

- Public home content and engineering project listings
- Project and insight management
- File upload and management endpoints
- Contact-message submission and dashboard views
- JWT-based administrator authentication

## Local setup

Requirements: .NET 10 SDK, Node.js, and SQL Server or LocalDB.

```bash
git clone https://github.com/ErfanJoghataei/Precision-Engineering.git
cd Precision-Engineering
npm install
```

Copy the backend configuration template and provide development-only values:

```powershell
Copy-Item "Precision Engineering/Precision Engineering.Api/appsettings.example.json" `
  "Precision Engineering/Precision Engineering.Api/appsettings.json"
```

Prefer .NET User Secrets or environment variables for sensitive values. For example:

```text
ConnectionStrings__cnnstring
Jwt__Key
Jwt__Issuer
Jwt__Audience
```

Run the backend and frontend in separate terminals:

```bash
dotnet run --project "Precision Engineering/Precision Engineering.Api/Precision Engineering.Api.csproj"
npm run dev
```

## Verification

```bash
dotnet build "Precision Engineering/Precision Engineering.slnx"
npm run lint
npm run build
```

## Roadmap

- Add unit and integration tests
- Add CI for frontend and backend builds
- Publish screenshots and a hosted demo
- Improve API documentation and validation responses

This repository is a personal learning and portfolio project, not a production service.

