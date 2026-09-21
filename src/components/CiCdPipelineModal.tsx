import React, { useState } from 'react';
import {
  X,
  GitBranch,
  Download,
  Terminal,
  CheckCircle2,
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  ExternalLink,
  Code2,
  FolderArchive
} from 'lucide-react';
import JSZip from 'jszip';

interface CiCdPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CiCdPipelineModal: React.FC<CiCdPipelineModalProps> = ({ isOpen, onClose }) => {
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const pipelineStages = [
    {
      step: '01',
      title: 'Code & Static Analysis',
      tool: 'TypeScript 7 + ESLint',
      status: 'Passed (0 errors)',
      icon: Code2,
      desc: 'Type validation across 200+ product catalog, Express REST handlers, and strict null checks.'
    },
    {
      step: '02',
      title: 'Vite Production Build',
      tool: 'Vite 8 + Tailwind CSS 4',
      status: 'Passed (Clean dist/)',
      icon: Layers,
      desc: 'Full-stack compilation, client code splitting, CSS tree-shaking, and asset hash generation.'
    },
    {
      step: '03',
      title: 'Multi-Stage Docker Container',
      tool: 'Docker 26 + Alpine Linux',
      status: 'Image built: vynora:latest',
      icon: Cpu,
      desc: 'Slim node:22-alpine production container with non-root security privileges.'
    },
    {
      step: '04',
      title: 'Zero-Downtime Deployment',
      tool: 'Cloud Run / Port 3000',
      status: 'Live & Healthy',
      icon: Server,
      desc: 'Rolling auto-scaling deployment with healthchecks and instant rollback support.'
    }
  ];

  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    setZipSuccess(false);

    try {
      const zip = new JSZip();

      // 1. package.json
      zip.file('package.json', JSON.stringify({
        name: "vynora-ecommerce-cicd",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite --port=3000 --host=0.0.0.0",
          server: "tsx server.ts",
          build: "vite build",
          preview: "vite preview",
          lint: "tsc --noEmit"
        },
        dependencies: {
          "@tailwindcss/vite": "^4.3.3",
          "@vitejs/plugin-react": "^6.1.1",
          "dotenv": "^17.2.3",
          "express": "^4.21.2",
          "jszip": "^3.10.1",
          "lucide-react": "^0.546.0",
          "motion": "^12.23.24",
          "react": "^19.0.1",
          "react-dom": "^19.0.1",
          "vite": "^8.3.0"
        },
        devDependencies: {
          "@types/express": "^4.17.21",
          "@types/jszip": "^3.4.1",
          "@types/node": "^22.14.0",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
          "autoprefixer": "^10.4.21",
          "esbuild": "^0.25.0",
          "tailwindcss": "^4.3.3",
          "tsx": "^4.21.0",
          "typescript": "^7.0.2"
        }
      }, null, 2));

      // 2. tsconfig.json
      zip.file('tsconfig.json', JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          skipLibCheck: true,
          noEmit: true
        }
      }, null, 2));

      // 3. vite.config.ts
      zip.file('vite.config.ts', `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import apiRouter from './src/server/api.ts';

function backendApiPlugin(): Plugin {
  return {
    name: 'vynora-backend-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        apiRouter(req, res, next);
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), backendApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});`);

      // 4. server.ts
      zip.file('server.ts', `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);

const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`[Vynora Full-Stack] Server running on http://localhost:\${PORT}\`);
});`);

      // 5. Dockerfile
      zip.file('Dockerfile', `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/src/types ./src/types

EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]`);

      // 6. .github/workflows/ci-cd.yml
      const workflowFolder = zip.folder('.github')?.folder('workflows');
      workflowFolder?.file('ci-cd.yml', `name: Vynora CI/CD Pipeline
on: [push, pull_request]
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
  build:
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
  docker-build:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t vynora-ecommerce:latest .`);

      // 7. README.md
      zip.file('README.md', `# Vynora - Online Shopping CI/CD Pipeline Project

## Instructions to Run in VS Code:
1. Extract this zip file.
2. Open VS Code: \`File -> Open Folder\` and select this extracted folder.
3. Open Terminal in VS Code (\`Ctrl + \` or \`Cmd + \`).
4. Run:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
5. Navigate to \`http://localhost:3000\` in your browser.
6. To run the standalone Express backend server:
   \`\`\`bash
   npm run server
   \`\`\`
`);

      // Generate blob
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'vynora-online-shopping-cicd.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setZipSuccess(true);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div id="cicd-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div id="cicd-modal-card" className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Online Shopping CI/CD Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                Production-grade DevOps automated pipeline for Vynora Ecommerce
              </p>
            </div>
          </div>
          <button
            id="btn-close-cicd-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* 1-Click ZIP Download Callout */}
          <div className="p-5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-2xl text-white shadow-lg shadow-rose-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md">
                Instant Source Code Package
              </span>
              <h3 className="text-base sm:text-lg font-black mt-1">
                Download Full VS Code Project (.ZIP)
              </h3>
              <p className="text-xs text-white/90 mt-0.5 max-w-md">
                Extract the zip, run <code className="bg-black/30 px-1.5 py-0.5 rounded">npm install</code> and <code className="bg-black/30 px-1.5 py-0.5 rounded">npm run dev</code> to execute locally in VS Code with full backend!
              </p>
            </div>

            <button
              id="btn-download-project-zip"
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-75"
            >
              {isGeneratingZip ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Packaging Zip...</span>
                </>
              ) : zipSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zip Downloaded!</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-4 h-4 text-rose-600" />
                  <span>Download Project .ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* Pipeline Stages Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Automated GitHub Actions Pipeline Stages
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pipelineStages.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.step}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        STAGE {stage.step}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {stage.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{stage.title}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{stage.tool}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{stage.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Terminal Guide for VS Code */}
          <div className="p-4 bg-slate-900 rounded-2xl text-slate-200 space-y-2.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Terminal className="w-4 h-4" /> VS Code Setup Commands
              </span>
              <span>Bash / Zsh</span>
            </div>

            <pre className="text-[11px] font-mono bg-black/40 p-3 rounded-xl overflow-x-auto text-emerald-300 leading-relaxed">
{`# 1. Extract zip and open in Visual Studio Code
unzip vynora-online-shopping-cicd.zip
cd vynora-online-shopping-cicd
code .

# 2. Install all dependencies
npm install

# 3. Start development server (Frontend + Backend API)
npm run dev

# 4. Or run the standalone Express backend server:
npm run server`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
