# File Vault - Resumable File Upload Application

A production-ready React application for resumable file uploads using the TUS (Tus Resumable Upload) protocol. Features include progress tracking, pause/resume functionality, file preview, and modern UI with accessibility support.

## 🚀 Features

- **Resumable Uploads**: Upload large files with automatic resume capability
- **Progress Tracking**: Real-time upload progress with speed and time display
- **Pause/Resume**: Pause and resume uploads at any time
- **File Preview**: Preview uploaded files (text, PDF, images) directly in the browser
- **Metadata Support**: Add custom metadata to uploads
- **Chunk Size Configuration**: Configurable upload chunk sizes (5MB, 10MB, 20MB, or custom)
- **Modern UI**: Responsive design with dark mode and accessibility support
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Production Ready**: Optimized for production deployment

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/file-vault.git
   cd file-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Build for Production

### Development Build (with source maps)
```bash
npm run build:dev
```

### Production Build (optimized, no source maps)
```bash
npm run build
```

### Serve Production Build
```bash
npm run serve
```

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production (optimized)
- `npm run build:dev` - Build for development (with source maps)
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size
- `npm run serve` - Serve production build locally

## 🔧 Configuration

### TUS Endpoint
The application uses the TUS demo server by default. To use your own TUS server, update the `TUS_ENDPOINT` constant in `src/UploadComponent.js`:

```javascript
const TUS_ENDPOINT = "https://your-tus-server.com/files/";
```

### Chunk Sizes
Available chunk sizes:
- 5MB (default)
- 10MB
- 20MB
- Custom (user-defined)

## 🎨 Features in Detail

### Upload Process
1. **File Selection**: Choose a file using the file input
2. **Metadata Entry**: Optionally add metadata in key:value format
3. **Chunk Size Selection**: Choose upload chunk size
4. **Upload**: Click "Start Upload" to begin
5. **Progress Tracking**: Monitor real-time progress, speed, and elapsed time
6. **Pause/Resume**: Pause uploads and resume later
7. **Completion**: View upload success with file details

### File Preview
- **Text Files**: Display content in formatted text
- **PDF Files**: Show PDF preview in iframe
- **Images**: Display image preview
- **Other Files**: Show download link

### Error Handling
- File selection validation
- Network error recovery
- Upload failure notifications
- User-friendly error messages

## 🌐 Browser Support

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## ♿ Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion support
- ARIA labels and descriptions

## 🎨 Theming

The application supports:
- **Light Mode**: Default theme
- **Dark Mode**: Automatic based on system preference
- **High Contrast**: Enhanced contrast for accessibility
- **Reduced Motion**: Respects user motion preferences

## 📱 Responsive Design

- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface for small screens

## 🔒 Security Considerations

- No sensitive data stored locally
- Secure file uploads via HTTPS
- Input validation and sanitization
- XSS protection through React's built-in mechanisms

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Vercel
1. Import your GitHub repository
2. Framework preset: Create React App
3. Build command: `npm run build`
4. Output directory: `build`

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm test -- --watchAll=false
```

## 📊 Performance

- **Bundle Size**: Optimized with tree shaking
- **Loading Speed**: Lazy loading and code splitting
- **Memory Usage**: Efficient state management
- **Network**: Optimized chunk sizes for different connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TUS Protocol](https://tus.io/) for resumable upload specification
- [tus-js-client](https://github.com/tus/tus-js-client) for JavaScript implementation
- [SweetAlert2](https://sweetalert2.github.io/) for beautiful alerts
- [React](https://reactjs.org/) for the UI framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Made with ❤️ for reliable file uploads**
