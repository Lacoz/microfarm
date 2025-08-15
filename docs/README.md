# MicroFarm Documentation

Welcome to the MicroFarm project documentation. This folder contains all the documentation for the TypeScript monorepo farming simulation game.

## 📚 Documentation Index

### Development Guides
- **[Quick Reference](./quick-reference.md)** - Common commands, patterns, and troubleshooting guide

### Project Structure
```
microfarm/
├── .cursor/
│   └── rules/
│       └── instructions.mdc # Development rules and best practices
├── docs/                  # Project documentation
│   ├── README.md         # This file
│   └── quick-reference.md # Development quick reference
├── packages/
│   ├── shared/           # Shared types and utilities
│   ├── backend/          # Express.js API server
│   └── frontend/         # Vite-based frontend
└── README.md             # Main project README
```

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Build Shared Package**: `npm run build:shared`
3. **Start Development**: `npm run dev`
4. **Access the Game**: http://localhost:3000

## 📖 Documentation Sections

### For Developers
- **[Quick Reference](./quick-reference.md)** - Essential commands and patterns
- **[Development Rules](../.cursor/rules/instructions.mdc)** - Comprehensive coding standards

### For Contributors
- See the main [README.md](../README.md) for project overview
- Check [Development Rules](../.cursor/rules.mdc) for coding standards
- Use [Quick Reference](./quick-reference.md) for common tasks

## 🔧 Development Workflow

1. **Setup**: Follow the quick reference for initial setup
2. **Development**: Use the development rules for coding standards
3. **Testing**: Run tests and check for TypeScript errors
4. **Building**: Build packages before deployment
5. **Documentation**: Keep documentation up-to-date

## 📝 Contributing

When contributing to this project:

1. Read the [Development Rules](../.cursor/rules/instructions.mdc)
2. Follow the patterns in [Quick Reference](./quick-reference.md)
3. Update documentation when adding new features
4. Ensure all TypeScript checks pass
5. Test your changes thoroughly

## 🎯 Key Resources

- **Main Project**: [README.md](../README.md)
- **Development Rules**: [.cursor/rules/instructions.mdc](../.cursor/rules/instructions.mdc)
- **Quick Reference**: [quick-reference.md](./quick-reference.md)
- **API Documentation**: See backend source code for endpoints
- **Game Logic**: See frontend source code for game mechanics

---

For questions or issues, please refer to the main project README or create an issue in the repository.
