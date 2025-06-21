# 🎨 Doodle Platform - React.js

A canvas drawing application built with React, TypeScript, and Vite.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Canvas](https://img.shields.io/badge/Canvas-000000?style=for-the-badge&logo=html5&logoColor=white)

## ✨ Features

### 🖌️ Drawing Tools

- **Brush Tool**: Freehand drawing with customizable brush sizes (1-20px)
- **Shape Tools**: Draw lines, rectangles, and circles
- **Flood Fill**: Bucket tool to fill enclosed areas with color
- **Eraser**: Remove parts of your drawing

### 📝 Canvas Operations and Features

- **Undo Functionality**
- **Clear Canvas**
- **Save as Image**
- **Error Boundary**
- **History Management**

### ⌨️ Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z`: Undo last action
- `Ctrl+S` / `Cmd+S`: Save canvas as image
- `Ctrl+Delete` / `Cmd+Delete`: Clear entire canvas
- `1-5`: Switch between tools (Brush, Line, Rectangle, Circle, Fill)
- `E`: Toggle eraser mode

## 🚀 Running Locally

### Prerequisites

- Node.js (version 20 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/utk09-NCL/ghw-doodle-platform
   cd ghw-doodle-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start doodling!

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🛠️ Development

### Project Structure

```text
src/
├── components/        # Reusable React components
│   └── ErrorBoundary.tsx
├── config/            # Application configuration
│   └── app.ts
├── hooks/             # Custom React hooks
│   ├── useCanvasHistory.ts
│   └── useDrawing.ts
├── types/             # TypeScript type definitions
│   └── canvas.ts
├── utils/             # Utility functions
│   ├── canvasUtils.ts
│   ├── floodFillUtils.ts
│   └── shapeUtils.ts
├── App.tsx              # Main application component
├── CanvasComponent.tsx  # Canvas drawing component
└── ToolbarComponent.tsx # Tool selection interface
```

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help improve the Doodle Platform:

### 🐛 Known Issues & Missing Features

#### High Priority

- [ ] **Mobile Touch Support**: Add touch event handlers for mobile devices
- [ ] **Redo Functionality**: Implement redo after undo operations
- [ ] **Canvas Resizing**: Allow users to change canvas dimensions
- [ ] **Performance Optimization**: Optimize for large canvas operations

#### Medium Priority

- [ ] **Additional Shapes**: Add polygon, star, and arrow tools
- [ ] **Text Tool**: Allow adding text to drawings
- [ ] **Layer System**: Support for multiple drawing layers
- [ ] **Grid/Snap**: Optional grid overlay and snap-to-grid functionality
- [ ] **Export Formats**: Support for JPEG, SVG export formats

#### Low Priority

- [ ] **Zoom In/Out**: Canvas zoom functionality
- [ ] **Color Palette Import**: Load custom color palettes
- [ ] **Drawing Templates**: Pre-made templates and backgrounds
- [ ] **Collaborative Drawing**: Real-time collaboration features
- [ ] **Animation Support**: Simple frame-by-frame animation

### 🐞 Bug Reports

- Flood fill sometimes misses pixels on anti-aliased edges

### Getting Started with Contributing

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
4. **Follow the coding standards**

   - Use TypeScript for type safety
   - Follow existing code formatting
   - Add JSDoc comments for new functions
   - Write meaningful commit messages

5. **Test your changes**

   ```bash
   npm run lint
   npm run build
   ```

6. **Submit a pull request**

### 📋 Contribution Guidelines

- **Code Style**: Follow the existing TypeScript/React patterns
- **Testing**: Test your changes across different browsers
- **Documentation**: Update README.md if adding new features
- **Performance**: Consider performance impact of new features
- **Accessibility**: Ensure new features are accessible (ARIA labels, keyboard navigation)

### 💡 Feature Requests

Open an issue with the label "enhancement" and describe:

- What feature you'd like to see
- Why it would be useful
- Any implementation ideas you have

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute as needed.

---

Built with ❤️ as part of [MLH Global Hack Week](https://ghw.mlh.io/)

Happy doodling! 🎨✨
