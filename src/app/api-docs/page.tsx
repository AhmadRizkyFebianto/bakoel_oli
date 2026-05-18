'use client';

import { useEffect, useRef } from 'react';
import Head from 'next/head';

export default function ApiDocs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Swagger UI from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css';
    document.head.appendChild(link);

    const standaloneScript = document.createElement('script');
    standaloneScript.src = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js';
    standaloneScript.async = true;
    document.body.appendChild(standaloneScript);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      window.SwaggerUIBundle({
        url: '/api/docs',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          // @ts-ignore
          window.SwaggerUIBundle.presets.apis,
          // @ts-ignore
          window.SwaggerUIStandalonePreset
        ],
        plugins: [
          // @ts-ignore
          window.SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      document.body.removeChild(standaloneScript);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>API Documentation - Bakoel Oli</title>
      </Head>
      <div id="swagger-ui" ref={containerRef}></div>
    </div>
  );
}
